import { useCart } from '../../context/CartContext'
import './QuantityStepper.css'

export default function QuantityStepper({ item }) {
  const { dispatch } = useCart()

  const decrease = () => {
    if (item.qty === 1) {
      dispatch({ type: 'REMOVE_ITEM', id: item.id })
    } else {
      dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty - 1 })
    }
  }

  const increase = () => {
    dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty + 1 })
  }

  return (
    <div className="qty-stepper">

      <button
        className="qty-btn"
        onClick={decrease}
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span className="qty-value">{item.qty}</span>

      <button
        className="qty-btn"
        onClick={increase}
        aria-label="Increase quantity"
      >
        +
      </button>

    </div>
  )
}