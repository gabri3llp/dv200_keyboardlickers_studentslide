import { useState } from "react";
import "./RemoveListing.css";

// Example shape of a listing object:
// { id, title, price, category, condition, image, createdAt }

const RemoveListing = ({ listings = [], onRemove }) => {
  const [items, setItems] = useState(listings);
  const [confirmId, setConfirmId] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [removedId, setRemovedId] = useState(null);

  const toConfirm = items.find((l) => l.id === confirmId);

  const handleRemoveConfirm = async () => {
    setRemoving(true);
    await new Promise((r) => setTimeout(r, 900));
    setRemovedId(confirmId);
    setTimeout(() => {
      setItems((prev) => prev.filter((l) => l.id !== confirmId));
      setRemovedId(null);
      setConfirmId(null);
      setRemoving(false);
      if (onRemove) onRemove(confirmId);
    }, 400);
  };

  if (items.length === 0) {
    return (
      <div className="rl-empty">
        <div className="rl-empty__icon">📭</div>
        <h2 className="rl-empty__title">No listings yet</h2>
        <p className="rl-empty__text">Items you create will appear here and can be removed.</p>
      </div>
    );
  }

  return (
    <div className="rl-wrapper">
      <div className="rl-header">
        <div>
          <h1 className="rl-header__title">My listings</h1>
          <p className="rl-header__sub">{items.length} active {items.length === 1 ? "listing" : "listings"}</p>
        </div>
      </div>

      <ul className="rl-list">
        {items.map((listing) => {
          const isRemoving = removedId === listing.id;
          return (
            <li
              key={listing.id}
              className={`rl-card ${isRemoving ? "rl-card--removing" : ""}`}
            >
              {listing.image ? (
                <img src={listing.image} alt={listing.title} className="rl-card__image" />
              ) : (
                <div className="rl-card__image-placeholder">
                  <span>No image</span>
                </div>
              )}

              <div className="rl-card__body">
                <div className="rl-card__top">
                  <h3 className="rl-card__title">{listing.title}</h3>
                  <div className="rl-card__badges">
                    <span className="rl-badge rl-badge--category">{listing.category}</span>
                    <span className="rl-badge rl-badge--condition">{listing.condition}</span>
                  </div>
                </div>
                <p className="rl-card__price">R {Number(listing.price).toFixed(2)}</p>
                {listing.createdAt && (
                  <p className="rl-card__date">
                    Listed {new Date(listing.createdAt).toLocaleDateString("en-ZA", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                )}
              </div>

              <div className="rl-card__actions">
                <button
                  className="rl-remove-btn"
                  onClick={() => setConfirmId(listing.id)}
                  type="button"
                  aria-label={`Remove ${listing.title}`}
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Confirmation modal */}
      {confirmId && toConfirm && (
        <div className="rl-modal-overlay" onClick={() => !removing && setConfirmId(null)}>
          <div className="rl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rl-modal__icon">🗑</div>
            <h2 className="rl-modal__title">Remove listing?</h2>
            <p className="rl-modal__text">
              <strong>"{toConfirm.title}"</strong> will be permanently removed from the marketplace. This cannot be undone.
            </p>
            <div className="rl-modal__actions">
              <button
                className="rl-btn rl-btn--ghost"
                onClick={() => setConfirmId(null)}
                disabled={removing}
                type="button"
              >
                Cancel
              </button>
              <button
                className={`rl-btn rl-btn--danger ${removing ? "rl-btn--loading" : ""}`}
                onClick={handleRemoveConfirm}
                disabled={removing}
                type="button"
              >
                {removing ? "Removing…" : "Yes, remove it"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemoveListing;