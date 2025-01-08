const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// Fetch all products
router.get("/", async (req, res) => {
  try {
    const result =
      await pool`SELECT * FROM products ORDER BY price ASC, name ASC`;
    res.json(result);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Fetch a single product by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // Validate the ID
  if (!id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    // Fetch the product from the database
    const result = await pool`SELECT * FROM products WHERE id = ${id}`;

    // Check if the product exists
    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Return the product
    res.status(200).json({ product: result[0] });
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new product
router.post("/", async (req, res) => {
  const { name, price, details, image_url, category_id, subcategory_id } =
    req.body;

  try {
    const result = await pool`
      INSERT INTO products (name, price, details, image_url, category_id, subcategory_id)
      VALUES (${name}, ${price}, ${details}, ${image_url}, ${category_id}, ${subcategory_id})
      RETURNING *;
    `;
    res.json(result[0]);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a product

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, details, image_url, category_id, subcategory_id } =
    req.body;

  // Check if the ID is provided and valid
  if (!id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  // Validate at least one field to update is provided
  if (
    !name &&
    !price &&
    !details &&
    !image_url &&
    !category_id &&
    !subcategory_id
  ) {
    return res
      .status(400)
      .json({ error: "At least one field must be provided to update" });
  }

  try {
    // Initialize an array for the updates and a list of values
    const updates = [];
    let counter = 1;
    const values = [];

    // Dynamically add fields to be updated
    if (name) {
      updates.push(`name = $${counter++}`);
      values.push(name);
    }
    if (price) {
      updates.push(`price = $${counter++}`);
      values.push(price);
    }
    if (details) {
      updates.push(`details = $${counter++}`);
      values.push(details);
    }
    if (image_url) {
      updates.push(`image_url = $${counter++}`);
      values.push(image_url);
    }
    if (category_id) {
      updates.push(`category_id = $${counter++}`);
      values.push(category_id);
    }
    if (subcategory_id) {
      updates.push(`subcategory_id = $${counter++}`);
      values.push(subcategory_id);
    }

    // Join the update clauses into a comma-separated string
    const updateClause = updates.join(", ");

    // Construct the query with placeholders
    const query = `
      UPDATE products
      SET ${updateClause}
      WHERE id = $${counter}
      RETURNING *
    `;

    // Add the product ID to the values array at the end
    values.push(id);

    // Use tagged template literal to execute the query
    const result = await pool(query, values); // This is where we use Neon properly

    // Check if the product exists
    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Send the successful response
    res.status(200).json({
      message: "Product updated successfully",
      product: result[0],
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool`
      DELETE FROM products WHERE id = ${id} RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Error deleting product" });
  }
});

module.exports = router;
