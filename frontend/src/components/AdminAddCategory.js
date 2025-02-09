import React, { useState, useEffect } from "react";

const AdminAddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/categories`
      );
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/categories/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting category");
      }

      console.log("Category deleted");
      fetchCategories(); // Refresh categories after deletion
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const updateCategory = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/categories/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: editCategoryName }),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating category");
      }

      console.log("Category updated");
      setEditCategoryId(null); // Exit edit mode
      setEditCategoryName(""); // Clear input
      fetchCategories(); // Refresh categories
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryData = { name: categoryName };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/categories`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        }
      );
      const data = await response.json();
      console.log("Category added");

      setCategoryName(""); // Reset form
      fetchCategories(); // Refresh list
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <div className="container my-4">
      {/* Add New Category Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-3">Add New Category</h2>
          <form
            className="d-flex flex-column align-items-center"
            onSubmit={handleSubmit}
          >
            <div className="mb-3 w-75">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Category
            </button>
          </form>
        </div>
      </div>

      {/* Existing Categories Section */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-center mb-3">Existing Categories</h3>
          <ul className="list-group">
            {categories.map((category) => (
              <li
                key={category.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {editCategoryId === category.id ? (
                  // Show input field when editing
                  <div className="d-flex w-100">
                    <input
                      type="text"
                      className="form-control me-2"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                    />
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => updateCategory(category.id)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  // Show category name when not editing
                  <>
                    <span className="fw-bold">{category.name}</span>
                    <div>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => {
                          setEditCategoryId(category.id);
                          setEditCategoryName(category.name);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteCategory(category.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminAddCategory;
