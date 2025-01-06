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
        <div className="filter-section d-flex justify-content-between my-3">
          <div>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {selectedCategory !== "All" &&
            subcategories[selectedCategory]?.length > 0 && (
              <div>
                <select
                  className="form-select"
                  value={selectedSubcategory}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                >
                  <option value="All">All Subcategories</option>
                  {subcategories[selectedCategory].map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
        </div>

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
                            <AdminProductCards
                              id={product.id}
                              image={product.image_url}
                              name={product.name}
                              price={product.price}
                              description={product.details}
                            />
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
