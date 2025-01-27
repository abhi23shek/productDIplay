import React, { useEffect, useState, useRef } from "react";
import "./FrontPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ProductCards from "./ProductCards";
import Footer from "./Footer";
import BarLoader from "react-spinners/BarLoader";
function FrontPage() {
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
  const [modalProduct, setModalProduct] = useState(null); // State for the selected product modal
  const modalRef = useRef(null); // Ref for the modal content
  const [isSubcategoryDropdownOpen, setIsSubcategoryDropdownOpen] =
    useState(false); // State for toggling the dropdown
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/products`
        );
        const productsData = await productResponse.json();

        const categoryResponse = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/categories`
        );
        const categoriesData = await categoryResponse.json();

        const subcategoriesData = {};
        for (const category of categoriesData) {
          const response = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/subcategories/${category.id}`
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalProduct &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalProduct]);

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

  // if (loading) {
  //   return (
  //     <div className="loader">
  //       <img src={require("./image/ShivCollection-logo3.png")} />
  //       <p> product loading...</p>
  //       <BarLoader
  //         cssOverride={{}}
  //         height={10}
  //         speedMultiplier={1}
  //         width={300}
  //       />
  //     </div>
  //   );
  // }

  const groupedProducts = groupProducts();
  const openModal = (product) => {
    setModalProduct(product);
  };

  const closeModal = () => {
    setModalProduct(null);
  };
  const toggleDropdown = () => {
    setIsSubcategoryDropdownOpen(!isSubcategoryDropdownOpen);
  };

  return (
    <div className="Frontpageparent">
      <div className="app-container">
        <div className="frontnavbar">
          <Navbar />
        </div>
        <div className="fronthero">
          <HeroSection />
        </div>

        <div className="category-section my-4 category-text text-dark">
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
          <div className="subcategory-section my-4 subcategory-text text-dark">
            <h3>Subcategories</h3>

            {/* Dropdown Button for Small Screens */}
            <div className="d-md-none">
              <button
                className="btn btn-secondary dropdown-toggle"
                onClick={toggleDropdown}
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
                      onClick={() => handleSubcategoryChange(sub.id)}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subcategory Buttons for Larger Screens */}
            <div className="d-none d-md-block">
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
                  </div>
                  {subcategories[selectedCategory].map((sub) => (
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="filter-tab text-dark">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="price-filter">
            <div className="Price-filter-input">
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
            </div>
            <div className="price-filter-button">
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
        </div>
        <div className="product-grid">
          {Object.entries(groupedProducts).map(
            ([categoryName, subcategoryGroups]) => (
              <div key={categoryName} className="category-group">
                <h3>
                  {categoryName} (
                  {Object.values(subcategoryGroups).flat().length})
                </h3>
                {Object.entries(subcategoryGroups).map(
                  ([subcategoryName, products]) => (
                    <div key={subcategoryName} className="subcategory-group">
                      <h3>
                        {subcategoryName} ({products.length})
                      </h3>
                      <div className="product-cards">
                        {products.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => openModal(product)}
                          >
                            <ProductCards
                              key={product.id}
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
      </div>
      <Footer />
      {modalProduct && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content" ref={modalRef}>
              <div className="modal-header">
                <h3 className="modal-title">{modalProduct.name}</h3>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className=" Model-image col-md-auto">
                    <img
                      src={modalProduct.image_url}
                      alt={modalProduct.name}
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-md-auto">
                    <div className="Model-price">
                      <h5>Price:</h5>
                      <div className="Model-price-value">
                        ₹{modalProduct.price}
                      </div>
                    </div>
                    <div className="Model-description">
                      <h5>{modalProduct.details}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FrontPage;
