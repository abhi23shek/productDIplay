import React, { useContext } from "react";
import "./ProductCards.css";
import { CartContext } from "./context/Cart";

const ProductCards = ({ id, category, image, name, price, description }) => {
  const product = { id, category, image, name, price, description };
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  const cartProduct = cartItems.find((item) => item.id === product.id);

  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <div className="product-details">
        <h5 className="product-name">{name}</h5>
        <p className="product-price">₹{Number(price).toFixed(2)}</p>
        <p className="product-description">{description}</p>
      </div>

      {cartProduct ? (
        <div className="d-flex align-items-center justify-content-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (cartProduct.quantity === 1) {
                removeFromCart(product, true);
              } else {
                removeFromCart(product);
              }
            }}
            className="btn btn-danger btn-sm"
          >
            -
          </button>
          <button
            className="btn btn-success btn-sm d-flex align-items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <i className="bi bi-cart me-1"></i>
            {cartProduct.quantity}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="btn btn-warning btn-sm"
          >
            +
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="btn btn-warning btn-sm"
        >
          Add to cart
        </button>
      )}
    </div>
  );
};

export default ProductCards;
