const PDFDocument = require("pdfkit");
const express = require("express");
const axios = require("axios");
const pool = require("../config/db");
const router = express.Router();

router.post("/", async (req, res) => {
  const { categoryId } = req.body;

  if (!categoryId) {
    return res.status(400).json({ error: "Category ID is required" });
  }

  try {
    const subcategories = await pool`
      SELECT id, name FROM subcategories WHERE category_id = ${categoryId}
    `;

    if (subcategories.length === 0) {
      return res.status(404).json({ error: "No subcategories found" });
    }

    const doc = new PDFDocument({ margin: 30 });
    const filename = `catalog-${categoryId}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    doc.pipe(res);

    const cellWidth = 180;
    const cellHeight = 200;
    const margin = 10;

    const renderHeader = () => {
      doc.fontSize(16).text("SHIV ENTERPRISES", { align: "center" });
      doc.text("7838146412, 9958660231, 9818143181", { align: "center" });
      doc.text("Trademark:-Vidhata", { align: "center" }).moveDown();
    };

    const renderProducts = async (products, subcategoryName) => {
      doc.addPage();
      renderHeader();

      doc
        .fontSize(20)
        .text(`Subcategory: ${subcategoryName}`, { align: "center" })
        .moveDown();

      let x = doc.page.margins.left;
      let y = doc.page.margins.top + 100;

      for (let i = 0; i < products.length; i++) {
        const product = products[i];

        if (y + cellHeight > doc.page.height - doc.page.margins.bottom) {
          doc.addPage();
          renderHeader();
          doc
            .fontSize(20)
            .text(`Subcategory: ${subcategoryName}`, { align: "center" })
            .moveDown();
          x = doc.page.margins.left;
          y = doc.page.margins.top + 100;
        }

        // Draw product cell
        doc.rect(x, y, cellWidth, cellHeight).stroke();

        // Dynamically adjust font size for product name
        let nameFontSize = 12;
        doc.fontSize(nameFontSize);
        while (
          doc.widthOfString(product.name, { width: cellWidth - 10 }) >
            cellWidth - 10 &&
          nameFontSize > 8
        ) {
          nameFontSize -= 1;
          doc.fontSize(nameFontSize);
        }

        doc.text(product.name, x + 5, y + 5, {
          width: cellWidth - 10,
          align: "center",
        });

        const lineY = y + 18; // Adjust the Y-coordinate for the horizontal line
        doc
          .moveTo(x, lineY)
          .lineTo(x + cellWidth, lineY)
          .stroke();

        //Price Detail
        const eachcellWidth = 180; // Cell width

        // Draw vertical line to separate the two sections
        doc
          .moveTo(x - 35 + eachcellWidth / 2, y + 18) // Starting point for the vertical line
          .lineTo(x - 35 + eachcellWidth / 2, y + 36) // Ending point for the vertical line
          .stroke();

        // Center and print price in the left section
        doc.fontSize(12).text(`Rs.${product.price}`, x + 5, y + 20, {
          width: eachcellWidth / 2 - 40,
          align: "center",
        });

        // Center and print details in the right section
        doc
          .fontSize(12)
          .text(product.details, x - 35 + eachcellWidth / 2, y + 20, {
            width: eachcellWidth / 2 + 30,
            align: "center",
          });
        const lineYBI = y + 36; // Adjust the Y-coordinate for the horizontal line
        doc
          .moveTo(x, lineYBI)
          .lineTo(x + cellWidth, lineYBI)
          .stroke();
        // Draw product image
        if (product.image_url) {
          try {
            const imageBuffer = await axios.get(product.image_url, {
              responseType: "arraybuffer",
            });
            doc.image(Buffer.from(imageBuffer.data), x + 10, y + 50, {
              width: cellWidth - 20,
              height: 130,
              align: "center",
            });
          } catch {
            doc.text("[Image Not Available]", x + 5, y + 90);
          }
        }

        x += cellWidth + margin;

        if ((i + 1) % 3 === 0) {
          x = doc.page.margins.left;
          y += cellHeight + margin;
        }
      }
    };

    for (const subcat of subcategories) {
      const products = await pool`
        SELECT name, price, details, image_url 
        FROM products 
        WHERE subcategory_id = ${subcat.id}
      `;

      if (products.length === 0) {
        doc.addPage();
        renderHeader();
        doc
          .fontSize(20)
          .text(`Subcategory: ${subcat.name}`, { align: "center" })
          .moveDown();
        doc.text("No products available for this subcategory.", {
          align: "center",
        });
      } else {
        await renderProducts(products, subcat.name);
      }
    }

    doc.end();
  } catch (error) {
    console.error("Error generating catalog:", error);
    if (!res.headersSent)
      res.status(500).json({ error: "Error generating catalog" });
  }
});

module.exports = router;

// const PDFDocument = require("pdfkit");
// const express = require("express");
// const axios = require("axios");
// const pool = require("../config/db");
// const router = express.Router();

// router.post("/", async (req, res) => {
//   const { categoryId } = req.body;

//   if (!categoryId) {
//     return res.status(400).json({ error: "Category ID is required" });
//   }

//   try {
//     const subcategories = await pool`
//       SELECT id, name FROM subcategories WHERE category_id = ${categoryId}
//     `;

//     if (subcategories.length === 0) {
//       return res.status(404).json({ error: "No subcategories found" });
//     }

//     const doc = new PDFDocument({ margin: 30 });
//     const filename = `catalog-${categoryId}.pdf`;

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
//     doc.pipe(res);

//     const cellWidth = 180; // Increased cell width
//     const cellHeight = 200; // Increased cell height
//     const margin = 10; // Space between cells

//     const renderHeader = () => {
//       doc.fontSize(16).text("SHIV ENTERPRISES", { align: "center" });
//       doc.text("7838146412, 9958660231, 9818143181", { align: "center" });
//       doc.text("Trademark:-Vidhata", { align: "center" }).moveDown();
//     };

//     const renderProducts = async (products, subcategoryName) => {
//       doc.addPage();
//       renderHeader();

//       doc
//         .fontSize(20)
//         .text(`Subcategory: ${subcategoryName}`, { align: "center" })
//         .moveDown();

//       let x = doc.page.margins.left;
//       let y = doc.page.margins.top + 100;

//       for (let i = 0; i < products.length; i++) {
//         const product = products[i];

//         // Check if the next cell fits on the page
//         if (y + cellHeight > doc.page.height - doc.page.margins.bottom) {
//           doc.addPage();
//           renderHeader();
//           doc
//             .fontSize(20)
//             .text(`Subcategory: ${subcategoryName}`, { align: "center" })
//             .moveDown();
//           x = doc.page.margins.left;
//           y = doc.page.margins.top + 100;
//         }

//         // Draw product cell
//         doc.rect(x, y, cellWidth, cellHeight).stroke();

//         // Add product details
//         doc.fontSize(12).text(product.name, x + 5, y + 5, {
//           width: cellWidth - 10,
//           align: "center",
//         });

//         const eachcellWidth = 180; // Cell width

//         // Draw vertical line to separate the two sections
//         doc
//           .moveTo(x - 35 + eachcellWidth / 2, y + 20) // Starting point for the vertical line
//           .lineTo(x - 35 + eachcellWidth / 2, y + 40) // Ending point for the vertical line
//           .stroke();

//         // Center and print price in the left section
//         doc.fontSize(12).text(`Rs.${product.price}`, x + 5, y + 20, {
//           width: eachcellWidth / 2 - 40,
//           align: "center",
//         });

//         // Center and print details in the right section
//         doc
//           .fontSize(12)
//           .text(product.details, x - 35 + eachcellWidth / 2, y + 20, {
//             width: eachcellWidth / 2 + 30,
//             align: "center",
//           });

//         // Add product image
//         if (product.image_url) {
//           try {
//             const imageBuffer = await axios.get(product.image_url, {
//               responseType: "arraybuffer",
//             });
//             doc.image(Buffer.from(imageBuffer.data), x + 10, y + 40, {
//               width: cellWidth - 30,
//               height: 140, // Increased image height
//               align: "center",
//             });
//           } catch {
//             doc.text("[Image Not Available]", x + 5, y + 60);
//           }
//         }

//         x += cellWidth + margin;

//         if ((i + 1) % 3 === 0) {
//           x = doc.page.margins.left;
//           y += cellHeight + margin;
//         }
//       }
//     };

//     for (const subcat of subcategories) {
//       const products = await pool`
//         SELECT name, price, details, image_url
//         FROM products
//         WHERE subcategory_id = ${subcat.id}
//       `;

//       if (products.length === 0) {
//         doc.addPage();
//         renderHeader();
//         doc
//           .fontSize(20)
//           .text(`Subcategory: ${subcat.name}`, { align: "center" })
//           .moveDown();
//         doc.text("No products available for this subcategory.", {
//           align: "center",
//         });
//       } else {
//         await renderProducts(products, subcat.name);
//       }
//     }

//     doc.end();
//   } catch (error) {
//     console.error("Error generating catalog:", error);
//     if (!res.headersSent)
//       res.status(500).json({ error: "Error generating catalog" });
//   }
// });

// module.exports = router;
