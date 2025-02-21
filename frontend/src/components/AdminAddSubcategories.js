import React, { useState, useEffect } from "react";
import { Trash, Edit, Trash2, Edit2 } from "lucide-react";

const AdminAddSubcategories = ({ categories }) => {
  const [categoryId, setCategoryId] = useState(""); // Selected category ID
  const [subcategories, setSubcategories] = useState([]); // Subcategories of the selected category
  const [subcategoryName, setSubcategoryName] = useState(""); // Name of the new subcategory
  const [editingSubcategory, setEditingSubcategory] = useState(null); // ID of subcategory being edited
  const [updatedSubcategoryName, setUpdatedSubcategoryName] = useState(""); // Updated name for subcategory
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message

  // Fetch subcategories when category changes
  useEffect(() => {
    if (categoryId) {
      fetchSubcategories(categoryId);
    } else {
      setSubcategories([]);
    }
  }, [categoryId]);

  // Fetch subcategories from backend
  const fetchSubcategories = async (categoryId) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/subcategories/${categoryId}`
      );
      if (response.ok) {
        const data = await response.json();
        setSubcategories(data);
      } else {
        setError("Failed to load subcategories. Please try again.");
      }
    } catch (error) {
      setError("Error fetching subcategories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add a new subcategory
  const handleAddSubcategory = async (e) => {
    e.preventDefault();

    if (!categoryId || !subcategoryName.trim()) {
      alert("Please select a category and enter a subcategory name.");
      return;
    }

    const newSubcategory = { name: subcategoryName, category_id: categoryId };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/subcategories`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSubcategory),
        }
      );

      if (response.ok) {
        setSubcategoryName("");
        fetchSubcategories(categoryId); // Refresh list
      } else {
        alert("Error adding subcategory. Please try again.");
      }
    } catch (error) {
      alert("Error adding subcategory. Please try again.");
    }
  };

  // Update an existing subcategory
  const handleUpdateSubcategory = async (subcategoryId) => {
    if (!updatedSubcategoryName.trim()) {
      alert("Please enter a subcategory name.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/subcategories/${subcategoryId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: updatedSubcategoryName,
            category_id: categoryId,
          }),
        }
      );

      if (response.ok) {
        setEditingSubcategory(null);
        setUpdatedSubcategoryName("");
        fetchSubcategories(categoryId); // Refresh list
      } else {
        alert("Error updating subcategory. Please try again.");
      }
    } catch (error) {
      alert("Error updating subcategory. Please try again.");
    }
  };

  // Delete a subcategory
  const handleDeleteSubcategory = async (subcategoryId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/subcategories/${subcategoryId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        fetchSubcategories(categoryId); // Refresh list
      } else {
        alert("Failed to delete subcategory. Please try again.");
      }
    } catch (error) {
      alert("Error deleting subcategory. Please try again.");
    }
  };

  return (
    <div className="container my-4">
      {/* Add Subcategory Form */}
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

      {/* Display Subcategories */}
      {categoryId && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title text-center mb-3">
              Subcategories in Selected Category
            </h3>

            {loading && <p className="text-center text-muted">Loading...</p>}
            {error && <p className="text-center text-danger">{error}</p>}

            {!loading && !error && subcategories.length > 0 ? (
              <ul className="list-group">
                {subcategories.map((subcategory) => (
                  <li
                    key={subcategory.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {editingSubcategory === subcategory.id ? (
                      <input
                        type="text"
                        className="form-control me-2"
                        value={updatedSubcategoryName}
                        onChange={(e) =>
                          setUpdatedSubcategoryName(e.target.value)
                        }
                      />
                    ) : (
                      <span className="fw-bold">{subcategory.name}</span>
                    )}

                    <div>
                      {editingSubcategory === subcategory.id ? (
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() =>
                            handleUpdateSubcategory(subcategory.id)
                          }
                        >
                          Save
                        </button>
                      ) : (
                        <Edit2
                          className="text-primary"
                          size={20}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setEditingSubcategory(subcategory.id);
                            setUpdatedSubcategoryName(subcategory.name);
                          }}
                        ></Edit2>
                      )}

                      <Trash2
                        className="text-danger"
                        size={20}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteSubcategory(subcategory.id)}
                      >
                        Delete
                      </Trash2>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              !loading && (
                <p className="text-center text-muted">
                  No subcategories found.
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
