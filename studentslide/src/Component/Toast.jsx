import { useEffect, useState } from 'react'
import './Toast.css'

const ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'i',
}

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div
      role="alert"
      className={`toast ${type} ${visible ? 'visible' : ''}`}
    >
      <div className="toast-icon">
        <span>{ICONS[type]}</span>
      </div>

      <span className="toast-message">{message}</span>

      <button
        className="toast-close"
        onClick={handleClose}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}