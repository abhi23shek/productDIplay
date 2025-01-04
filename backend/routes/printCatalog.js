const PDFDocument = require("pdfkit");
const express = require("express");
const axios = require("axios");
const pool = require("../config/db");
const router = express.Router();

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

//     const doc = new PDFDocument({ margin: 21.4, size: [595.45, 841.68] });
//     const filename = `catalog-${categoryId}.pdf`;

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
//     doc.pipe(res);

//     const cellWidth = 180;
//     const cellHeight = 220;
//     const margin = 5;

//     const calcTotalPage = async () => {
//       let totalPages = 0;

//       for (const subcat of subcategories) {
//         const productCountResult = await pool`
//               SELECT COUNT(*) AS product_count
//               FROM products
//               WHERE subcategory_id = ${subcat.id}`;

//         const productCount = productCountResult[0].product_count;

//         const pagesForSubcategory = Math.ceil(productCount / 9); // 9 products per page

//         // Add the calculated pages to the total
//         totalPages += pagesForSubcategory;
//       }

//       return totalPages;
//     };
//     let totalPages = 0;
//     (async () => {
//       totalPages = await calcTotalPage();
//       console.log(`Total Pages: ${totalPages}`);
//     })();

//     const renderHeader = () => {
//       doc.addPage();
//       doc.font("./fonts/Bold.ttf");
//       doc
//         .fillColor("#0c4edd")
//         .fontSize(24)
//         .text("SHIV ENTERPRISES", { align: "center" });

//       const textWidth = doc.widthOfString("SHIV ENTERPRISES");
//       const textHeight = doc.currentLineHeight();
//       let x = doc.page.margins.left + 140;
//       let y = doc.page.margins.top - 5;
//       doc
//         .strokeColor("#0c4edd")
//         .lineWidth(2)
//         .moveTo(x, y + textHeight + 2) // Start the line just below the text
//         .lineTo(x + textWidth, y + textHeight + 2) // End the line below the text
//         .stroke(); // Render the line

//       doc
//         .fillColor("#2cd40a")
//         .fontSize(18)
//         .text("7838146412, 9958660231, 9717437131", { align: "center" });
//       doc
//         .fontSize(10)
//         .fillColor("red")
//         .text("(Trademark:-Vidhata)", { align: "center" });

//       // .moveDown();
//     };

//     let currentPage = 0;

//     const renderProducts = async (products, subcategoryName) => {
//       let subpageno = 1;
//       // doc.addPage();
//       let x = doc.page.margins.left;
//       let y = doc.page.margins.top + 100;
//       currentPage += 1;
//       // renderFooter(doc, currentPage, totalPages);
//       renderHeader();

//       doc
//         .fillColor("black")
//         .moveTo(x, y - 150)
//         .fontSize(15)
//         .text(`${subcategoryName}`, { align: "center" });

//       doc
//         .moveTo(x, y - 144)
//         .fontSize(10)
//         .text(`${subpageno}`, { align: "center" })
//         .moveDown();

//       for (let i = 0; i < products.length; i++) {
//         const product = products[i];

//         if (y + cellHeight > doc.page.height - doc.page.margins.bottom) {
//           // doc.addPage();

//           subpageno = subpageno + 1;
//           currentPage += 1;
//           // renderFooter(doc, currentPage, totalPages);
//           renderHeader();

//           x = doc.page.margins.left;
//           y = doc.page.margins.top + 100;
//           // doc
//           //   .moveTo(x, y + 500)
//           //   .fontSize(10)
//           //   .fillColor("black")
//           //   .text(`Page ${currentPage} of ${totalPages}`, { align: "center" });
//           doc
//             .fillColor("black")
//             .moveTo(x, y - 150)
//             .fontSize(15)
//             .text(`${subcategoryName}`, { align: "center" });
//           doc
//             .moveTo(x, y - 144)
//             .fontSize(10)
//             .text(`${subpageno}`, { align: "center" })
//             .moveDown();
//         }

//         // Draw product cell
//         doc
//           .strokeColor("#0c4edd")
//           .lineWidth(2)
//           .rect(x, y, cellWidth, cellHeight)
//           .stroke();

//         // Dynamically adjust font size for product name
//         let nameFontSize = 12;
//         doc.fontSize(nameFontSize);
//         while (
//           doc.widthOfString(product.name) > cellWidth - 12 &&
//           nameFontSize > 6
//         ) {
//           nameFontSize -= 0.5;
//           doc.fontSize(nameFontSize);
//         }

//         doc.fillColor("black").text(product.name, x + 5, y + 3, {
//           width: cellWidth - 10,
//           align: "center",
//         });

//         const lineY = y + 18; // Adjust the Y-coordinate for the horizontal line
//         doc
//           .strokeColor("#f63c05")
//           .lineWidth(1)
//           .moveTo(x, lineY)
//           .lineTo(x + cellWidth, lineY)
//           .stroke();

//         //Price Detail
//         const eachcellWidth = 180; // Cell width

//         // Draw vertical line to separate the two sections
//         doc
//           .strokeColor("#f63c05")
//           .lineWidth(1)
//           .moveTo(x - 35 + eachcellWidth / 2, y + 18) // Starting point for the vertical line
//           .lineTo(x - 35 + eachcellWidth / 2, y + 36) // Ending point for the vertical line
//           .stroke();

