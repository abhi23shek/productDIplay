require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./config/db");

app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// Route to fetch all products
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Route to add a new product
app.post("/api/products", async (req, res) => {
  const { name, price, details, image_url, category_id, subcategory_id } =
    req.body;

  if (!category_id || !subcategory_id) {
    return res
      .status(400)
      .json({ message: "Category and Subcategory are required" });
  }

  try {
    // Example SQL query, adjust according to your DB setup
    const query =
      "INSERT INTO products (name, price, details, image_url, category_id, subcategory_id) VALUES ($1, $2, $3, $4, $5, $6)";
    const values = [
      name,
      price,
      details,
      image_url,
      category_id,
      subcategory_id,
    ];

    const result = await pool.query(query, values);
    res.status(201).json({
      message: "Product added successfully",
      // product: newProduct // Return the added product details if necessary
    });
    // res.status(201).json(result.rows[0]); // Return the newly created product
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to delete a product by ID
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params; // Get the product ID from the URL parameters

  try {
    // Delete the product from the database using the ID
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Respond with the deleted product
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Error deleting product" });
  }
});

// Route to update a product by ID
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params; // Get the product ID from the URL
  const { name, price, details, image_url } = req.body; // Get the updated product data from the request body

  try {
    // Update the product in the database
    const result = await pool.query(
      "UPDATE products SET name = $1, price = $2, details = $3, image_url = $4 WHERE id = $5 RETURNING *",
      [name, price, details, image_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Respond with the updated product data
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Error updating product" });
  }
});

// Categories Routes
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await pool.query("SELECT * FROM categories");
    res.json(categories.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/api/categories", async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.json(newCategory.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/api/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Error deleting category" });
  }
});

app.post("/api/subcategories", async (req, res) => {
  const { name, category_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO subcategories (name, category_id) VALUES ($1, $2) RETURNING *",
      [name, category_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({ error: "Error adding subcategory" });
  }
});

app.get("/api/subcategories/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM subcategories WHERE category_id = $1",
      [categoryId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ error: "Error fetching subcategories" });
  }
});

app.delete("/api/subcategories/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM subcategories WHERE id = $1", [id]);
    res.status(200).send("Subcategory deleted successfully");
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).send("Error deleting subcategory");
  }
});

// Server setup
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
