import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { deleteListing, getListings, updateListingState } from '../api/listings';
import logo from '../assets/StudentSlide_Logo_Full.png';
import Footer from '../Component/footer';
import './AdminListings.css';

const formatPrice = (value) => `R ${Number(value || 0).toFixed(2)}`;

const formatDate = (value) => {
  if (!value) return 'Recently';

  return new Date(value).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getUserLabel = (user) =>
  [user?.name, user?.surname].filter(Boolean).join(' ') || user?.email || 'Moderator';

function AdminStat({ label, value, tone = 'neutral' }) {
  return (
    <article className={`admin-stat admin-stat--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function AdminToast({ toast }) {
  if (!toast) return null;

  return (
    <div className={`admin-toast admin-toast--${toast.type}`}>
      {toast.message}
    </div>
  );
}

function ListingReviewCard({ listing, working, onApprove, onUnpublish, onDelete }) {
  const isLive = listing.listingState === 'live';

  return (
    <article className="admin-review-card">
      <div className="admin-review-card__image">
        {listing.image ? (
          <img
            src={listing.image}
            alt={listing.title}
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span>No image</span>
        )}
      </div>

      <div className="admin-review-card__body">
        <div className="admin-review-card__topline">
          <span className={`admin-status admin-status--${listing.listingState}`}>
            {listing.listingState}
          </span>
          <span className="admin-review-card__category">{listing.category}</span>
          <span className="admin-review-card__date">{formatDate(listing.createdAt)}</span>
        </div>

        <h2>{listing.title}</h2>
        <p>{listing.description}</p>

        <div className="admin-review-card__meta">
          <strong>{formatPrice(listing.price)}</strong>
          <span>Listed by {listing.sellerName || 'Student seller'}</span>
        </div>
      </div>

      <div className="admin-review-card__actions">
        {isLive ? (
          <button
            type="button"
            className="admin-action admin-action--secondary"
            disabled={working}
            onClick={() => onUnpublish(listing)}
          >
            Unpublish
          </button>
        ) : (
          <button
            type="button"
            className="admin-action admin-action--approve"
            disabled={working}
            onClick={() => onApprove(listing)}
          >
            Approve
          </button>
        )}

        <button
          type="button"
          className="admin-action admin-action--danger"
          disabled={working}
          onClick={() => onDelete(listing)}
        >
          {isLive ? 'Remove' : 'Reject'}
        </button>
      </div>
    </article>
  );
}

export default function AdminListings({ user, onLogout }) {
  const canModerate = user?.role === 'admin' || user?.role === 'moderator';
  const [listings, setListings] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  const pendingListings = useMemo(
    () => listings.filter((listing) => listing.listingState === 'pending'),
    [listings]
  );

  const liveListings = useMemo(
    () => listings.filter((listing) => listing.listingState === 'live'),
    [listings]
  );

  const activeListings = activeTab === 'pending' ? pendingListings : liveListings;

  const visibleListings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return activeListings;

    return activeListings.filter((listing) =>
      [listing.title, listing.category, listing.description, listing.sellerName]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [activeListings, searchTerm]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2600);
  };

  const loadListings = async () => {
    if (!canModerate) return;

    setLoading(true);
    setError('');

    try {
      const data = await getListings();
      setListings(data);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canModerate) return undefined;

    let isMounted = true;

    getListings()
      .then((data) => {
        if (!isMounted) return;
        setListings(data);
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [canModerate]);

  const updateLocalListing = (id, listingState) => {
    setListings((current) =>
      current.map((listing) =>
        listing._id === id ? { ...listing, listingState } : listing
      )
    );
  };

  const handleStateChange = async (listing, listingState) => {
    setWorkingId(listing._id);
    setError('');

    try {
      await updateListingState(listing._id, listingState);
      updateLocalListing(listing._id, listingState);
      showToast(
        listingState === 'live'
          ? `${listing.title} is now live on the marketplace.`
          : `${listing.title} has been moved back to pending.`,
        'success'
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setWorkingId('');
    }
  };

  const handleDelete = async (listing) => {
    const action = listing.listingState === 'live' ? 'remove' : 'reject';
    const confirmed = window.confirm(`Are you sure you want to ${action} "${listing.title}"?`);
    if (!confirmed) return;

    setWorkingId(listing._id);
    setError('');

    try {
      await deleteListing(listing._id);
      setListings((current) => current.filter((item) => item._id !== listing._id));
      showToast(
        listing.listingState === 'live'
          ? 'Live listing removed.'
          : 'Pending listing rejected.',
        'danger'
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setWorkingId('');
    }
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!canModerate) {
    return (
      <div className="admin-listings-page">
        <main className="admin-access-denied">
          <p className="admin-review-kicker">Admin access required</p>
          <h1>This route is for admins and moderators.</h1>
          <p>
            You are signed in as a {user.role || 'normal'} user. Ask an admin to update
            your role to admin or moderator, then sign in again.
          </p>
          <Link to="/marketplace">Back to Marketplace</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-listings-page">
      <nav className="mp-nav admin-review-nav">
        <Link to="/marketplace">
          <img src={logo} alt="StudentSlide" className="mp-nav-logo" />
        </Link>
        <div className="mp-nav-links">
          <Link to="/marketplace" className="mp-nav-link">MARKETPLACE</Link>
          <Link to="/listings" className="mp-nav-link">SELL</Link>
          <Link to="/admin/listings" className="mp-nav-link active">ADMIN</Link>
          <Link to="/messages" className="mp-nav-link">MESSAGES</Link>
          <Link to="/aboutus" className="mp-nav-link">ABOUT US</Link>
        </div>
        <div className="mp-nav-right">
          <span className="admin-review-nav__role">{user.role}</span>
          <button className="mp-logout-btn" type="button" onClick={onLogout}>
            LOG OUT
          </button>
        </div>
      </nav>

      <main className="admin-review-shell">
        <section className="admin-review-hero">
          <div>
            <p className="admin-review-kicker">StudentSlide moderation</p>
            <h1>Listing Review Queue</h1>
            <p>
              Review products before they reach buyers. Approving a listing changes its
              database state from pending to live.
            </p>
          </div>

          <div className="admin-review-profile">
            <span>Signed in as</span>
            <strong>{getUserLabel(user)}</strong>
            <small>{user.email}</small>
          </div>
        </section>

        <section className="admin-stats-grid" aria-label="Listing moderation stats">
          <AdminStat label="Pending review" value={pendingListings.length} tone="pending" />
          <AdminStat label="Live marketplace" value={liveListings.length} tone="live" />
          <AdminStat label="Total listings" value={listings.length} />
        </section>

        <section className="admin-review-toolbar">
          <div className="admin-review-tabs" role="tablist" aria-label="Listing state filters">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'pending'}
              className={activeTab === 'pending' ? 'active' : ''}
              onClick={() => setActiveTab('pending')}
            >
              Pending
              <span>{pendingListings.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'live'}
              className={activeTab === 'live' ? 'active' : ''}
              onClick={() => setActiveTab('live')}
            >
              Live
              <span>{liveListings.length}</span>
            </button>
          </div>

          <div className="admin-review-tools">
            <input
              type="search"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="button" onClick={loadListings} disabled={loading}>
              Refresh
            </button>
          </div>
        </section>

        {lastUpdated && (
          <p className="admin-review-updated">Last refreshed at {lastUpdated}</p>
        )}

        {error && <div className="admin-review-alert">{error}</div>}

        {loading ? (
          <div className="admin-review-loading">Loading listings...</div>
        ) : visibleListings.length === 0 ? (
          <div className="admin-review-empty">
            <h2>{activeTab === 'pending' ? 'No pending listings' : 'No live listings'}</h2>
            <p>
              {activeTab === 'pending'
                ? 'New seller submissions will appear here for approval.'
                : 'Approved listings will appear here after they go live.'}
            </p>
          </div>
        ) : (
          <section className="admin-review-list" aria-label={`${activeTab} listings`}>
            {visibleListings.map((listing) => (
              <ListingReviewCard
                key={listing._id}
                listing={listing}
                working={workingId === listing._id}
                onApprove={(item) => handleStateChange(item, 'live')}
                onUnpublish={(item) => handleStateChange(item, 'pending')}
                onDelete={handleDelete}
              />
            ))}
          </section>
        )}
      </main>

      <Footer />
      <AdminToast toast={toast} />
    </div>
  );
}