//         // Center and print price in the left section
//         doc
//           .fillColor("#2cd40a")
//           .fontSize(12)
//           .text(`Rs.${product.price}/-`, x + 5, y + 21, {
//             width: eachcellWidth / 2 - 40,
//             align: "center",
//           });

//         // Center and print details in the right section
//         doc
//           .fillColor("#2cd40a")
//           .fontSize(12)
//           .text(product.details, x - 35 + eachcellWidth / 2, y + 21, {
//             width: eachcellWidth / 2 + 30,
//             align: "center",
//           });
//         const lineYBI = y + 36; // Adjust the Y-coordinate for the horizontal line
//         doc
//           .strokeColor("#f63c05")
//           .lineWidth(1)
//           .moveTo(x, lineYBI)
//           .lineTo(x + cellWidth, lineYBI)
//           .stroke();

//         // Draw product image
//         if (product.image_url) {
//           try {
//             const imageBuffer = await axios.get(product.image_url, {
//               responseType: "arraybuffer",
//             });
//             doc.image(Buffer.from(imageBuffer.data), x + 20, y + 40, {
//               width: cellWidth - 40,
//               height: 170,
//               align: "center",
//             });
//           } catch {
//             doc.text("[Image Not Available]", x + 5, y + 90);
//           }
//         }

//         x += cellWidth + margin;

//         if ((i + 1) % 3 === 0) {
//           x = doc.page.margins.left;
//           y += cellHeight + margin;
//         }
//       }

//       doc
//         .moveTo(x, y + 700)
//         .fontSize(10)
//         .fillColor("black")
//         .text(`Page ${currentPage} of ${totalPages}`, { align: "center" });
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

    const doc = new PDFDocument({ margin: 21.4, size: [595.45, 841.68] });
    const filename = `catalog-${categoryId}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    doc.pipe(res);

    const cellWidth = 180;
    const cellHeight = 220;
    const margin = 5;

    const calcTotalPage = async () => {
      let totalPages = 0;

      for (const subcat of subcategories) {
        const productCountResult = await pool`
          SELECT COUNT(*) AS product_count 
          FROM products 
          WHERE subcategory_id = ${subcat.id}`;

        const productCount = productCountResult[0].product_count;
        const pagesForSubcategory = Math.ceil(productCount / 9); // 9 products per page
        totalPages += pagesForSubcategory;
      }

      return totalPages;
    };

    const totalPages = await calcTotalPage();
    let currentPage = 1;

    const renderFooter = () => {
      const footerY = doc.page.height - doc.page.margins.bottom - 20;
      doc
        .fontSize(10)
        .fillColor("gray")
        .text(`Page ${currentPage} of ${totalPages}`, {
          align: "center",
          baseline: "bottom",
          width:
            doc.page.width - doc.page.margins.left - doc.page.margins.right,
          y: footerY,
        });
    };

    const renderHeader = () => {
      doc.font("./fonts/Bold.ttf");
      doc
        .fillColor("#0c4edd")
        .fontSize(24)
        .text("SHIV ENTERPRISES", { align: "center" });

      const textWidth = doc.widthOfString("SHIV ENTERPRISES");
      const textHeight = doc.currentLineHeight();
      const x = doc.page.margins.left + 140;
      const y = doc.page.margins.top - 5;
      doc
        .strokeColor("#0c4edd")
        .lineWidth(2)
        .moveTo(x, y + textHeight + 2)
        .lineTo(x + textWidth, y + textHeight + 2)
        .stroke();

      doc
        .fillColor("#2cd40a")
        .fontSize(18)
        .text("7838146412, 9958660231, 9717437131", { align: "center" });
      doc
        .fontSize(10)
        .fillColor("red")
        .text("(Trademark:-Vidhata)", { align: "center" });
    };

    const renderProducts = async (products, subcategoryName) => {
      doc.addPage();
      renderHeader();
      doc
        .fontSize(15)
        .fillColor("black")
        .text(`Subcategory: ${subcategoryName}`, { align: "center" });

      let x = doc.page.margins.left;
      let y = doc.page.margins.top + 100;

      for (let i = 0; i < products.length; i++) {
        const product = products[i];

        if (y + cellHeight > doc.page.height - doc.page.margins.bottom) {
          currentPage++;
          doc.addPage();
          renderHeader();
          x = doc.page.margins.left;
          y = doc.page.margins.top + 100;
        }

        doc.rect(x, y, cellWidth, cellHeight).stroke();
        doc
          .fontSize(12)
          .fillColor("black")
          .text(product.name, x + 5, y + 5, {
            width: cellWidth - 10,
            align: "center",
          });

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
        doc.text(`Subcategory: ${subcat.name}`, { align: "center" });
        doc.text("No products available for this subcategory.", {
          align: "center",
        });
      } else {
        await renderProducts(products, subcat.name);
      }
    }

    // Listen for page addition and render footer
    doc.on("pageAdded", () => {
      renderFooter();
      currentPage++;
    });

    // Add footer for the last page
    renderFooter();

    doc.end();
  } catch (error) {
    console.error("Error generating catalog:", error);
    if (!res.headersSent)
      res.status(500).json({ error: "Error generating catalog" });
  }
});

module.exports = router;
