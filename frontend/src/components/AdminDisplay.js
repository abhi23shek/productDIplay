import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminProductCards from "./AdminProductCards";
import "./AdminDisplay.css";

function AdminDisplay() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch(
          "http://localhost:3001/api/products"
        );
        const productsData = await productResponse.json();

        const categoryResponse = await fetch(
          "http://localhost:3001/api/categories"
        );
        const categoriesData = await categoryResponse.json();

        const subcategoriesData = {};
        for (const category of categoriesData) {
          const response = await fetch(
            `http://localhost:3001/api/subcategories/${category.id}`
          );
          subcategoriesData[category.id] = await response.json();
        }
        const sortedProducts = Array.isArray(productsData)
          ? productsData.sort(
              (a, b) => parseFloat(a.price) - parseFloat(b.price)
            )
          : [];

        setProducts(sortedProducts);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setSubcategories(subcategoriesData);
        setFilteredProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory("All");
    if (categoryId === "All") {
      setFilteredProducts(products);
    } else {
      filterProducts(searchTerm, categoryId, "All", minPrice, maxPrice);
    }
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    filterProducts(
      searchTerm,
      selectedCategory,
      subcategoryId,
      minPrice,
      maxPrice
    );
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterProducts(
      term,
      selectedCategory,
      selectedSubcategory,
      minPrice,
      maxPrice
    );
  };

  const handlePriceFilter = () => {
    filterProducts(
      searchTerm,
      selectedCategory,
      selectedSubcategory,
      minPrice,
      maxPrice
    );
  };

  const filterProducts = (term, categoryId, subcategoryId, min, max) => {
    let filtered = products;

    if (categoryId !== "All") {
      filtered = filtered.filter(
        (product) => product.category_id === categoryId
      );
    }

    if (subcategoryId !== "All") {
      filtered = filtered.filter(
        (product) => product.subcategory_id === subcategoryId
      );
    }

    if (term) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(term)
      );
    }

    if (min !== "" || max !== "") {
      filtered = filtered.filter((product) => {
        const price = parseFloat(product.price);
        return (
          (!min || price >= parseFloat(min)) &&
          (!max || price <= parseFloat(max))
        );
      });
    }
    // Sort filtered products by price
    filtered = filtered.sort(
      (a, b) => parseFloat(a.price) - parseFloat(b.price)
    );

    setFilteredProducts(filtered);
  };

  const groupProducts = () => {
    const grouped = {};

    filteredProducts.forEach((product) => {
      const categoryName =
        categories.find((cat) => cat.id === product.category_id)?.name ||
        "Uncategorized";
      const subcategoryName =
        subcategories[product.category_id]?.find(
          (sub) => sub.id === product.subcategory_id
        )?.name || "Uncategorized";

      if (!grouped[categoryName]) {
        grouped[categoryName] = {};
      }

      if (!grouped[categoryName][subcategoryName]) {
        grouped[categoryName][subcategoryName] = [];
      }

      grouped[categoryName][subcategoryName].push(product);
    });

    return grouped;
  };

  if (loading) {
    return <p>Loading products...</p>;
  }
  const handleDelete = async (id) => {
    try {
      // Send a DELETE request to the backend
      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update the local state to remove the product from the list
        setFilteredProducts(products.filter((product) => product.id !== id));
      } else {
        console.error("Error deleting product:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const groupedProducts = groupProducts();

  return (
    <div className="Admin-Parent-container">
      <div className="Admin-Display-Heading"> Product Display</div>
      <div className="filter-tab text-dark rounded-pill  px-4 border border-dark">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="price-filter">
          <label>
            <input
              type="number"
              value={minPrice}
              placeholder="Min price:"
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </label>
          <label>
            <input
              type="number"
              value={maxPrice}
              placeholder="Max price:"
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </label>
          <button className="btn btn-primary" onClick={handlePriceFilter}>
            Apply
          </button>
          <button
            className="btn btn-secondary reset-btn"
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
              setSearchTerm("");
              setSelectedCategory("All");
              setSelectedSubcategory("All");
              setFilteredProducts(products);
            }}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="admin-display-container">
        <div className="category-section my-4 category-text">
          <h2>Categories</h2>
          <div className="row row-cols-auto">
            <div className="btn-group flex-wrap" role="group">
              <div className="d-flex align-items-center mb-2">
                <button
                  className={`btn btn-outline-primary ${
                    selectedCategory === "All" ? "active" : ""
                  }`}
                  onClick={() => handleCategoryChange("All")}
                >
                  All
                </button>
                {selectedCategory === "All" && (
                  <span className="badge">{products.length}</span>
                )}
              </div>
              {categories.map((category) => {
                const categoryCount = products.filter(
                  (product) => product.category_id === category.id
                ).length;
                return (
                  <div
                    key={category.id}
                    className="d-flex align-items-center mb-2"
                  >
                    <button
                      className={`btn btn-outline-primary ${
                        category.id === selectedCategory ? "active" : ""
                      }`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      {category.name}
                    </button>
                    {category.id === selectedCategory && (
                      <span className="badge">{categoryCount}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {subcategories[selectedCategory]?.length > 0 && (
          <div className="subcategory-section my-4 subcategory-text text-dark rounded-pill px-4 border border-dark">
            <h3>Subcategories</h3>
            <div className="row row-cols-auto">
              <div className="btn-group flex-wrap" role="group">
                <div className="d-flex align-items-center mb-2">
                  <button
                    className={`btn btn-outline-secondary ${
                      selectedSubcategory === "All" ? "active" : ""
                    }`}
                    onClick={() => handleSubcategoryChange("All")}
                  >
                    All
                  </button>
                  {selectedSubcategory === "All" && (
                    <span className="badge">
                      {
                        products.filter(
                          (product) => product.category_id === selectedCategory
                        ).length
                      }
                    </span>
                  )}
                </div>
                {subcategories[selectedCategory].map((sub) => {
                  const subcategoryCount = products.filter(
                    (product) =>
                      product.category_id === selectedCategory &&
                      product.subcategory_id === sub.id
                  ).length;
                  return (
                    <div
                      key={sub.id}
                      className="d-flex align-items-center mb-2"
                    >
                      <button
                        className={`btn btn-outline-secondary ${
                          sub.id === selectedSubcategory ? "active" : ""
                        }`}
                        onClick={() => handleSubcategoryChange(sub.id)}
                      >
                        {sub.name}
                      </button>
                      {sub.id === selectedSubcategory && (
                        <span className="badge">{subcategoryCount}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="Admin-product-grid">
          {Object.entries(groupedProducts).map(
            ([categoryName, subcategories]) => (
              <div key={categoryName} className="category-group mb-4">
                <h3 className="text-primary">{categoryName}</h3>
                {Object.entries(subcategories).map(
                  ([subcategoryName, products]) => (
                    <div
                      key={subcategoryName}
                      className="Admin-subcategory-group"
                    >
                      <h3>{subcategoryName}</h3>
                      <div className=" Admin-product-cards">
                        {products.map((product) => (
                          <div key={product.id}>
                            <div className="Admin-product-card">
                              <AdminProductCards
                                id={product.id}
                                image={product.image_url}
                                name={product.name}
                                price={product.price}
                                description={product.details}
                              />
                              <div className="d-flex justify-content-between">
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDelete(product.id)}
                                >
                                  Delete
                                </button>
                                <a
                                  href={`/admin/update/${product.id}`}
                                  className="btn btn-primary btn-sm"
                                >
                                  Edit
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )
          )}
        </div>
        {/* <Footer /> */}
      </div>
    </div>
  );
}

export default AdminDisplay;
