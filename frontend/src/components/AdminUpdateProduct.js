import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  const { id: productId } = useParams();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    details: "",
    image_url: "",
    category_id: "",
    subcategory_id: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/products/${productId}`
        );
        setProduct(response.data.product);
        setImagePreview(response.data.product.image_url);
      } catch (err) {
        setError("Failed to fetch product details. Please try again.");
      }
    };

    if (productId) fetchProductDetails();
    else setError("Product ID is missing in the URL.");
  }, [productId]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    let uploadedImageUrl = imagePreview;
    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await axios.post(
          "http://localhost:3001/api/upload-image",
          formData
        );
        uploadedImageUrl = response.data.imageUrl;
      } catch (err) {
        setError("Failed to upload the image.");
        return;
      }
    }

    try {
      const updatedProduct = { ...product, image_url: uploadedImageUrl };
      const response = await axios.put(
        `http://localhost:3001/api/products/${productId}`,
        updatedProduct
      );
      setMessage(`Product updated successfully: ${response.data.product.name}`);
      setError("");
    } catch (err) {
      setError("Failed to update the product. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handlePaste = (e) => {
    const clipboardData = e.clipboardData || e.originalEvent.clipboardData;
    const items = clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") === 0) {
        const file = item.getAsFile();
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow-lg">
        <div className="card-header text-center">
          <h2>Update Product</h2>
        </div>
        <div className="card-body">
          {error && <p className="alert alert-danger">{error}</p>}
          {message && <p className="alert alert-success">{message}</p>}
          <form onSubmit={handleUpdate}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Category ID</label>
                <input
                  type="text"
                  name="category_id"
                  value={product.category_id || ""}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter category ID"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Subcategory ID</label>
                <input
                  type="text"
                  name="subcategory_id"
                  value={product.subcategory_id || ""}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter subcategory ID"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={product.name || ""}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  name="price"
                  value={product.price || ""}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter price"
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Details</label>
                <textarea
                  name="details"
                  value={product.details || ""}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                  placeholder="Enter product details"
                ></textarea>
              </div>
              <div className="col-md-6">
                <label className="form-label">Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <textarea
                  className="form-control mt-3"
                  onPaste={handlePaste}
                  placeholder="Paste image here (Ctrl+V)"
                  rows="3"
                ></textarea>
                {imagePreview && (
                  <div className="mt-3 text-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{ maxWidth: "300px", maxHeight: "300px" }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
