import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "./App.css";

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartTotal,
    cartCount,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const shipping  = cartItems.length > 0 ? 50 : 0;
  const orderTotal = cartTotal + shipping;

  /* ── Empty cart ── */
  if (cartItems.length === 0) {
    return (
      <>
        <Navbar isLoggedIn={false} />
        <div className="cart-empty">
          <p className="cart-empty__icon">🛒</p>
          <h2 className="cart-empty__title">Your cart is empty</h2>
          <p className="cart-empty__sub">Add some listings from the marketplace.</p>
          <button
            className="cart-empty__btn"
            onClick={() => navigate("/marketplace")}
          >
            Browse Marketplace
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar isLoggedIn={false} />

      <main className="cart-page">

        {/* ── Page heading ── */}
        <div className="cart-heading">
          <button className="cart-back-btn" onClick={() => navigate("/marketplace")}>
            ← Back to Marketplace
          </button>
          <h1 className="cart-heading__title">Your Cart</h1>
          <p className="cart-heading__sub">
            {cartCount} {cartCount === 1 ? "item" : "items"}
          </p>
        </div>

        {/* ── Two-column layout ── */}
        <div className="cart-layout">

          {/* Left — item list */}
          <div className="cart-items">

            {/* Clear all */}
            <div className="cart-items__toolbar">
              <span className="cart-items__toolbar-label">Your items</span>
              <button className="cart-items__clear" onClick={clearCart}>
                Remove all
              </button>
            </div>

            <ul className="cart-list">
              {cartItems.map((item) => {
                const numericPrice = parseFloat(
                  String(item.price).replace(/[^0-9.]/g, "")
                );
                const lineTotal = numericPrice * item.quantity;

                return (
                  <li key={item.id} className="cart-item">

                    {/* Image */}
                    <img
                      src={item.img}
                      alt={item.title}
                      className="cart-item__img"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/100x100/2a2a2a/fff?text=?";
                      }}
                    />

                    {/* Info */}
                    <div className="cart-item__info">
                      <p className="cart-item__title">{item.title}</p>
                      <p className="cart-item__category">{item.category}</p>
                      <p className="cart-item__unit-price">
                        R {numericPrice.toFixed(2)} each
                      </p>

                      {/* Quantity controls */}
                      <div className="cart-item__qty">
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease"
                        >
                          −
                        </button>
                        <span className="cart-qty-value">{item.quantity}</span>
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Line total + remove */}
                    <div className="cart-item__right">
                      <p className="cart-item__line-total">
                        R {lineTotal.toFixed(2)}
                      </p>
                      <button
                        className="cart-item__remove"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.title}`}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right — order summary */}
          <aside className="cart-summary">
            <h2 className="cart-summary__title">Order Summary</h2>

            <div className="cart-summary__rows">
              <div className="cart-summary__row">
                <span>Subtotal ({cartCount} items)</span>
                <span>R {cartTotal.toFixed(2)}</span>
              </div>
              <div className="cart-summary__row">
                <span>Shipping</span>
                <span>R {shipping.toFixed(2)}</span>
              </div>
            </div>

            <div className="cart-summary__divider" />

            <div className="cart-summary__total">
              <span>Total</span>
              <span>R {orderTotal.toFixed(2)}</span>
            </div>

            <button className="cart-summary__checkout">
              Proceed to Checkout
            </button>

            <button
              className="cart-summary__continue"
              onClick={() => navigate("/marketplace")}
            >
              ← Continue Shopping
            </button>

            {/* Trust badges */}
            <div className="cart-trust">
              <div className="cart-trust__item">
                <span>🔒</span>
                <span>Secure checkout</span>
              </div>
              <div className="cart-trust__item">
                <span>✅</span>
                <span>Student verified sellers</span>
              </div>
              <div className="cart-trust__item">
                <span>💬</span>
                <span>Message seller before buying</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}