import React, { useState } from "react";
import "./SubcategoryFilter.css";

const SubcategoryFilter = ({
  subcategories,
  selectedCategory,
  selectedSubcategory,
  onSubcategoryChange,
}) => {
  const [isSubcategoryDropdownOpen, setIsSubcategoryDropdownOpen] =
    useState(false);

  if (!subcategories[selectedCategory]?.length) return null;

  return (
    <div className="subcategory-section my-4 subcategory-text text-dark">
      <div className="sub-ctg-heading">
        Subcategories
        <div className="decorative-line"></div>
      </div>
      {/* Mobile Dropdown */}
      <div className="d-md-none">
        <button
          className="btn btn-secondary dropdown-toggle"
          onClick={() =>
            setIsSubcategoryDropdownOpen(!isSubcategoryDropdownOpen)
          }
        >
          {isSubcategoryDropdownOpen
            ? "Hide Subcategories"
            : "Show Subcategories"}
        </button>
        {isSubcategoryDropdownOpen && (
          <div className="dropdown-menu show">
            {subcategories[selectedCategory].map((sub) => (
              <button
                key={sub.id}
                className={`dropdown-item ${
                  sub.id === selectedSubcategory ? "active" : ""
                }`}
                onClick={() => onSubcategoryChange(sub.id)}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Desktop Buttons */}
      <div className="d-none d-md-block">
        <div className="row row-cols-auto">
          <div className="sub-btn-groups" role="group">
            <div className="sub-btns">
              <button
                className={`sub-btn ${
                  selectedSubcategory === "All" ? "active" : ""
                }`}
                onClick={() => onSubcategoryChange("All")}
              >
                All
              </button>
            </div>
            {subcategories[selectedCategory].map((sub) => (
              <div key={sub.id} className="sub-btns">
                <button
                  className={`sub-btn ${
                    sub.id === selectedSubcategory ? "active" : ""
                  }`}
                  onClick={() => onSubcategoryChange(sub.id)}
                >
                  {sub.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryFilter;
