import { useCart } from '../../context/CartContext'
import QuantityStepper from './QuantityStepper'
import './CartItem.css'

export default function CartItem({ item }) {
  const { dispatch } = useCart()

  return (
    <div className="cart-item">

      <img
        className="cart-item-image"
        src={item.image}
        alt={item.name}
      />

      <div className="cart-item-details">
        <span className="cart-item-name">{item.name}</span>
        <span className="cart-item-price">${item.price.toFixed(2)}</span>
        <QuantityStepper item={item} />
      </div>

      <button
        className="cart-item-remove"
        onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })}
      >
        Remove
      </button>

    </div>
  )
}