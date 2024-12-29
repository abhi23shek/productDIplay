const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// Fetch all categories
router.get("/", async (req, res) => {
  try {
    const categories = await pool`SELECT * FROM categories`;
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Error fetching categories" });
  }
});

// Add a category
router.post("/", async (req, res) => {
  const { name } = req.body;

  try {
    const result = await pool`
      INSERT INTO categories (name) VALUES (${name}) RETURNING *;
    `;
    res.json(result[0]);
  } catch (err) {
    console.error("Error adding category:", err);
    res.status(500).json({ error: "Error adding category" });
  }
});

// Delete a category
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool`
      DELETE FROM categories WHERE id = ${id} RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: "Error deleting category" });
  }
});

module.exports = router;
