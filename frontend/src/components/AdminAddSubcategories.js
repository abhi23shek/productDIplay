import React, { useState, useEffect } from "react";

const AdminAddSubcategories = ({ categories }) => {
  const [categoryId, setCategoryId] = useState(""); // Selected category ID
  const [subcategories, setSubcategories] = useState([]); // List of subcategories for the selected category
  const [subcategoryName, setSubcategoryName] = useState(""); // Name of the new subcategory

  // Fetch subcategories when the selected category changes
  useEffect(() => {
    if (categoryId) {
      fetchSubcategories(categoryId);
    } else {
      setSubcategories([]);
    }
  }, [categoryId]);

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/subcategories/${categoryId}`
      );
      if (response.ok) {
        const data = await response.json();
        setSubcategories(data);
      } else {
        console.error("Failed to fetch subcategories:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
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
      }
    } catch (error) {
      console.error("Error adding subcategory:", error);
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
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
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
            {subcategories.length > 0 ? (
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
              <p className="text-center text-muted">
                No subcategories found for this category.
              </p>
            )}
          </div>
        </div>
      )}
    </div>

    // <div>
    //   <h2>Add Subcategory</h2>
    //   <form onSubmit={handleAddSubcategory}>
    //     <select
    //       value={categoryId}
    //       onChange={(e) => setCategoryId(e.target.value)}
    //       required
    //     >
    //       <option value="">Select Category</option>
    //       {categories.map((category) => (
    //         <option key={category.id} value={category.id}>
    //           {category.name}
    //         </option>
    //       ))}
    //     </select>

    //     <input
    //       type="text"
    //       placeholder="Subcategory Name"
    //       value={subcategoryName}
    //       onChange={(e) => setSubcategoryName(e.target.value)}
    //       required
    //     />
    //     <button type="submit">Add Subcategory</button>
    //   </form>

    //   {categoryId && (
    //     <div>
    //       <h3>Subcategories in Selected Category</h3>
    //       <ul>
    //         {subcategories.length > 0 ? (
    //           subcategories.map((subcategory) => (
    //             <li key={subcategory.id}>
    //               {subcategory.name}
    //               <button
    //                 onClick={() => handleDeleteSubcategory(subcategory.id)}
    //                 style={{
    //                   marginLeft: "10px",
    //                   // backgroundColor: 'red',
    //                   color: "black",
    //                   border: "none",
    //                   cursor: "pointer",
    //                   padding: "5px",
    //                 }}
    //               >
    //                 Delete
    //               </button>
    //             </li>
    //           ))
    //         ) : (
    //           <p>No subcategories found for this category.</p>
    //         )}
    //       </ul>
    //     </div>
    //   )}
    // </div>
  );
};

export default AdminAddSubcategories;
