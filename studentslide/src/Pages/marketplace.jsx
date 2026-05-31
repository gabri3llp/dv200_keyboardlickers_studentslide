import { useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getListings } from '../api/listings';
import logo from '../assets/StudentSlide_Logo_Full.png';
import { listingCategories, sampleListings } from '../data/sampleListings';

const CATEGORIES = ['ALL ITEMS', ...listingCategories.map((category) => category.toUpperCase())];

const Marketplace = ({ user, onLogout }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL ITEMS');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const canManageListings = user?.role === 'admin' || user?.role === 'moderator';

  useEffect(() => {
    const loadLiveListings = async () => {
      try {
        const liveListings = await getListings('live');
        setListings(liveListings.length > 0 ? liveListings : sampleListings);
      } catch {
        setListings(sampleListings);
      } finally {
        setLoading(false);
      }
    };

    loadLiveListings();
  }, []);

  const categoryFiltered = activeCategory === 'ALL ITEMS'
    ? listings
    : listings.filter((listing) => listing.category?.toUpperCase() === activeCategory);

  const visibleListings = categoryFiltered.filter((listing) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    return [listing.title, listing.category, listing.description]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  });

  return (
    <div className="mp-page">
      <nav className="mp-nav">
        <Link to="/marketplace">
          <img src={logo} alt="StudentSlide" className="mp-nav-logo" />
        </Link>
        <div className="mp-nav-links">
          <Link to="/marketplace" className="mp-nav-link active">MARKETPLACE</Link>
          <Link to="/listings" className="mp-nav-link">SELL</Link>
          {canManageListings && <Link to="/admin/listings" className="mp-nav-link">ADMIN</Link>}
          <Link to="/messages" className="mp-nav-link">MESSAGES</Link>
          <Link to="/aboutus" className="mp-nav-link">ABOUT US</Link>
        </div>
        <div className="mp-nav-right">
          <div className="mp-search-bar">
            <input
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <span>Search</span>
          </div>
          <div className="mp-avatar" />
          {user ? (
            <button className="mp-logout-btn" onClick={onLogout}>LOG OUT</button>
          ) : (
            <Link to="/auth" className="mp-nav-link">SIGN IN</Link>
          )}
        </div>
      </nav>

      <Container fluid className="mp-container">
        <div className="mp-filters">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={`mp-filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mp-loading">
            <Spinner animation="border" />
            <span>Loading marketplace...</span>
          </div>
        ) : visibleListings.length === 0 ? (
          <div className="mp-empty">
            <h2>No listings yet</h2>
            <p>Approve a listing or add your own product.</p>
            <Link to="/listings" className="mp-add-btn">Add Product</Link>
          </div>
        ) : (
          <>
            <div className="mp-grid">
              {visibleListings.map((listing) => (
                <article
                  className="mp-card"
                  key={listing._id}
                  onClick={() => navigate(`/product/${listing._id}`)}
                >
                  <div className="mp-card-img-wrap">
                    <img src={listing.image} alt={listing.title} className="mp-card-img" />
                  </div>
                  <div className="mp-card-body">
                    <span className="mp-card-category">{listing.category}</span>
                    <h2 className="mp-card-title">{listing.title}</h2>
                    <p className="mp-card-seller">Listed by {listing.sellerName || 'Student seller'}</p>
                    <p className="mp-card-desc">{listing.description}</p>
                    <p className="mp-card-price">R {Number(listing.price).toFixed(2)}</p>
                    <button className="mp-cart-btn" type="button">ADD TO CART</button>
                    <span className="mp-star">Save</span>
                  </div>
                </article>
              ))}
            </div>
            <p className="mp-count">
              showing {visibleListings.length} out of {listings.length} listed products
            </p>
          </>
        )}
      </Container>
    </div>
  );
};

export default Marketplace;
