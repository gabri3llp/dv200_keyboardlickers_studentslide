import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const navigate              = useNavigate();
  const [isFav, setIsFav]     = useState(false);
  const [bursting, setBursting] = useState(false);

  const toggleFav = () => {
    const adding = !isFav;
    setIsFav(adding);
    if (adding) {
      setBursting(true);
      setTimeout(() => setBursting(false), 700);
    }
  };

  return (
    <Card className="product-card">

      {/*Product image*/}
      <Card.Img
        variant="top"
        src={product.img}
        alt={product.title}
        className="product-card__img"
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/400x220/2a2a2a/ffffff?text=No+Image";
        }}
      />

      {/*Card body*/}
      <Card.Body className="product-card__body">
        <Card.Title className="product-card__title">{product.title}</Card.Title>
        <Card.Text className="product-card__text">{product.description}</Card.Text>

        {/*ADD TO CART button*/}
        <Button
          className="product-card__btn"
          onClick={() => navigate(`/productDetails/${product.id}`)}
        >
          ADD TO CART
        </Button>

        {/*Trade*/}
        <button
          className={`product-card__star${bursting ? " product-card__star--burst" : ""}`}
          onClick={toggleFav}
          aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
        >
          {isFav ? (
            <i className="fa-solid  fa-star" />
          ) : (
            <i className="fa-regular fa-star" />
          )}

        
          {bursting && (
            <span className="product-card__particles" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className="product-card__particle"
                  style={{ "--angle": `${i * 60}deg` }}
                />
              ))}
            </span>
          )}
        </button>
      </Card.Body>
    </Card>
  );
}