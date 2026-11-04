import { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { deleteListing, getReviewListings, updateListingState } from '../api/listings';
import Navbar from '../Component/navbar';
import Footer from '../Component/footer';
import './AdminListings.css';

const formatPrice = (value) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(Number(value) || 0);
const formatDate = (value) => {
  if (!value || Number.isNaN(new Date(value).getTime())) return 'Date unavailable';
  return new Date(value).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
};

function ReviewImage({ src, title }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="admin-review-card__image">
      {src && !failed ? <img src={src} alt={title} onError={() => setFailed(true)} loading="lazy" /> : <span role="img" aria-label={`Image unavailable for ${title}`}>Image unavailable</span>}
    </div>
  );
}

function ListingReviewCard({ listing, disabled, working, onStateChange, onDelete }) {
  const live = listing.listingState === 'live';
  return (
    <article className="ss-card admin-review-card" aria-busy={working}>
      <ReviewImage key={listing.image} src={listing.image} title={listing.title} />
      <div className="admin-review-card__body">
        <div className="admin-review-card__meta">
          <span className={`ss-badge ss-badge--${live ? 'live' : 'pending'}`}>{live ? 'Live' : 'Pending review'}</span>
          <span>{listing.category}</span>
          <span>{formatDate(listing.createdAt)}</span>
        </div>
        <h2>{listing.title}</h2>
        <p>{listing.description}</p>
        <div className="admin-review-card__meta admin-review-card__seller">
          <strong>{formatPrice(listing.price)}</strong>
          <span>Listed by {listing.sellerName || 'Seller not recorded (older listing)'}</span>
        </div>
      </div>
      <div className="admin-review-card__actions">
        <button type="button" className={`ss-btn ss-btn--sm ${live ? 'ss-btn--ghost' : 'ss-btn--primary'}`} disabled={disabled} onClick={() => onStateChange(listing, live ? 'pending' : 'live')}>
          {working ? 'Updating...' : live ? 'Unpublish' : 'Approve'}
        </button>
        <button type="button" className="ss-btn ss-btn--danger ss-btn--sm" disabled={disabled} onClick={() => onDelete(listing)}>{live ? 'Remove' : 'Reject'}</button>
      </div>
    </article>
  );
}

export default function AdminListings({ user, onLogout }) {
  const canModerate = user?.role === 'admin' || user?.role === 'moderator';
  const userId = user?._id;
  const [listings, setListings] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState('');
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [accessError, setAccessError] = useState(null);
  const [notice, setNotice] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const requestId = useRef(0);
  const busy = useRef(false);

  const loadListings = async () => {
    if (!canModerate || !userId) return;
    const currentRequest = ++requestId.current;
    setLoading(true);
    setLoadError('');
    try {
      const data = await getReviewListings();
      if (!Array.isArray(data)) throw new Error('The review queue returned an unexpected response.');
      if (currentRequest !== requestId.current) return;
      setListings(data);
      setAccessError(null);
      setLastUpdated(new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      if (currentRequest !== requestId.current) return;
      if (err.status === 401 || err.status === 403) setAccessError(err.status);
      else setLoadError('Could not load the review queue. Check your connection and try again.');
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  };

  useEffect(() => {
    if (!canModerate || !userId) return;
    const currentRequest = ++requestId.current;
    getReviewListings().then((data) => {
      if (!Array.isArray(data)) throw new Error('Unexpected review queue response');
      if (currentRequest !== requestId.current) return;
      setListings(data);
      setAccessError(null);
      setLastUpdated(new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }));
    }).catch((err) => {
      if (currentRequest !== requestId.current) return;
      if (err.status === 401 || err.status === 403) setAccessError(err.status);
      else setLoadError('Could not load the review queue. Check your connection and try again.');
    }).finally(() => {
      if (currentRequest === requestId.current) setLoading(false);
    });
    return () => { requestId.current += 1; };
  }, [canModerate, userId]);

  const counts = useMemo(() => ({
    pending: listings.filter((listing) => listing.listingState === 'pending').length,
    live: listings.filter((listing) => listing.listingState === 'live').length,
  }), [listings]);
  const stateListings = listings.filter((listing) => listing.listingState === activeTab);
  const query = searchTerm.trim().toLowerCase();
  const visibleListings = stateListings.filter((listing) => !query ||
    [listing.title, listing.category, listing.description, listing.sellerName].filter(Boolean)
      .some((value) => value.toLowerCase().includes(query)));

  const handleActionError = async (err) => {
    if (err.status === 401 || err.status === 403) {
      setAccessError(err.status);
      setDeleteTarget(null);
    } else {
      setActionError(err.status ? err.message : 'Could not complete the action. Check your connection and try again.');
      if (err.status === 404 || err.status === 409) {
        setDeleteTarget(null);
        await loadListings();
      }
    }
  };

  const handleStateChange = async (listing, listingState) => {
    if (busy.current || loading) return;
    busy.current = true;
    setWorkingId(listing._id);
    setActionError('');
    setNotice('');
    try {
      const updated = await updateListingState(listing._id, listingState, listing.__v ?? 0);
      setListings((current) => current.map((item) => item._id === updated._id ? updated : item));
      setNotice(`${listing.title} ${listingState === 'live' ? 'is now live on the marketplace.' : 'has been unpublished and returned to pending review.'}`);
    } catch (err) {
      await handleActionError(err);
    } finally {
      busy.current = false;
      setWorkingId('');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || busy.current) return;
    busy.current = true;
    setWorkingId(deleteTarget._id);
    setActionError('');
    setNotice('');
    try {
      await deleteListing(deleteTarget._id, deleteTarget.__v ?? 0);
      setListings((current) => current.filter((item) => item._id !== deleteTarget._id));
      setNotice(`${deleteTarget.title} was deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      await handleActionError(err);
    } finally {
      busy.current = false;
      setWorkingId('');
    }
  };

  if (!user || !canModerate || accessError) {
    const needsSignIn = !user || accessError === 401;
    return (
      <div className="ss-page ss-admin-page">
        <Navbar isLoggedIn={Boolean(user)} user={user} onLogout={onLogout} />
        <main className="ss-main">
          <div className="ss-card ss-state">
            <p className="ss-eyebrow">StudentSlide moderation</p>
            <h1 className="ss-title">{needsSignIn ? 'Sign in to review listings' : 'Moderator access required'}</h1>
            <p>{needsSignIn ? 'Use your admin or moderator account to open the review queue.' : 'Your account does not currently have permission to moderate listings.'}</p>
            <Link to={needsSignIn ? '/auth' : '/marketplace'} className="ss-btn ss-btn--primary">{needsSignIn ? 'Sign in' : 'Back to Marketplace'}</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="ss-page ss-admin-page">
      <Navbar isLoggedIn user={user} onLogout={onLogout} />
      <main className="ss-main">
        <div className="ss-toolbar">
          <div>
            <p className="ss-eyebrow">StudentSlide moderation</p>
            <h1 className="ss-title">Listing <span className="ss-gradient-text">Review Queue</span></h1>
            <p className="ss-subtitle">Review student submissions before they appear on the marketplace. Edited listings need approval again.</p>
          </div>
          <div className="ss-card admin-review-profile"><span>Reviewing as {user.role}</span><strong>{[user.name, user.surname].filter(Boolean).join(' ') || 'Moderator'}</strong></div>
        </div>

        <section className="ss-stats" aria-label="Listing moderation statistics">
          {[['Pending review', counts.pending], ['Live marketplace', counts.live], ['Total listings', listings.length]].map(([label, count]) => (
            <article className="ss-card ss-stat" key={label}><span>{label}</span><strong>{loading || loadError ? '—' : count}</strong></article>
          ))}
        </section>

        <section className="ss-card admin-review-toolbar" aria-label="Filter review queue">
          <div className="admin-review-tabs" aria-label="Listing status">
            {['pending', 'live'].map((state) => <button key={state} type="button" className={`ss-btn ss-btn--sm ${activeTab === state ? 'ss-btn--primary' : 'ss-btn--ghost'}`} aria-pressed={activeTab === state} onClick={() => { setActiveTab(state); setActionError(''); setNotice(''); }}>{state === 'pending' ? 'Pending' : 'Live'}<span>{loading || loadError ? '—' : counts[state]}</span></button>)}
          </div>
          <div className="admin-review-tools">
            <label className="visually-hidden" htmlFor="admin-search">Search review queue</label>
            <input id="admin-search" className="ss-input" type="search" placeholder="Search listings or sellers..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            <button type="button" className="ss-btn ss-btn--ghost ss-btn--sm" disabled={loading || Boolean(workingId)} onClick={() => { setActionError(''); setNotice(''); loadListings(); }}>{loading ? 'Refreshing...' : 'Refresh'}</button>
          </div>
        </section>
        {lastUpdated && !loadError && <p className="admin-review-updated">Last refreshed at {lastUpdated}</p>}
        {notice && <div className="ss-alert" role="status">{notice}</div>}
        {actionError && !deleteTarget && <div className="ss-alert ss-alert--error" role="alert">{actionError}</div>}

        {loading ? (
          <div className="ss-card ss-state" role="status"><Spinner animation="border" size="sm" /><span>Loading review queue...</span></div>
        ) : loadError ? (
          <div className="ss-card ss-state" role="alert"><h2>Review queue unavailable</h2><p>{loadError}</p><button type="button" className="ss-btn ss-btn--primary" onClick={loadListings}>Try again</button></div>
        ) : visibleListings.length === 0 ? (
          <div className="ss-card ss-state">
            <h2>{query ? 'No matching listings' : activeTab === 'pending' ? 'No pending listings' : 'No live listings'}</h2>
            <p>{query ? 'Try another search or clear the search field.' : activeTab === 'pending' ? 'New submissions and edited listings will appear here for review.' : 'Approved listings will appear here after they go live.'}</p>
            {query && <button type="button" className="ss-btn ss-btn--ghost" onClick={() => setSearchTerm('')}>Clear search</button>}
          </div>
        ) : (
          <section className="admin-review-list" aria-label={`${activeTab} listings`}>
            {visibleListings.map((listing) => <ListingReviewCard key={listing._id} listing={listing} disabled={Boolean(workingId)} working={workingId === listing._id} onStateChange={handleStateChange} onDelete={(item) => { setActionError(''); setDeleteTarget(item); }} />)}
          </section>
        )}
      </main>
      <Footer />
      <Modal show={Boolean(deleteTarget)} onHide={() => !workingId && setDeleteTarget(null)} centered contentClassName="ss-modal" aria-labelledby="admin-delete-title">
        <Modal.Header closeButton={!workingId}><Modal.Title id="admin-delete-title">{deleteTarget?.listingState === 'live' ? 'Remove listing?' : 'Reject listing?'}</Modal.Title></Modal.Header>
        <Modal.Body>
          {actionError && <div className="ss-alert ss-alert--error" role="alert">{actionError}</div>}
          <p>This permanently deletes <strong>{deleteTarget?.title}</strong>. It cannot be restored here.</p>
          <p>{deleteTarget?.listingState === 'live' ? 'To hide it while keeping the listing, cancel and choose Unpublish instead.' : 'The seller would need to submit the item again.'}</p>
        </Modal.Body>
        <Modal.Footer><button type="button" className="ss-btn ss-btn--ghost" disabled={Boolean(workingId)} onClick={() => setDeleteTarget(null)}>Cancel</button><button type="button" className="ss-btn ss-btn--danger" disabled={Boolean(workingId)} onClick={handleDelete}>{workingId ? 'Deleting...' : 'Delete listing'}</button></Modal.Footer>
      </Modal>
    </div>
  );
}
