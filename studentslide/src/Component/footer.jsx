import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">

        {/* Brand column */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <span className="footer__logo-icon">S</span>
            <span className="footer__logo-text">StudentSlide</span>
          </Link>
          <p className="footer__tagline">
            The marketplace built for students. Buy, sell, and connect on campus.
          </p>
          <div className="footer__socials">
            <a href="https://instagram.com" className="footer__social-link" aria-label="Instagram" target="_blank" rel="noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
            </a>
            <a href="https://twitter.com" className="footer__social-link" aria-label="Twitter / X" target="_blank" rel="noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l16 16M4 20L20 4"/>
              </svg>
            </a>
            <a href="mailto:hello@studentslide.com" className="footer__social-link" aria-label="Email us">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M2 7l10 7 10-7"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Explore links */}
        <div className="footer__col">
          <h4 className="footer__col-heading">Explore</h4>
          <ul className="footer__col-links">
            <li><Link to="/marketplace" className="footer__link">Marketplace</Link></li>
            <li><Link to="/createListing" className="footer__link">Create a listing</Link></li>
            <li><Link to="/messages" className="footer__link">Messages</Link></li>
            <li><Link to="/aboutUS" className="footer__link">About us</Link></li>
          </ul>
        </div>

        {/* Account links */}
        <div className="footer__col">
          <h4 className="footer__col-heading">Account</h4>
          <ul className="footer__col-links">
            <li><Link to="/signIn" className="footer__link">Sign in</Link></li>
            <li><Link to="/signUp" className="footer__link">Sign up</Link></li>
            <li><Link to="/profile" className="footer__link">My profile</Link></li>
            <li><Link to="/listings" className="footer__link">My listings</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer__newsletter">
          <h4 className="footer__col-heading">Stay in the loop</h4>
          <p className="footer__newsletter-text">Get notified when new listings drop near you.</p>
          <div className="footer__newsletter-form">
            <input
              type="email"
              placeholder="your@email.com"
              className="footer__newsletter-input"
              aria-label="Email address"
            />
            <button className="footer__newsletter-btn" type="button">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <p className="footer__copy">© {year} StudentSlide. All rights reserved.</p>
        <div className="footer__legal">
          <Link to="/privacy" className="footer__legal-link">Privacy policy</Link>
          <Link to="/terms" className="footer__legal-link">Terms of use</Link>
          <Link to="/contact" className="footer__legal-link">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;