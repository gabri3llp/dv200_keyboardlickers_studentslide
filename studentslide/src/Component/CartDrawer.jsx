import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../App.css";

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartCount,
    cartTotal,
    drawerOpen,
    setDrawerOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const handleCheckout = () => {
    setDrawerOpen(false);
    navigate("/cart");
  };

  return (
    <>
      {/* ── Backdrop ── */}
      {drawerOpen && (
        <div
          className="cd-backdrop"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Drawer panel ── */}
      <aside className={`cd-drawer ${drawerOpen ? "cd-drawer--open" : ""}`}>

        {/* Header */}
        <div className="cd-header">
          <div className="cd-header__left">
            <h2 className="cd-header__title">My Cart</h2>
            {cartCount > 0 && (
              <span className="cd-header__count">{cartCount}</span>
            )}
          </div>
          <div className="cd-header__right">
            {cartItems.length > 0 && (
              <button className="cd-clear-btn" onClick={clearCart}>
                Clear all
              </button>
            )}
            <button
              className="cd-close-btn"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close cart"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="cd-body">
          {cartItems.length === 0 ? (
            <div className="cd-empty">
              <p className="cd-empty__icon">🛒</p>
              <p className="cd-empty__title">Your cart is empty</p>
              <p className="cd-empty__sub">
                Browse the marketplace and add something!
              </p>
              <button
                className="cd-empty__btn"
                onClick={() => { setDrawerOpen(false); navigate("/marketplace"); }}
              >
                Go to Marketplace
              </button>
            </div>
          ) : (
            <ul className="cd-list">
              {cartItems.map((item) => {
                const numericPrice = parseFloat(
                  String(item.price).replace(/[^0-9.]/g, "")
                );
                const lineTotal = numericPrice * item.quantity;

                return (
                  <li key={item.id} className="cd-item">
                    {/* Image */}
                    <img
                      src={item.img}
                      alt={item.title}
                      className="cd-item__img"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/80x80/2a2a2a/fff?text=?";
                      }}
                    />

                    {/* Info */}
                    <div className="cd-item__info">
                      <p className="cd-item__title">{item.title}</p>
                      <p className="cd-item__unit">R {numericPrice.toFixed(2)} each</p>

                      {/* Quantity controls */}
                      <div className="cd-item__qty">
                        <button
                          className="cd-qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="cd-qty-value">{item.quantity}</span>
                        <button
                          className="cd-qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Right side — line total + remove */}
                    <div className="cd-item__right">
                      <p className="cd-item__total">R {lineTotal.toFixed(2)}</p>
                      <button
                        className="cd-item__remove"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.title}`}
                      >
                        🗑
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer — total + checkout */}
        {cartItems.length > 0 && (
          <div className="cd-footer">
            <div className="cd-footer__row">
              <span className="cd-footer__label">Subtotal</span>
              <span className="cd-footer__value">R {cartTotal.toFixed(2)}</span>
            </div>
            <div className="cd-footer__row cd-footer__row--muted">
              <span className="cd-footer__label">Shipping</span>
              <span className="cd-footer__value">Calculated at checkout</span>
            </div>
            <div className="cd-footer__divider" />
            <div className="cd-footer__row cd-footer__row--total">
              <span className="cd-footer__label">Total</span>
              <span className="cd-footer__value">R {cartTotal.toFixed(2)}</span>
            </div>
            <button className="cd-checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <button
              className="cd-continue-btn"
              onClick={() => setDrawerOpen(false)}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}