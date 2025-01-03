import React, { useState, useEffect } from "react";

const AdminAddProduct = ({ categories }) => {
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");
  const [imageFile, setImageFile] = useState(null); // Store image file
  const [imageUrl, setImageUrl] = useState(""); // Store image URL
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch subcategories when categoryId changes
  useEffect(() => {
    if (categoryId) {
      fetchSubcategories(categoryId);
    } else {
      setSubcategories([]); // Clear subcategories when no category is selected
    }
  }, [categoryId]);

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/subcategories/${categoryId}`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setSubcategories(data); // Set subcategories based on the selected category
      } else {
        setSubcategories([]); // Ensure subcategories is an array if none are returned
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]); // Handle errors by setting an empty array
    }
  };

  // Handle pasting an image
  const handlePaste = (e) => {
    const clipboardData = e.clipboardData || e.originalEvent.clipboardData;
    const items = clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") === 0) {
        const file = item.getAsFile();
        setImageFile(file); // Store the pasted image file
        const imageUrl = URL.createObjectURL(file);
        setImageUrl(imageUrl); // Optionally, preview the image
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file); // Store the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If no image was provided via paste or file upload, return
    if (!imageFile) {
      alert("Please provide an image.");
      return;
    }

    // Upload image to the backend
    let uploadedImageUrl = imageUrl;
    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await fetch("http://localhost:3001/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (result.imageUrl) {
          uploadedImageUrl = result.imageUrl; // Use the image URL returned from the backend
        } else {
          throw new Error("Image upload failed");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }

    // Prepare product data
    const productData = {
      name: name,
      price: price,
      details: details,
      image_url: uploadedImageUrl, // Use the image URL (either uploaded or pasted)
      category_id: categoryId,
      subcategory_id: subcategoryId,
    };

    // Submit the product data
    try {
      const response = await fetch("http://localhost:3001/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setMessage(`Product added successfully`);
      }

      // Reset form
      setName("");
      setPrice("");
      setDetails("");
      setImageFile(null);
      setImageUrl(""); // Clear the URL input after submission
      setCategoryId("");
      setSubcategoryId("");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Add New Product</h2>
          {error && <p className="alert alert-danger">{error}</p>}
          {message && <p className="alert alert-success">{message}</p>}
          <form onSubmit={handleSubmit}>
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
                  disabled={subcategories.length === 0}
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
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <div className="mt-3">
                  <label htmlFor="imageUrl" className="form-label">
                    Or Paste Image from Clipboard:
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    onPaste={handlePaste} // Listen for paste events
                    placeholder="Paste image here (Ctrl+V)"
                  />
                </div>
                {imageUrl && (
                  <div className="mt-3">
                    <img
                      src={imageUrl}
                      alt="Pasted"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                    />
                  </div>
                )}
              </div>
            </div>

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
