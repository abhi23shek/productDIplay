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

// require("dotenv").config();
// const express = require("express");
// const app = express();
// const cors = require("cors");
// const pool = require("./config/db");

// app.use(cors());
// app.use(express.json()); // Middleware to parse JSON

// // Route to fetch all products
// app.get("/api/products", async (req, res) => {
//   try {

//     const result = await pool`SELECT * FROM products`;

//     console.log("Query Result:", result);

//     res.json(result);

//   } catch (err) {
//     console.error("Error fetching products:", err);
//     res.status(500).json({ error: "Error fetching products" });
//   }
// });

// // Route to add a new product
// app.post("/api/products", async (req, res) => {
//   const { name, price, details, image_url, category_id, subcategory_id } =
//     req.body;

//   if (!category_id || !subcategory_id) {
//     return res
//       .status(400)
//       .json({ message: "Category and Subcategory are required" });
//   }

//   try {
//     // Use template string for parameterized query
//     const result = await pool`
//       INSERT INTO products (name, price, details, image_url, category_id, subcategory_id)
//       VALUES (${name}, ${price}, ${details}, ${image_url}, ${category_id}, ${subcategory_id})
//       RETURNING *
//     `;
//     res.json(result[0]);
//   } catch (error) {
//     console.error("Error adding product:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // Route to delete a product by ID
// app.delete("/api/products/:id", async (req, res) => {
//   const { id } = req.params; // Get the product ID from the URL parameters

//   try {
//     // Delete the product from the database using the ID
//     const result = await pool`
//   DELETE FROM products
//   WHERE id = ${id}
//   RETURNING *
// `;

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     // Respond with the deleted product
//     res.status(200).json(result.rows[0]);
//   } catch (err) {
//     console.error("Error deleting product:", err);
//     res.status(500).json({ error: "Error deleting product" });
//   }
// });

// // Route to update a product by ID
// app.put("/api/products/:id", async (req, res) => {
//   const { id } = req.params; // Get the product ID from the URL
//   const { name, price, details, image_url } = req.body; // Get the updated product data from the request body

//   try {
//     // Update the product in the database
//     const result = await pool`
//   UPDATE products
//   SET name = ${name},
//       price = ${price},
//       details = ${details},
//       image_url = ${image_url}
//   WHERE id = ${id}
//   RETURNING *
// `;

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     // Respond with the updated product data
//     res.status(200).json(result.rows[0]);
//   } catch (err) {
//     console.error("Error updating product:", err);
//     res.status(500).json({ error: "Error updating product" });
//   }
// });

// // Categories Routes
// app.get("/api/categories", async (req, res) => {
//   try {
//     const categories = await pool`
//       SELECT * FROM categories
//     `;

//     // Log categories to check the result
//     // console.log(categories);

//     // If no categories are found, return a 404 error
//     if (categories.length === 0) {
//       return res.status(404).json({ error: "No categories found" });
//     }
//     // console.log("categories found");
//     // Return the categories if they are found
//     res.status(200).json(categories);
//   } catch (err) {
//     console.error("Error fetching categories:", err);
//     res.status(500).json({ error: "Error fetching categories" });
//   }
// });

// app.post("/api/categories", async (req, res) => {
//   const { name } = req.body;
//   try {
//     const newCategory = await pool`
//       INSERT INTO categories (name)
//       VALUES (${name})
//       RETURNING *;
//     `;

//     // newCategory is an array, so we access it directly without 'rows'
//     res.json(newCategory[0]); // Return the first object in the array
//   } catch (err) {
//     console.error("Error adding category:", err.message);
//     res.status(500).json({ error: "Error adding category" });
//   }
// });

// app.delete("/api/categories/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool`
//   DELETE FROM categories
//   WHERE id = ${id}
//   RETURNING *
// `;

//     if (result.rowCount === 0) {
//       return res.status(404).json({ error: "Category not found" });
//     }
//     res.status(200).json({ message: "Category deleted" });
//   } catch (error) {
//     console.error("Error deleting category:", error);
//     res.status(500).json({ error: "Error deleting category" });
//   }
// });

// // SUbcategories Routes

// app.post("/api/subcategories", async (req, res) => {
//   const { name, category_id } = req.body;
//   try {
//     const result = await pool`
//       INSERT INTO subcategories (name, category_id)
//       VALUES (${name}, ${category_id})
//       RETURNING *;
//     `;

//     // neon returns an array, so access it directly
//     res.status(201).json(result[0]); // Return the newly created subcategory
//   } catch (error) {
//     console.error("Error adding subcategory:", error);
//     res.status(500).json({ error: "Error adding subcategory" });
//   }
// });

// app.get("/api/subcategories/:categoryId", async (req, res) => {
//   const { categoryId } = req.params;
//   try {
//     const result = await pool`
//       SELECT * FROM subcategories
//       WHERE category_id = ${categoryId}
//     `;

//     if (result.length === 0) {
//       // Return an empty array or appropriate message if no subcategories are found
//       res.status(404).json({ message: "No subcategories found" });
//     } else {
//       res.status(200).json(result); // Return the subcategories data
//     }
//   } catch (error) {
//     console.error("Error fetching subcategories:", error);
//     res.status(500).json({ error: "Error fetching subcategories" });
//   }
// });

// app.delete("/api/subcategories/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     await pool`
//   DELETE FROM subcategories
//   WHERE id = ${id}
// `;
//     res.status(200).send("Subcategory deleted successfully");
//   } catch (error) {
//     console.error("Error deleting subcategory:", error);
//     res.status(500).send("Error deleting subcategory");
//   }
// });

// // Server setup
// const port = 3001;
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
