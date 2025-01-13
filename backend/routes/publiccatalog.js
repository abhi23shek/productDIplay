const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { pdf2img } = require("pdf2image");
const poppler = require("pdf-poppler");

const uploadsDir = path.join(__dirname, "uploads");
const router = express.Router();

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // File will be saved in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Add a timestamp to the original filename to avoid conflicts
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueName = `${timestamp}_${sanitizedName}`;
    cb(null, uniqueName);
  },
});

// Initialize Multer
const upload = multer({ storage: storage });

// In-memory array to store catalog metadata (could be replaced by a database)
let catalogs = [];

// Upload multiple catalogs endpoint
router.post("/", upload.array("catalogs", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  // Save catalog metadata
  req.files.forEach((file) => {
    catalogs.push({
      name: file.originalname,
      url: `/uploads/${file.filename}`,
      uploadDate: new Date(),
      filename: file.filename, // Store the filename for deletion
    });
  });

  res.status(200).send({ message: "Catalogs uploaded successfully!" });
});
// router.post("/", upload.array("catalogs", 10), (req, res) => {
//   if (!req.files || req.files.length === 0) {
//     return res.status(400).send("No files uploaded.");
//   }

//   // Generate preview images for each catalog PDF
//   req.files.forEach((file) => {
//     const filePath = path.join(uploadsDir, file.filename);
//     const outputFile = path.join(uploadsDir, `preview_${file.filename}.png`); // Output image file name

//     const options = {
//       format: "png",
//       page: 1, // Convert the first page of the PDF
//     };

//     poppler
//       .convert(filePath, options)
//       .then(() => {
//         // After conversion, save the preview file
//         catalogs.push({
//           name: file.originalname,
//           url: `/uploads/${file.filename}`,
//           preview: `/uploads/preview_${file.filename}.png`, // Path to the preview image
//           filename: file.filename,
//         });
//       })
//       .catch((err) => {
//         console.error("Error generating preview:", err);
//       });
//   });

//   res.status(200).send({ message: "Catalogs uploaded successfully!" });
// });

// Endpoint to fetch all catalogs
router.get("/", (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).send("Error reading the uploads directory.");
    }

    // Filter only PDF files (or other formats you support)
    const catalogs = files
      .filter((file) => file.endsWith(".pdf"))
      .map((file) => ({
        name: file.split("_").slice(1).join("_"), // Remove the timestamp prefix
        url: `/uploads/${file}`,
        filename: file, // The actual filename in the file system
      }));

    res.status(200).json(catalogs); // Return the catalog metadata (file name, URL, etc.)
  });
});

// Endpoint to download a catalog
router.get("/download/:filename", (req, res) => {
  const { filename } = req.params;

  // Resolve the full path to the file
  const filePath = path.join(uploadsDir, filename);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found.");
  }

  // Send the file for download
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Error while downloading file:", err);
      res.status(500).send("Error downloading the file.");
    }
  });
});

// Endpoint to delete a catalog
router.delete("/:filename", (req, res) => {
  const { filename } = req.params;

  const catalogIndex = catalogs.findIndex(
    (catalog) => catalog.filename === filename
  );

  if (catalogIndex === -1) {
    return res.status(404).send("Catalog not found.");
  }

  // Delete the file from the filesystem
  const filePath = path.join(uploadsDir, filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).send("Failed to delete catalog file.");
    }

    // Remove catalog metadata
    catalogs.splice(catalogIndex, 1);

    res.status(200).send({ message: "Catalog deleted successfully." });
  });
});

// Serve uploaded files
router.use("/uploads", express.static("uploads"));

module.exports = router;
