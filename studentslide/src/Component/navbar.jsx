import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/StudentSlide_Logo_Full.png";
import { useCart } from "../context/CartContext";

const Navbar = ({ isLoggedIn = false, user = null, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { cartCount, setDrawerOpen } = useCart();

  const canManageListings = user?.role === 'admin' || user?.role === 'moderator';

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mp-nav">
      <Link to="/marketplace">
        <img src={logo} alt="StudentSlide" className="mp-nav-logo" />
      </Link>

      <div className="mp-nav-links">
        <Link to="/marketplace" className={`mp-nav-link ${isActive('/marketplace') ? 'active' : ''}`}>MARKETPLACE</Link>
        <Link to="/listings" className={`mp-nav-link ${isActive('/listings') ? 'active' : ''}`}>SELL</Link>
        {canManageListings && <Link to="/admin/listings" className="mp-nav-link">ADMIN</Link>}
        <Link to="/messages" className={`mp-nav-link ${isActive('/messages') ? 'active' : ''}`}>MESSAGES</Link>
        <Link to="/aboutus" className={`mp-nav-link ${isActive('/aboutus') ? 'active' : ''}`}>ABOUT US</Link>
      </div>

      <div className="mp-nav-right">
        <div className="mp-avatar" />
        <button className="mp-cart-nav-btn" onClick={() => setDrawerOpen(true)} type="button">
          CART ({cartCount})
        </button>
        {isLoggedIn ? (
          <button className="mp-logout-btn" onClick={onLogout}>LOG OUT</button>
        ) : (
          <Link to="/auth" className="mp-nav-link">SIGN IN</Link>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className={`navbar__hamburger ${menuOpen ? "navbar__hamburger--open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          <Link to="/marketplace" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Marketplace</Link>
          <Link to="/listings" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Sell</Link>
          <Link to="/messages" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Messages</Link>
          <Link to="/aboutus" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>About Us</Link>
          {canManageListings && <Link to="/admin/listings" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Admin</Link>}
          <div className="navbar__mobile-divider" />
          {isLoggedIn ? (
            <button className="navbar__mobile-link navbar__mobile-link--danger" onClick={() => { onLogout(); setMenuOpen(false); }}>
              Sign Out
            </button>
          ) : (
            <Link to="/auth" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;