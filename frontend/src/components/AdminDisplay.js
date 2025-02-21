import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminProductCards from "./AdminProductCards";
import "./AdminDisplay.css";
import BarLoader from "react-spinners/BarLoader";
import ResponsiveCategoryFilter from "./ResponsiveCategoryFilter";
import ResponsiveSubcategoryFilter from "./ResponsiveSubcategoryFilter";
import { Trash, Edit, Trash2 } from "lucide-react";

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
          `${process.env.REACT_APP_SERVER_URL}/api/products`
        );
        const productsData = await productResponse.json();

        const categoryResponse = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/categoriesforadmin`
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
  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedSubcategory("All");
    setFilteredProducts(products); // Important: Reset to the original product list
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
    return (
      <div className="loader">
        <p> product loading...</p>
        <BarLoader
          cssOverride={{}}
          height={10}
          speedMultiplier={1}
          width={300}
        />
      </div>
    );
  }
  // const handleDelete = async (id) => {
  //   try {
  //     // Send a DELETE request to the backend
  //     const response = await fetch(
  //       `${process.env.REACT_APP_SERVER_URL}/api/products/${id}`,
  //       {
  //         method: "DELETE",
  //       }
  //     );

  //     if (response.ok) {
  //       // Update the local state to remove the product from the list
  //       setFilteredProducts(products.filter((product) => product.id !== id));
  //     } else {
  //       console.error("Error deleting product:", response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting product:", error);
  //   }
  // };

  const handleDelete = async (id) => {
    try {
      // Send a DELETE request to the backend
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Update both `products` and `filteredProducts` states
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
        setFilteredProducts((prevFilteredProducts) =>
          prevFilteredProducts.filter((product) => product.id !== id)
        );
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

      <div className="admin-display-container">
        <div className="Admin-category-section">
          <ResponsiveCategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            minPrice={minPrice}
            maxPrice={maxPrice}
            handlePriceFilter={handlePriceFilter}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
            resetFilters={resetFilters}
          />
        </div>
        <div className="Adminpage-content">
          <ResponsiveSubcategoryFilter
            subcategories={subcategories}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onSubcategoryChange={handleSubcategoryChange}
          />

          <div className="Admin-product-grid">
            {Object.entries(groupedProducts).map(
              ([categoryName, subcategories]) => (
                <div key={categoryName} className="category-group mb-4">
                  <div className="Adminpage-ctg-heading">{categoryName}</div>
                  {Object.entries(subcategories).map(
                    ([subcategoryName, products]) => (
                      <div
                        key={subcategoryName}
                        className="Admin-subcategory-group"
                      >
                        <div className="Adminpage-sub-heading">
                          {subcategoryName}
                        </div>
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
                                <div className="admin-product-card-btn">
                                  <Trash2
                                    className="text-danger"
                                    size={20}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleDelete(product.id)}
                                  />
                                  <a href={`/admin/update/${product.id}`}>
                                    <Edit className="text-primary" size={20} />
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
        </div>
        {/* <Footer /> */}
      </div>
    </div>
  );
}

export default AdminDisplay;
