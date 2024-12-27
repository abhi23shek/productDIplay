import React, { useState, useEffect } from "react";

const AdminAddSubcategories = ({ categories }) => {
  const [categoryId, setCategoryId] = useState(""); // Selected category ID
  const [subcategories, setSubcategories] = useState([]); // List of subcategories for the selected category
  const [subcategoryName, setSubcategoryName] = useState(""); // Name of the new subcategory
  const [loading, setLoading] = useState(false); // Loading state for fetching subcategories
  const [error, setError] = useState(""); // Error state for handling errors

  // Fetch subcategories when the selected category changes
  useEffect(() => {
    if (categoryId) {
      fetchSubcategories(categoryId);
    } else {
      setSubcategories([]);
    }
  }, [categoryId]);

  const fetchSubcategories = async (categoryId) => {
    setLoading(true); // Start loading
    setError(""); // Clear previous errors
    try {
      const response = await fetch(
        `http://localhost:3001/api/subcategories/${categoryId}`
      );

      if (response.ok) {
        const data = await response.json();
        setSubcategories(data);
      } else {
        console.error("Failed to fetch subcategories:", response.statusText);
        setError("Failed to load subcategories. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setError("Error fetching subcategories. Please try again later.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();

    if (!categoryId || !subcategoryName.trim()) {
      alert("Please select a category and provide a subcategory name.");
      return;
    }

    const newSubcategory = { name: subcategoryName, category_id: categoryId };

    try {
      const response = await fetch("http://localhost:3001/api/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSubcategory),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Subcategory added:", data);
        setSubcategoryName(""); // Clear input field
        fetchSubcategories(categoryId); // Refresh subcategories list
      } else {
        console.error("Error adding subcategory:", response.statusText);
        alert("Error adding subcategory. Please try again.");
      }
    } catch (error) {
      console.error("Error adding subcategory:", error);
      alert("Error adding subcategory. Please try again.");
    }
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/subcategories/${subcategoryId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Subcategory deleted successfully");
        fetchSubcategories(categoryId); // Refresh the subcategory list
      } else {
        console.error("Failed to delete subcategory:", response.statusText);
        alert("Failed to delete subcategory. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      alert("Error deleting subcategory. Please try again.");
    }
  };

  return (
    <div className="container my-4">
      {/* Add Subcategory Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-3">Add Subcategory</h2>
          <form
            className="d-flex flex-column align-items-center"
            onSubmit={handleAddSubcategory}
          >
            <div className="mb-3 w-75">
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
            <div className="mb-3 w-75">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Subcategory Name"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Subcategory
            </button>
          </form>
        </div>
      </div>

      {/* Subcategories in Selected Category */}
      {categoryId && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title text-center mb-3">
              Subcategories in Selected Category
            </h3>

            {/* Loading State */}
            {loading && <p className="text-center text-muted">Loading...</p>}

            {/* Error State */}
            {error && <p className="text-center text-danger">{error}</p>}

            {/* Subcategories or Empty Message */}
            {!loading && !error && subcategories.length > 0 ? (
              <ul className="list-group">
                {subcategories.map((subcategory) => (
                  <li
                    key={subcategory.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span className="fw-bold">{subcategory.name}</span>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteSubcategory(subcategory.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              !loading && (
                <p className="text-center text-muted">
                  No subcategories found for this category.
                </p>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAddSubcategories;
