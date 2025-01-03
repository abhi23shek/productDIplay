import React, { useEffect, useState } from "react";
import "./FrontPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminProductCards from "./AdminProductCards";
import Footer from "./Footer";

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
    //Addition of Subcategory
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

        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setSubcategories(subcategoriesData);
        setFilteredProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await fetch("http://localhost:3001/api/products");

  //       // Check if the response is ok (status 200)
  //       if (response.ok) {
  //         const data = await response.json(); // Parse JSON response
  //         console.log("Fetched Products:", data);
  //         setProducts(data); // Assuming you're setting products in state
  //       } else {
  //         console.error("Error fetching products:", response.status);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  // const handleDelete = async (id) => {
  //   try {
  //     // Send a DELETE request to the backend
  //     const response = await fetch(`http://localhost:3001/api/products/${id}`, {
  //       method: "DELETE",
  //     });

  //     if (response.ok) {
  //       // Update the local state to remove the product from the list
  //       setProducts(products.filter((product) => product.id !== id));
  //     } else {
  //       console.error("Error deleting product:", response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting product:", error);
  //   }
  // };

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
    <div className="app-container">
      <div className="container d-flex flex-column justify-content-center align-items-center">
        <h1>Product Display</h1>
      </div>

      <div className="category-section my-4 category-text">
        <h2>Categories</h2>
        <div className="row">
          <div className="col-12">
            <div className="btn-group flex-wrap" role="group">
              <button
                className={`btn btn-outline-primary ${
                  selectedCategory === "All" ? "active" : ""
                }`}
                onClick={() => handleCategoryChange("All")}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`btn btn-outline-primary ${
                    category.id === selectedCategory ? "active" : ""
                  }`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {selectedCategory !== "All" &&
        subcategories[selectedCategory]?.length > 0 && (
          <div className="subcategory-section my-4 subcategory-text">
            <h3>Subcategories</h3>
            <div className="row">
              <div className="col-12">
                <div className="btn-group flex-wrap" role="group">
                  <button
                    className={`btn btn-outline-secondary ${
                      selectedSubcategory === "All" ? "active" : ""
                    }`}
                    onClick={() => handleSubcategoryChange("All")}
                  >
                    All
                  </button>
                  {subcategories[selectedCategory].map((sub) => (
                    <button
                      key={sub.id}
                      className={`btn btn-outline-secondary ${
                        sub.id === selectedSubcategory ? "active" : ""
                      }`}
                      onClick={() => handleSubcategoryChange(sub.id)}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      <div className="filter-tab">
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
      <div className="product-grid">
        {Object.entries(groupedProducts).map(
          ([categoryName, subcategoryGroups]) => (
            <div key={categoryName} className="category-group">
              <h3>{categoryName}</h3>
              {Object.entries(subcategoryGroups).map(
                ([subcategoryName, products]) => (
                  <div key={subcategoryName} className="subcategory-group">
                    <h4>{subcategoryName}</h4>
                    <div className="product-cards">
                      {products.map((product) => (
                        <AdminProductCards
                          key={product.id}
                          image={product.image_url}
                          name={product.name}
                          price={product.price}
                          description={product.details}
                          id={product.id}
                        />
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )
        )}
      </div>
      <Footer />
    </div>
  );
}

export default AdminDisplay;
