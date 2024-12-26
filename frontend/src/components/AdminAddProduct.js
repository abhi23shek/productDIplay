import React, { useState, useEffect } from "react";

const AdminAddProduct = ({ categories }) => {
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");
  const [image_url, setImageUrl] = useState("");
  // const [successMessage, setSuccessMessage] = useState('');

  // Fetch subcategories when categoryId changes
  useEffect(() => {
    if (categoryId) {
      fetchSubcategories(categoryId);
    }
  }, [categoryId]);

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/subcategories/${categoryId}`
      );
      const data = await response.json();
      setSubcategories(data); // Set subcategories based on the selected category
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name,
      price,
      details,
      image_url,
      category_id: categoryId,
      subcategory_id: subcategoryId,
    };

    try {
      const response = await fetch("http://localhost:3001/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        // Display success message
        const data = await response.json();
        alert(data.message || "Product added successfully");
      }

      setName("");
      setPrice("");
      setDetails("");
      setImageUrl("");
      setCategoryId("");
      setSubcategoryId("");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="container my-4">
      {/* Add New Product Section */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit}>
            {/* First Row: Selectors */}
            <div className="row mb-4">
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={subcategoryId}
                  onChange={(e) => setSubcategoryId(e.target.value)}
                  required
                  disabled={!categoryId}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Second Row: Product Name and Price */}
            <div className="row mb-4">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Product Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Third Row: Details and Image URL */}
            <div className="row mb-4">
              <div className="col-md-6">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Image URL"
                  value={image_url}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;
