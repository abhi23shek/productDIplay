const express = require("express");
const fs = require("fs");
const { google } = require("googleapis");
const multer = require("multer");
const path = require("path");

const router = express.Router();
// const apiKeys = require("../gdriveapikey.json");

const apiKeys = {
  client_email: process.env.CLIENT_EMAIL,
  private_key: process.env.PRIVATE_KEY,
};

const SCOPE = ["https://www.googleapis.com/auth/drive"];

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage: storage });

// Function to authorize access to Google Drive API
async function authorize() {
  // console.log(apiKeys.client_email);
  // console.log(apiKeys.private_key);
  const jwtClient = new google.auth.JWT(
    apiKeys.client_email,
    null,
    apiKeys.private_key,
    SCOPE
  );

  await jwtClient.authorize();
  return jwtClient;
}

// Function to upload a file to Google Drive
async function uploadFile(authClient, localFilePath, fileName, folderId) {
  return new Promise((resolve, reject) => {
    const drive = google.drive({ version: "v3", auth: authClient });

    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      body: fs.createReadStream(localFilePath),
      mimeType: "application/pdf", // Adjust mimeType for PDFs
    };

    drive.files.create(
      {
        resource: fileMetadata,
        media,
        fields: "id",
      },
      (error, file) => {
        if (error) {
          return reject(error);
        }
        resolve(file);
      }
    );
  });
}

// POST route to handle file uploads
router.post("/", upload.single("catalogs"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const localFilePath = path.join(__dirname, "uploads", req.file.filename);
  const fileName = req.file.originalname;
  const folderId = "1aaLCO1JxGhgTNwjvHwOcsIJ7EaW8eW6D"; // Replace with your folder ID

  try {
    const authClient = await authorize();
    const fileResponse = await uploadFile(
      authClient,
      localFilePath,
      fileName,
      folderId
    );

    // Optionally, delete the local file after uploading it to Google Drive
    fs.unlinkSync(localFilePath);

    res.status(200).json({
      message: "File uploaded successfully",
      fileId: fileResponse.data.id,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

async function listFiles(authClient, folderId) {
  return new Promise((resolve, reject) => {
    const drive = google.drive({ version: "v3", auth: authClient });

    drive.files.list(
      {
        q: `'${folderId}' in parents and trashed = false`, // Query to list files in the specific folder
        fields: "files(id, name)", // Fields to fetch: file ID and name
      },
      (error, response) => {
        if (error) {
          return reject(error);
        }
        resolve(response.data.files); // Return the list of files
      }
    );
  });
}

// GET route to fetch the list of catalogs from Google Drive
router.get("/", async (req, res) => {
  const folderId = "1aaLCO1JxGhgTNwjvHwOcsIJ7EaW8eW6D"; // Replace with your folder ID

  try {
    const authClient = await authorize();
    const files = await listFiles(authClient, folderId);

    res.status(200).json(files); // Return the list of files (catalogs)
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

router.get("/download/:filename", async (req, res) => {
  const fileName = req.params.filename;
  const folderId = "1aaLCO1JxGhgTNwjvHwOcsIJ7EaW8eW6D"; // Replace with your folder ID

  try {
    const authClient = await authorize();
    const drive = google.drive({ version: "v3", auth: authClient });

    // Find file by name in the folder
    const response = await drive.files.list({
      q: `'${folderId}' in parents and name = '${fileName}'`,
      fields: "files(id, name)",
    });

    // console.log("Google Drive response:", response.data); // Log the response for debugging

    if (response.data.files.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    const fileId = response.data.files[0].id;

    // Get the file content
    const fileStream = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    // console.log("File Stream Data:", fileStream.data); // Log the file stream for debugging

    if (!fileStream || !fileStream.data) {
      return res.status(500).json({ error: "File stream is undefined" });
    }

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-Type", "application/pdf");

    fileStream.data.pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ error: "Failed to download file" });
  }
});

router.delete("/:filename", async (req, res) => {
  const fileName = req.params.filename;
  const folderId = "1aaLCO1JxGhgTNwjvHwOcsIJ7EaW8eW6D"; // Replace with your folder ID

  try {
    const authClient = await authorize();
    const drive = google.drive({ version: "v3", auth: authClient });

    // Find file by name in the folder
    const response = await drive.files.list({
      q: `'${folderId}' in parents and name = '${fileName}'`,
      fields: "files(id, name)",
    });

    if (response.data.files.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    const fileId = response.data.files[0].id;

    // Delete the file from Google Drive
    await drive.files.delete({
      fileId: fileId,
    });

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

module.exports = router;
