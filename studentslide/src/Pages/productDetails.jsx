import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';

const API_URL = 'http://localhost:5000/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const loadListing = async () => {
      try {
        const response = await fetch(`${API_URL}/listings/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not load listing');
        setListing(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadListing();
  }, [id]);

  const handleComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([...comments, { text: comment, time: new Date().toLocaleTimeString() }]);
    setComment('');
  };

  if (loading) return (
    <div className="pd-loading">
      <Spinner animation="border" />
      <span>Loading product...</span>
    </div>
  );

  if (error) return (
    <div className="pd-page">
      <Container>
        <Alert variant="danger">{error}</Alert>
        <button className="pd-back-btn" onClick={() => navigate('/marketplace')}>← Back</button>
      </Container>
    </div>
  );

  return (
    <div className="pd-page">

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

      <Container className="pd-container">

        {/* Back button */}
        <button className="pd-back-btn" onClick={() => navigate('/marketplace')}>
          ← Back to Marketplace
        </button>

        <div className="pd-layout">

          {/* Left — Image */}
          <div className="pd-image-wrap">
            <img src={listing.image} alt={listing.title} className="pd-image" />
            <div className="pd-badges">
              <span className="pd-category-badge">{listing.category}</span>
              <span className={`pd-state-badge ${listing.listingState}`}>{listing.listingState}</span>
            </div>
          </div>

          {/* Right — Details */}
          <div className="pd-details">
            <h1 className="pd-title">{listing.title}</h1>
            <p className="pd-price">R {Number(listing.price).toFixed(2)}</p>
            <p className="pd-description">{listing.description}</p>

            <div className="pd-actions">
              <button className="pd-cart-btn">ADD TO CART</button>
              <button
                className={`pd-like-btn ${liked ? 'liked' : ''}`}
                onClick={() => setLiked(!liked)}
              >
                {liked ? '❤️' : '🤍'} {liked ? 'Liked' : 'Like'}
              </button>
            </div>

            <div className="pd-meta">
              <span>Posted: {new Date(listing.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="pd-comments-section">
          <h3 className="pd-comments-title">Comments</h3>

          {/* Comment input */}
          <form className="pd-comment-form" onSubmit={handleComment}>
            <input
              className="pd-comment-input"
              placeholder="Leave a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="pd-comment-submit" type="submit">Post</button>
          </form>

          {/* Comments list */}
          <div className="pd-comments-list">
            {comments.length === 0 ? (
              <p className="pd-no-comments">No comments yet. Be the first!</p>
            ) : (
              comments.map((c, i) => (
                <div className="pd-comment" key={i}>
                  <div className="pd-comment-avatar" />
                  <div className="pd-comment-content">
                    <p>{c.text}</p>
                    <span>{c.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </Container>
    </div>
  );
};

export default ProductDetails;