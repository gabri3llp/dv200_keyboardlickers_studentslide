import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { getListings } from '../api/listings';
import Navbar from '../Component/navbar';
import Footer from '../Component/footer';
import { useCart } from '../context/CartContext';
import { listingCategories, sampleListings } from '../data/sampleListings';
import './Marketplace.css';

const CATEGORIES = ['All items', ...listingCategories];

export default function Marketplace({ user, onLogout }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All items');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const demoMode = searchParams.get('demo') === '1';
  const { addToCart } = useCart();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      setListings([]);
      if (demoMode) {
        setLoading(false);
        return;
      }
      try {
        const data = await getListings('live');
        if (!Array.isArray(data)) throw new Error('The marketplace returned an unexpected response.');
        if (!cancelled) setListings(data);
      } catch {
        if (!cancelled) setError('We could not reach the marketplace. Check your connection and try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [demoMode, reload]);

  const source = demoMode ? sampleListings : listings;
  const query = searchTerm.trim().toLowerCase();
  const visibleListings = source.filter((listing) =>
    (activeCategory === 'All items' || listing.category?.toLowerCase() === activeCategory.toLowerCase()) &&
    (!query || [listing.title, listing.category, listing.description].filter(Boolean)
      .some((value) => value.toLowerCase().includes(query)))
  );
  const resetFilters = () => { setSearchTerm(''); setActiveCategory('All items'); };
  const setDemoMode = (enabled) => {
    resetFilters();
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (enabled) next.set('demo', '1');
      else next.delete('demo');
      return next;
    });
  };

  return (
    <div className="ss-page ss-marketplace">
      <Navbar isLoggedIn={Boolean(user)} user={user} onLogout={onLogout} />
      <main className="ss-main">
        <div className="ss-toolbar">
          <div>
            <p className="ss-eyebrow">StudentSlide marketplace</p>
            <h1 className="ss-title">Find your next <span className="ss-gradient-text">campus essential.</span></h1>
            <p className="ss-subtitle">Browse approved student listings, from textbooks to everyday essentials.</p>
          </div>
          <div className="ss-market-actions">
            {user && <Link to="/my-listings" className="ss-btn ss-btn--ghost">My Listings</Link>}
            <Link to={user ? '/listings' : '/auth'} className="ss-btn ss-btn--primary">Sell an item</Link>
          </div>
        </div>

        {demoMode ? (
          <div className="ss-alert ss-market-notice" role="status">
            <div><strong>Demo mode</strong><p>These are sample products, not real listings. Cart and trade actions are disabled.</p></div>
            <button type="button" className="ss-btn ss-btn--ghost ss-btn--sm" onClick={() => setDemoMode(false)}>Return to live listings</button>
          </div>
        ) : (
          <div className="ss-market-mode">
            <span>Live marketplace</span>
            <button type="button" className="ss-btn ss-btn--ghost ss-btn--sm" onClick={() => setDemoMode(true)}>Explore demo products</button>
          </div>
        )}

        <section className="ss-card ss-market-filters" aria-label="Search and filter listings">
          <label className="ss-label" htmlFor="market-search">Search listings</label>
          <input id="market-search" className="ss-input" type="search" placeholder="Search textbooks, electronics and more..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          <div className="ss-market-categories" aria-label="Categories">
            {CATEGORIES.map((category) => (
              <button key={category} type="button" className={`ss-btn ss-btn--sm ${activeCategory === category ? 'ss-btn--primary' : 'ss-btn--ghost'}`} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>
            ))}
          </div>
        </section>

        {loading && !demoMode ? (
          <div className="ss-card ss-state" role="status"><Spinner animation="border" size="sm" /><span>Loading marketplace...</span></div>
        ) : error && !demoMode ? (
          <div className="ss-card ss-state" role="alert">
            <h2>Marketplace unavailable</h2><p>{error}</p>
            <button type="button" className="ss-btn ss-btn--primary" onClick={() => setReload((value) => value + 1)}>Try again</button>
          </div>
        ) : source.length === 0 ? (
          <div className="ss-card ss-state">
            <h2>No approved listings yet</h2><p>New listings appear here once a moderator approves them.</p>
            <Link to={user ? '/listings' : '/auth'} className="ss-btn ss-btn--primary">List an item</Link>
          </div>
        ) : visibleListings.length === 0 ? (
          <div className="ss-card ss-state"><h2>No matching listings</h2><p>Try another search or category.</p><button type="button" className="ss-btn ss-btn--ghost" onClick={resetFilters}>Clear filters</button></div>
        ) : (
          <>
            <p className="ss-market-count" role="status">Showing {visibleListings.length} of {source.length} {demoMode ? 'sample products' : 'approved listings'}</p>
            {!demoMode && <p className="ss-market-help">Trade requests currently open a local demonstration; they are not sent to sellers.</p>}
            <div className="ss-market-grid">
              {visibleListings.map((listing) => (
                <article className="ss-card ss-market-product" key={listing._id}>
                  <div className="ss-market-image"><img src={listing.image} alt={listing.title} loading="lazy" />{demoMode && <span className="ss-badge">Sample product</span>}</div>
                  <div className="ss-market-body">
                    <span className="ss-market-category">{listing.category}</span>
                    <h2>{demoMode ? listing.title : <Link to={`/product/${listing._id}`}>{listing.title}</Link>}</h2>
                    <p className="ss-market-seller">Listed by {listing.sellerName || 'Student seller'}</p>
                    <p className="ss-market-description">{listing.description}</p>
                    <strong className="ss-market-price">R {Number(listing.price).toFixed(2)}</strong>
                    <div className="ss-market-card-actions">
                      <button type="button" className="ss-btn ss-btn--primary ss-btn--sm" disabled={demoMode} onClick={() => addToCart(listing)}>Add to cart</button>
                      {demoMode ? <button type="button" className="ss-btn ss-btn--ghost ss-btn--sm" disabled>Trade demo</button> : <Link className="ss-btn ss-btn--ghost ss-btn--sm" to={`/product/${listing._id}`}>Trade demo</Link>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
