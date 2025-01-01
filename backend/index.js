require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const subcategoryRoutes = require("./routes/subcategories");
const uploadRoutes = require("./routes/upload");
const loginRoutes = require("./routes/login");
const printcatalog = require("./routes/printCatalog");

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/upload-image", uploadRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/print-catalog", printcatalog);

// Server setup
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
