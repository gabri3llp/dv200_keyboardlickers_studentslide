import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/StudentSlide_Logo_Full.png';
import { useCart } from '../context/CartContext';

const formatPrice = (value) => `R ${Number(value).toFixed(2)}`;

export default function Cart({ user, onLogout }) {
  const navigate = useNavigate();
  const {
    cartItems,
    cartTotal,
    cartCount,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const serviceFee = cartItems.length > 0 ? 0 : 0;
  const orderTotal = cartTotal + serviceFee;

  return (
    <div className="cart-page-shell">
      <nav className="mp-nav">
        <Link to="/marketplace">
          <img src={logo} alt="StudentSlide" className="mp-nav-logo" />
        </Link>
        <div className="mp-nav-links">
          <Link to="/marketplace" className="mp-nav-link">MARKETPLACE</Link>
          <Link to="/listings" className="mp-nav-link">SELL</Link>
          <Link to="/messages" className="mp-nav-link">MESSAGES</Link>
          <Link to="/aboutus" className="mp-nav-link">ABOUT US</Link>
        </div>
        <div className="mp-nav-right">
          {user ? (
            <button className="mp-logout-btn" onClick={onLogout}>LOG OUT</button>
          ) : (
            <Link to="/auth" className="mp-nav-link">SIGN IN</Link>
          )}
        </div>
      </nav>

      {cartItems.length === 0 ? (
        <main className="cart-empty">
          <p className="cart-empty__icon">Cart</p>
          <h1 className="cart-empty__title">Your cart is empty</h1>
          <p className="cart-empty__sub">Add live listings from the marketplace before checkout.</p>
          <button className="cart-empty__btn" onClick={() => navigate('/marketplace')}>
            Browse Marketplace
          </button>
        </main>
      ) : (
        <main className="cart-page">
          <div className="cart-heading">
            <button className="cart-back-btn" onClick={() => navigate('/marketplace')}>
              Back to Marketplace
            </button>
            <h1 className="cart-heading__title">Your Cart</h1>
            <p className="cart-heading__sub">
              {cartCount} {cartCount === 1 ? 'item' : 'items'} ready for checkout
            </p>
          </div>

          <div className="cart-layout">
            <section className="cart-items">
              <div className="cart-items__toolbar">
                <span className="cart-items__toolbar-label">Selected listings</span>
                <button className="cart-items__clear" onClick={clearCart}>
                  Remove all
                </button>
              </div>

              <ul className="cart-list">
                {cartItems.map((item) => (
                  <li key={item.id} className="cart-item">
                    <img src={item.image} alt={item.title} className="cart-item__img" />
                    <div className="cart-item__info">
                      <p className="cart-item__title">{item.title}</p>
                      <p className="cart-item__category">{item.category}</p>
                      <p className="cart-item__seller">Seller: {item.sellerName}</p>
                      <div className="cart-item__qty">
                        {/* <button
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="cart-qty-value">{item.quantity}</span>
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button> */}
                      </div>
                    </div>
                    <div className="cart-item__right">
                      <p className="cart-item__line-total">{formatPrice(item.price * item.quantity)}</p>
                      <button className="cart-item__remove" onClick={() => removeFromCart(item.id)}>
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <aside className="cart-summary">
              <h2 className="cart-summary__title">Order Summary</h2>
              <div className="cart-summary__row">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="cart-summary__row">
                <span>Service fee</span>
                <span>{formatPrice(serviceFee)}</span>
              </div>
              <div className="cart-summary__divider" />
              <div className="cart-summary__total">
                <span>Total</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>
              <button className="cart-summary__checkout" type="button">
                Proceed to Checkout
              </button>
              <button className="cart-summary__continue" onClick={() => navigate('/marketplace')}>
                Continue Shopping
              </button>
              {/* <p className="cart-summary__note">
                Checkout is currently a frontend cart demo. Backend order requests still need to be added.
              </p> */}
            </aside>
          </div>
        </main>
      )}
    </div>
  );
}
