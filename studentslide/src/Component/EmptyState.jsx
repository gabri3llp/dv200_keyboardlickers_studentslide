import { useNavigate } from 'react-router-dom'
import './EmptyState.css'

export default function EmptyState({
  icon = '🛒',
  title = 'Your cart is empty',
  message = "Looks like you haven't added anything yet.",
  linkLabel = 'Browse products',
  linkTo = '/products',
}) {
  const navigate = useNavigate()

  return (
    <div className="empty-state">

      <div className="empty-state-icon">
        {icon}
      </div>

      <h2 className="empty-state-title">
        {title}
      </h2>

      <p className="empty-state-message">
        {message}
      </p>

      <button
        className="empty-state-btn"
        onClick={() => navigate(linkTo)}
      >
        {linkLabel}
      </button>

    </div>
  )
}