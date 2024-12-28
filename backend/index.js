require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
// const axios = require("axios"); // For making HTTP requests to Imgbb
const multer = require("multer"); // For handling file uploads
const pool = require("./config/db");

app.use(cors());
app.use(express.json()); // Middleware to parse JSON

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint to upload image to Imgbb
app.post("/api/upload-image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const imageFile = req.file; // Get the uploaded file (in memory)
    const imageUrl = await uploadToImgbb(imageFile); // Upload it to Imgbb

    res.json({ imageUrl }); // Send back the image URL from Imgbb
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Error uploading image" });
  }
});

// Helper function to upload image to Imgbb
const uploadToImgbb = async (imageFile) => {
  const formData = new FormData();

  // Convert Buffer to Blob (as FormData expects a Blob or File)
  const blob = new Blob([imageFile.buffer], { type: imageFile.mimetype });

  formData.append("image", blob, imageFile.originalname);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (result.success) {
    return result.data.url; // Return the image URL from Imgbb
  } else {
    throw new Error("Failed to upload image to Imgbb");
  }
};

// Route to fetch all products
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool`SELECT * FROM products`;
    res.json(result); // Send product data as JSON response
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
    const result = await pool`
      INSERT INTO products (name, price, details, image_url, category_id, subcategory_id)
      VALUES (${name}, ${price}, ${details}, ${image_url}, ${category_id}, ${subcategory_id})
      RETURNING *
    `;
    res.json(result[0]); // Return the newly added product
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to delete a product by ID
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool`
      DELETE FROM products 
      WHERE id = ${id} 
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(result[0]); // Return the deleted product
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Error deleting product" });
  }
});

// Route to update a product by ID
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, details, image_url } = req.body;

  try {
    const result = await pool`
      UPDATE products 
      SET name = ${name}, 
          price = ${price}, 
          details = ${details}, 
          image_url = ${image_url} 
      WHERE id = ${id} 
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(result[0]); // Return the updated product
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Error updating product" });
  }
});

// Categories Routes

// Fetch all categories
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await pool`
      SELECT * FROM categories
    `;

    if (categories.length === 0) {
      return res.status(404).json({ error: "No categories found" });
    }

    res.status(200).json(categories); // Return the categories data
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Error fetching categories" });
  }
});

// Add a new category
app.post("/api/categories", async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = await pool`
      INSERT INTO categories (name) 
      VALUES (${name}) 
      RETURNING *;
    `;

    res.json(newCategory[0]); // Return the newly created category
  } catch (err) {
    console.error("Error adding category:", err.message);
    res.status(500).json({ error: "Error adding category" });
  }
});

// Delete a category by ID
app.delete("/api/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool`
      DELETE FROM categories 
      WHERE id = ${id} 
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted" }); // Confirm category deletion
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Error deleting category" });
  }
});

// Subcategories Routes

// Add a new subcategory
app.post("/api/subcategories", async (req, res) => {
  const { name, category_id } = req.body;
  try {
    const result = await pool`
      INSERT INTO subcategories (name, category_id) 
      VALUES (${name}, ${category_id}) 
      RETURNING *;
    `;
    res.status(201).json(result[0]); // Return the newly created subcategory
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({ error: "Error adding subcategory" });
  }
});

// Fetch subcategories by category ID
app.get("/api/subcategories/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  try {
    const result = await pool`
      SELECT * FROM subcategories 
      WHERE category_id = ${categoryId}
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "No subcategories found" });
    }

    res.status(200).json(result); // Return the subcategories data
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ error: "Error fetching subcategories" });
  }
});

// Delete a subcategory by ID
app.delete("/api/subcategories/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool`
      DELETE FROM subcategories 
      WHERE id = ${id}
    `;
    res.status(200).send("Subcategory deleted successfully"); // Confirm subcategory deletion
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
