import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminProductCards from "./AdminProductCards";
// import Footer from "./Footer";

function AdminDisplay() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [loading, setLoading] = useState(true);

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

        setProducts(productsData);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setFilteredProducts(productsData);
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
      filterProducts(categoryId, "All");
    }
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    filterProducts(selectedCategory, subcategoryId);
  };

  const filterProducts = (categoryId, subcategoryId) => {
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

    setFilteredProducts(filtered);
  };

  const groupedProducts = () => {
    const grouped = {};
    filteredProducts.forEach((product) => {
      const categoryName =
        categories.find((cat) => cat.id === product.category_id)?.name ||
        "Uncategorized";
      const subcategoryName =
        subcategories[product.category_id]?.find(
          (sub) => sub.id === product.subcategory_id
        )?.name || "Uncategorized";

      if (!grouped[categoryName]) grouped[categoryName] = {};
      if (!grouped[categoryName][subcategoryName])
        grouped[categoryName][subcategoryName] = [];

      grouped[categoryName][subcategoryName].push(product);
    });

    return grouped;
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  const grouped = groupedProducts();

  return (
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

      <div className="product-grid container">
        {Object.entries(grouped).map(([categoryName, subcategories]) => (
          <div key={categoryName} className="category-group mb-4">
            <h3 className="text-primary">{categoryName}</h3>
            {Object.entries(subcategories).map(
              ([subcategoryName, subcategoryProducts]) => (
                <div key={subcategoryName} className="subcategory-group">
                  <h4 className="text-secondary">{subcategoryName}</h4>
                  <div className="row g-3">
                    {subcategoryProducts.map((product) => (
                      <div key={product.id} className="col-md-4 col-lg-3">
                        <AdminProductCards
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          image={product.image_url}
                          description={product.details}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        ))}
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default AdminDisplay;
