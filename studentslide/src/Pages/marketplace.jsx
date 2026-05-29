import { useEffect, useState } from 'react';
import { Alert, Container, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const CATEGORIES = ['ALL ITEMS', 'ELECTRONICS', 'APPAREL', 'EQUIPMENT', 'DORM LIFE', 'CLOTHING'];

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL ITEMS');
  const navigate = useNavigate();

  useEffect(() => {
    const loadLiveListings = async () => {
      try {
        const response = await fetch(`${API_URL}/listings?state=live`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not load marketplace listings');
        setListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadLiveListings();
  }, []);

  const filtered = activeCategory === 'ALL ITEMS'
    ? listings
    : listings.filter(l => l.category?.toUpperCase() === activeCategory);

  return (
    <div className="mp-page">

      {/* Navbar */}
      <nav className="mp-nav">
        <Link to="/marketplace">
          <img src="/src/assets/StudentSlide_Logo_Full.png" alt="StudentSlide" className="mp-nav-logo" />
        </Link>
        <div className="mp-nav-links">
          <Link to="/marketplace" className="mp-nav-link active">MARKETPLACE</Link>
          <Link to="/messages" className="mp-nav-link">MESSAGES</Link>
          <Link to="/aboutus" className="mp-nav-link">ABOUT US</Link>
        </div>
        <div className="mp-nav-right">
          <div className="mp-search-bar">
            <input placeholder="Search listings..." />
            <span>🔍</span>
          </div>
          <div className="mp-avatar" />
          <span className="mp-fav-icon">⭐</span>
        </div>
      </nav>

      <Container fluid className="mp-container">

        {/* Category filters */}
        <div className="mp-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`mp-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="mp-loading">
            <Spinner animation="border" />
            <span>Loading marketplace...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mp-empty">
            <h2>No listings yet</h2>
            <p>Check back soon or add your own!</p>
            <Link to="/createListing" className="mp-add-btn">+ Add Product</Link>
          </div>
        ) : (
          <>
            <div className="mp-grid">
              {filtered.map((listing) => (
                <article
                  className="mp-card"
                  key={listing._id}
                  onClick={() => navigate(`/product/${listing._id}`)}
                >
                  <div className="mp-card-img-wrap">
                    <img src={listing.image} alt={listing.title} className="mp-card-img" />
                  </div>
                  <div className="mp-card-body">
                    <h2 className="mp-card-title">{listing.title}</h2>
                    <p className="mp-card-desc">{listing.description}</p>
                    <button className="mp-cart-btn">ADD TO CART</button>
                    <span className="mp-star">⭐</span>
                  </div>
                </article>
              ))}
            </div>
            <p className="mp-count">showing {filtered.length} out of {listings.length} listed products</p>
          </>
        )}
      </Container>
    </div>
  );
};

export default Marketplace;