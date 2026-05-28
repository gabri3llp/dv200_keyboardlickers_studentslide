import { useEffect, useState } from 'react';
import { Alert, Button, Container, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLiveListings = async () => {
      try {
        const response = await fetch(`${API_URL}/listings?state=live`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Could not load marketplace listings');
        }

        setListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLiveListings();
  }, []);

  return (
    <div className="marketplace-page">
      <Container className="py-5">
        <div className="marketplace-header">
          <div>
            <p className="listing-eyebrow">StudentSlide</p>
            <h1 className="listing-title">Marketplace</h1>
            <p className="listing-subtitle">Live listings approved for students to browse.</p>
          </div>
          <Button as={Link} to="/createListing" className="listing-primary-btn">
            Add product
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="listing-loading">
            <Spinner animation="border" size="sm" />
            <span>Loading marketplace...</span>
          </div>
        ) : listings.length === 0 ? (
          <div className="listing-empty">
            <h2>No live products yet</h2>
            <p>Approve a pending listing to make it appear here.</p>
          </div>
        ) : (
          <div className="marketplace-grid">
            {listings.map((listing) => (
              <article className="marketplace-card" key={listing._id}>
                <img src={listing.image} alt={listing.title} />
                <div className="marketplace-card-body">
                  <span>{listing.category}</span>
                  <h2>{listing.title}</h2>
                  <p>{listing.description}</p>
                  <strong>R {Number(listing.price).toFixed(2)}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Marketplace;
