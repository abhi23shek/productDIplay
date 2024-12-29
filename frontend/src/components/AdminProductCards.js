import React, { useEffect, useState } from "react";
import "./ProductCards.css";

const AdminProductCards = ({ image, name, price, description, id }) => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/products");

        // Check if the response is ok (status 200)
        if (response.ok) {
          const data = await response.json(); // Parse JSON response
          console.log("Fetched Products:", data);
          setProducts(data); // Assuming you're setting products in state
        } else {
          console.error("Error fetching products:", response.status);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      // Send a DELETE request to the backend
      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update the local state to remove the product from the list
        setProducts(products.filter((product) => product.id !== id));
      } else {
        console.error("Error deleting product:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <div className="product-details">
        <h5 className="product-name">{name}</h5>
        <p className="product-price">₹{Number(price).toFixed(2)}</p>
        <p className="product-description">{description}</p>
      </div>
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-danger btn-sm"
          onClick={() => handleDelete(id)}
        >
          Delete
        </button>
        <a href={`/admin/update/${id}`} className="btn btn-primary btn-sm">
          Edit
        </a>
      </div>
    </div>
  );
};

export default AdminProductCards;
