import React from 'react';
import './ProductCards.css';

const ProductCards = ({ image, name, price, description }) => {
  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <div className="product-details">
        <h5 className="product-name">{name}</h5>
        <p className="product-price">₹{Number(price).toFixed(2)}</p>
        <p className="product-description">{description}</p>
      </div>
    </div>
  );
};

export default ProductCards;