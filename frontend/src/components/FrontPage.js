import React, { useEffect, useState } from "react";
import "./FrontPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ProductCards from "./ProductCards";
import Footer from "./Footer";

function FrontPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const productResponse = await fetch(
          "http://localhost:3001/api/products"
        );
        const productsData = await productResponse.json();

        const categoryResponse = await fetch(
          "http://localhost:3001/api/categories"
        );
        const categoriesData = await categoryResponse.json();

        setProducts(productsData);
        setCategories(categoriesData);
        setFilteredProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  const fetchSubcategories = async (categoryId) => {
    try {
      const subcategoryResponse = await fetch(
        `http://localhost:3001/api/subcategories/${categoryId}`
      );
      const subcategoriesData = await subcategoryResponse.json();
      setSubcategories(
        Array.isArray(subcategoriesData) ? subcategoriesData : []
      );
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory("All");
    if (categoryId !== "All") {
      fetchSubcategories(categoryId);
      filterProducts(searchTerm, categoryId, "All");
    } else {
      setSubcategories([]);
      setFilteredProducts(products);
    }
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    filterProducts(searchTerm, selectedCategory, subcategoryId);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterProducts(term, selectedCategory, selectedSubcategory);
  };

  const filterProducts = (term, categoryId, subcategoryId) => {
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

    setFilteredProducts(filtered);
  };
  const groupByCategory = () => {
    const grouped = {};

    filteredProducts.forEach((product) => {
      const categoryName =
        categories.find((cat) => cat.id === product.category_id)?.name ||
        "Uncategorized";

      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }

      grouped[categoryName].push(product);
    });

    return grouped;
  };

  if (loading) {
    return <p>Loading products...</p>;
  }
  const groupedProducts = selectedCategory === "All" ? groupByCategory() : null;

  return (
    <div className="app-container">
      <Navbar />
      <HeroSection />
      <div className="category-section my-4 category-text">
        <h2>Categories</h2>
        <div className="btn-group" role="group">
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
      {selectedCategory !== "All" && (
        <div className="subcategory-section my-4 subcategory-text">
          {subcategories.length > 0 ? (
            <>
              <h3>Subcategories</h3>
              <div className="btn-group" role="group">
                <button
                  className={`btn btn-outline-secondary ${
                    selectedSubcategory === "All" ? "active" : ""
                  }`}
                  onClick={() => handleSubcategoryChange("All")}
                >
                  All
                </button>
                {subcategories.map((sub) => (
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
            </>
          ) : (
            <p>No subcategories available for this category.</p>
          )}
        </div>
      )}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="product-grid">
        {selectedCategory === "All" ? (
          Object.entries(groupedProducts).map(([categoryName, products]) => (
            <div key={categoryName} className="category-group">
              <h3>{categoryName}</h3>
              <div className="product-cards">
                {products.map((product) => (
                  <ProductCards
                    key={product.id}
                    image={product.image_url}
                    name={product.name}
                    price={product.price}
                    description={product.details}
                  />
                ))}
              </div>
            </div>
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCards
              key={product.id}
              image={product.image_url}
              name={product.name}
              price={product.price}
              description={product.details}
            />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default FrontPage;
