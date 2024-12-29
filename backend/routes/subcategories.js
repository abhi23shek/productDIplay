const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// Add a subcategory
router.post("/", async (req, res) => {
  const { name, category_id } = req.body;

  try {
    const result = await pool`
      INSERT INTO subcategories (name, category_id) 
      VALUES (${name}, ${category_id}) 
      RETURNING *;
    `;
    res.status(201).json(result[0]);
  } catch (err) {
    console.error("Error adding subcategory:", err);
    res.status(500).json({ error: "Error adding subcategory" });
  }
});

// Fetch subcategories by category ID
router.get("/:categoryId", async (req, res) => {
  const { categoryId } = req.params;

  try {
    const result = await pool`
      SELECT * FROM subcategories WHERE category_id = ${categoryId};
    `;
    if (result.length === 0) {
      return res.status(404).json({ message: "No subcategories found" });
    }
    res.json(result);
  } catch (err) {
    console.error("Error fetching subcategories:", err);
    res.status(500).json({ error: "Error fetching subcategories" });
  }
});

// Delete a subcategory
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool`
      DELETE FROM subcategories WHERE id = ${id};
    `;
    res.send("Subcategory deleted successfully");
  } catch (err) {
    console.error("Error deleting subcategory:", err);
    res.status(500).send("Error deleting subcategory");
  }
});

module.exports = router;