import { useState } from "react";
import { Link, useLocation } from "react-router-dom";


const Navbar = ({ isLoggedIn = false, user = null, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: "Marketplace", path: "/marketplace" },
    { label: "Messages", path: "/messages" },
    { label: "About Us", path: "/aboutUS" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar__inner">

        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">S</span>
          <span className="navbar__logo-text">StudentSlide</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="navbar__links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar__link ${isActive(link.path) ? "navbar__link--active" : ""}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop auth / actions */}
        <div className="navbar__actions">
          {isLoggedIn ? (
            <>
              <Link to="/createListing" className="navbar__btn navbar__btn--primary">
                + Create Listing
              </Link>
              <div className="navbar__avatar" title={user?.name || "Account"}>
                {user?.name ? user.name[0].toUpperCase() : "U"}
                <div className="navbar__dropdown">
                  <Link to="/profile" className="navbar__dropdown-item">My Profile</Link>
                  <Link to="/messages" className="navbar__dropdown-item">Messages</Link>
                  <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={onLogout}>
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/signIn" className="navbar__btn navbar__btn--ghost">Sign In</Link>
              <Link to="/signUp" className="navbar__btn navbar__btn--primary">Sign Up</Link>
            </>
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
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar__mobile-link ${isActive(link.path) ? "navbar__mobile-link--active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="navbar__mobile-divider" />
          {isLoggedIn ? (
            <>
              <Link to="/createListing" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
                + Create Listing
              </Link>
              <button className="navbar__mobile-link navbar__mobile-link--danger" onClick={() => { onLogout(); setMenuOpen(false); }}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signIn" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/signUp" className="navbar__mobile-link navbar__mobile-link--highlight" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;