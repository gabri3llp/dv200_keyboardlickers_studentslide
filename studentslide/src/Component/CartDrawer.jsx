import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const formatPrice = (value) => `R ${Number(value).toFixed(2)}`;

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartCount,
    cartTotal,
    drawerOpen,
    setDrawerOpen,
    removeFromCart,
    clearCart,
  } = useCart();

  const openCartPage = () => {
    setDrawerOpen(false);
    navigate('/cart');
  };

  return (
    <>
      {drawerOpen && (
        <button
          className="cd-backdrop"
          onClick={() => setDrawerOpen(false)}
          aria-label="Close cart"
          type="button"
        />
      )}

      <aside className={`cd-drawer ${drawerOpen ? 'cd-drawer--open' : ''}`}>
        <div className="cd-header">
          <div>
            <h2 className="cd-header__title">My Cart</h2>
            <span className="cd-header__count">{cartCount} items</span>
          </div>
          <button className="cd-close-btn" onClick={() => setDrawerOpen(false)} type="button">
            Close
          </button>
        </div>

        <div className="cd-body">
          {cartItems.length === 0 ? (
            <div className="cd-empty">
              <p className="cd-empty__title">Your cart is empty</p>
              <p className="cd-empty__sub">Add a listing from the marketplace.</p>
              <button
                className="cd-empty__btn"
                onClick={() => {
                  setDrawerOpen(false);
                  navigate('/marketplace');
                }}
                type="button"
              >
                Go to Marketplace
              </button>
            </div>
          ) 
          : (
            <ul className="cd-list">
              {cartItems.map((item) => (
                <li key={item.id} className="cd-item">
                  <img src={item.image} alt={item.title} className="cd-item__img" />
                  <div className="cd-item__info">
                    <p className="cd-item__title">{item.title}</p>
                    <p className="cd-item__unit">{formatPrice(item.price)} each</p>
                    <div className="cd-item__qty">

                    </div>
                  </div>
                  <div className="cd-item__right">
                    <p className="cd-item__total">{formatPrice(item.price * item.quantity)}</p>
                    <button
                      className="cd-item__remove"
                      onClick={() => removeFromCart(item.id)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cd-footer">
            <div className="cd-footer__row">
              <span>Subtotal</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>
            <button className="cd-checkout-btn" onClick={openCartPage} type="button">
              View Cart
            </button>
            <button className="cd-continue-btn" onClick={() => setDrawerOpen(false)} type="button">
              Continue Shopping
            </button>
            <button className="cd-clear-btn" onClick={clearCart} type="button">
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
