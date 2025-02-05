import React, { useContext } from "react";
import "./ProductCards.css";
import { CartContext } from "./context/Cart";

const ProductCards = ({ id, image, name, price, description }) => {
  const product = { id, image, name, price, description };
  const { cartItems, addToCart } = useContext(CartContext);

  // Check if the product is already in the cart
  const cartProduct = cartItems.find((item) => item.id === product.id);

  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <div className="product-details">
        <h5 className="product-name">{name}</h5>
        <p className="product-price">₹{Number(price).toFixed(2)}</p>
        <p className="product-description">{description}</p>
      </div>

      {/* Display either quantity or "Add to cart" based on whether the product is in the cart */}
      {cartProduct ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="btn btn-success btn-sm"
        >
          {cartProduct.quantity} in cart
        </button>
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
