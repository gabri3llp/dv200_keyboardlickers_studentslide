import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { getListing } from '../api/listings';
import logo from '../assets/StudentSlide_Logo_Full.png';
import { useCart } from '../context/CartContext';
import { getSampleListingById } from '../data/sampleListings';
import { createDemoTradeMessage, getDemoOfferListings } from '../data/demoTrades';

const ProductDetails = ({ user, onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartCount, setDrawerOpen } = useCart();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [tradeNotice, setTradeNotice] = useState('');

  useEffect(() => {
    const loadListing = async () => {
      try {
        const demoListing = getSampleListingById(id);
        if (demoListing) {
          setListing(demoListing);
          return;
        }

        setListing(await getListing(id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [id]);

  const handleComment = (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    setComments((current) => [...current, { text: comment, time: new Date().toLocaleTimeString() }]);
    setComment('');
  };

  const offerListings = listing ? getDemoOfferListings(listing._id) : [];

  const openTradeModal = () => {
    if (!user) {
      setTradeNotice('Sign in before requesting a trade.');
      return;
    }

    setSelectedOfferId(offerListings[0]?._id || '');
    setTradeNotice('');
    setShowTradeModal(true);
  };

  const sendTradeRequest = () => {
    const offeredListing = offerListings.find((item) => item._id === selectedOfferId);
    if (!offeredListing) {
      setTradeNotice('Choose a listing to offer first.');
      return;
    }

    createDemoTradeMessage({
      requestedListing: listing,
      offeredListing,
      user,
    });

    setShowTradeModal(false);
    navigate('/messages');
  };

  if (loading) {
    return (
      <div className="pd-loading">
        <Spinner animation="border" />
        <span>Loading product...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pd-page">
        <Container>
          <Alert variant="danger">{error}</Alert>
          <button className="pd-back-btn" onClick={() => navigate('/marketplace')}>Back</button>
        </Container>
      </div>
    );
  }

  return (
    <div className="pd-page">
      <nav className="mp-nav">
        <Link to="/marketplace">
          <img src={logo} alt="StudentSlide" className="mp-nav-logo" />
        </Link>
        <div className="mp-nav-links">
          <Link to="/marketplace" className="mp-nav-link active">MARKETPLACE</Link>
          <Link to="/listings" className="mp-nav-link">SELL</Link>
          <Link to="/messages" className="mp-nav-link">MESSAGES</Link>
          <Link to="/aboutus" className="mp-nav-link">ABOUT US</Link>
        </div>
        <div className="mp-nav-right">
          <div className="mp-search-bar">
            <input placeholder="Search listings..." />
            <span>Search</span>
          </div>
          <div className="mp-avatar" />
          <button className="mp-cart-nav-btn" onClick={() => setDrawerOpen(true)} type="button">
            CART ({cartCount})
          </button>
          {user ? (
            <button className="mp-logout-btn" onClick={onLogout}>LOG OUT</button>
          ) : (
            <Link to="/auth" className="mp-nav-link">SIGN IN</Link>
          )}
        </div>
      </nav>

      <Container className="pd-container">
        <button className="pd-back-btn" onClick={() => navigate('/marketplace')}>
          Back to Marketplace
        </button>

        <div className="pd-layout">
          <div className="pd-image-wrap">
            <img src={listing.image} alt={listing.title} className="pd-image" />
            <div className="pd-badges">
              <span className="pd-category-badge">{listing.category}</span>
              <span className={`pd-state-badge ${listing.listingState}`}>{listing.listingState}</span>
            </div>
          </div>

          <div className="pd-details">
            <h1 className="pd-title">{listing.title}</h1>
            <p className="pd-price">R {Number(listing.price).toFixed(2)}</p>
            <p className="pd-seller">Listed by {listing.sellerName || 'Student seller'}</p>
            <p className="pd-description">{listing.description}</p>

            <div className="pd-actions">
              <button className="pd-cart-btn" onClick={() => addToCart(listing)} type="button">
                ADD TO CART
              </button>
              <button className="pd-like-btn pd-trade-btn" onClick={openTradeModal} type="button">
                Ask to Trade
              </button>
            </div>

            {tradeNotice && <p className="pd-trade-notice">{tradeNotice}</p>}

            <div className="pd-meta">
              <span>Posted: {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'Recently'}</span>
            </div>
          </div>
        </div>

        <div className="pd-comments-section">
          <h3 className="pd-comments-title">Comments</h3>

          <form className="pd-comment-form" onSubmit={handleComment}>
            <input
              className="pd-comment-input"
              placeholder="Leave a comment..."
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            <button className="pd-comment-submit" type="submit">Post</button>
          </form>

          <div className="pd-comments-list">
            {comments.length === 0 ? (
              <p className="pd-no-comments">No comments yet. Be the first.</p>
            ) : (
              comments.map((item) => (
                <div className="pd-comment" key={`${item.time}-${item.text}`}>
                  <div className="pd-comment-avatar" />
                  <div className="pd-comment-content">
                    <p>{item.text}</p>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Container>

      {showTradeModal && (
        <div className="trade-modal-backdrop" role="presentation" onClick={() => setShowTradeModal(false)}>
          <div
            className="trade-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="trade-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="trade-modal__header">
              <p>Student trade request</p>
              <h2 id="trade-modal-title">Choose what you want to offer</h2>
            </div>

            {offerListings.length === 0 ? (
              <div className="trade-modal__empty">
                <p>Create a listing before requesting a trade.</p>
                <button type="button" onClick={() => navigate('/listings')}>
                  Create Listing
                </button>
              </div>
            ) : (
              <>
                <label className="trade-modal__label" htmlFor="trade-offer-listing">
                  Your listing
                </label>
                <select
                  id="trade-offer-listing"
                  className="trade-modal__select"
                  value={selectedOfferId}
                  onChange={(event) => setSelectedOfferId(event.target.value)}
                >
                  {offerListings.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.title}
                    </option>
                  ))}
                </select>

                <div className="trade-modal__preview">
                  Want to trade my{' '}
                  <strong>{offerListings.find((item) => item._id === selectedOfferId)?.title}</strong>
                  {' '}for your <strong>{listing.title}</strong>?
                </div>

                <div className="trade-modal__actions">
                  <button type="button" className="trade-modal__ghost" onClick={() => setShowTradeModal(false)}>
                    Cancel
                  </button>
                  <button type="button" className="trade-modal__send" onClick={sendTradeRequest}>
                    Send to Messages
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
