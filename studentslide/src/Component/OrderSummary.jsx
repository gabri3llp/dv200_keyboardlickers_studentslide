import { useCart } from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'
import './OrderSummary.css'

export default function OrderSummary() {
  const { total } = useCart()
  const navigate = useNavigate()

  const tax = total * 0.1
  const shipping = total > 50 ? 0 : 5.99
  const grandTotal = total + tax + shipping

  return (
    <div className="order-summary">

      <h2>Order summary</h2>

      <div className="order-summary-row">
        <span>Subtotal</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <div className="order-summary-row">
        <span>Tax (10%)</span>
        <span>${tax.toFixed(2)}</span>
      </div>

      <div className="order-summary-row">
        <span>Shipping</span>
        <span>
          {shipping === 0
            ? <span className="order-summary-free">Free</span>
            : `$${shipping.toFixed(2)}`
          }
        </span>
      </div>

      <div className="order-summary-row total">
        <span>Total</span>
        <span>${grandTotal.toFixed(2)}</span>
      </div>

      <button
        className="order-summary-btn"
        onClick={() => navigate('/checkout')}
      >
        Proceed to checkout
      </button>

    </div>
  )
}