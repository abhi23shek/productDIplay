// import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
// import fontkit from "@pdf-lib/fontkit";

// export const generatePDF = async (
//   pages,
//   companyName,
//   dateApplicable,
//   phoneNumbers,
//   hintText,
//   priceAdjustment,
//   priceFlag
// ) => {
//   const pdfDoc = await PDFDocument.create();
//   pdfDoc.registerFontkit(fontkit);

//   // const fontNB = await pdfDoc.embedFont(StandardFonts.TimesRoman);
//   const fontB = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//   const pageWidth = 595;

//   // Function to dynamically adjust font size to fit within max width
//   const getDynamicFontSize = (text, maxWidth, baseSize = 16) => {
//     let fontSize = baseSize;
//     while (fontB.widthOfTextAtSize(text, fontSize) > maxWidth && fontSize > 6) {
//       fontSize -= 0.5;
//     }
//     return fontSize;
//   };

//   function cleanText(text) {
//     return text
//       .replace(/[\r\n]+/g, " ") // Remove newlines
//       .replace(/[^\x20-\x7E]/g, ""); // Remove non-ANSI characters
//   }

//   let subcatname;
//   let subpagenumber;

//   for (const page of pages) {
//     if (pages.indexOf(page) === 0) {
//       subcatname = page.subcategoryName;
//       subpagenumber = 1;
//     } else {
//       if (subcatname === page.subcategoryName) {
//         subpagenumber += 1;
//       } else {
//         subcatname = page.subcategoryName;
//         subpagenumber = 1;
//       }
//     }

//     const pdfPage = pdfDoc.addPage([595, 842]);

//     pdfPage.drawText(`Rates List applicable from ${dateApplicable}`, {
//       x:
//         (pageWidth -
//           fontB.widthOfTextAtSize(
//             `Rates List applicable from ${dateApplicable}`,
//             10
//           )) /
//         2,
//       y: 822,
//       size: 10,
//       font: fontB,
//       color: rgb(1, 0, 0),
//     });

//     // pdfPage.drawText(companyName, {
//     //   x: (pageWidth - fontB.widthOfTextAtSize(companyName, 30)) / 2,
//     //   y: 795,
//     //   size: 30,
//     //   font: fontB,
//     //   color: rgb(0.05, 0.31, 0.87),
//     // });

//     // Draw company name
//     const companyNameFontSize = 30;
//     const companyNameWidth = fontB.widthOfTextAtSize(
//       companyName,
//       companyNameFontSize
//     );
//     const companyNameX = (pageWidth - companyNameWidth) / 2;
//     const companyNameY = 795;

//     pdfPage.drawText(companyName, {
//       x: companyNameX,
//       y: companyNameY,
//       size: companyNameFontSize,
//       font: fontB,
//       color: rgb(0.05, 0.31, 0.87),
//     });

//     // Draw underline below company name
//     pdfPage.drawLine({
//       start: { x: companyNameX, y: companyNameY - 3 }, // Start from left edge of text
//       end: { x: companyNameX + companyNameWidth, y: companyNameY - 3 }, // End at right edge of text
//       thickness: 2, // Thickness of underline
//       color: rgb(0.05, 0.31, 0.87), // Match text color
//     });

//     pdfPage.drawText(phoneNumbers, {
//       x: (pageWidth - fontB.widthOfTextAtSize(phoneNumbers, 25)) / 2,
//       y: 769,
//       size: 25,
//       font: fontB,
//       color: rgb(0.17, 0.83, 0.04),
//     });

//     pdfPage.drawText(`(${hintText})`, {
//       x: (pageWidth - fontB.widthOfTextAtSize(hintText, 12)) / 2,
//       y: 755,
//       size: 12,
//       font: fontB,
//       color: rgb(1, 0, 0),
//     });

//     pdfPage.drawText(page.subcategoryName, {
//       x: (pageWidth - fontB.widthOfTextAtSize(page.subcategoryName, 18)) / 2,
//       y: 739,
//       size: 18,
//       font: fontB,
//       color: rgb(0, 0, 0),
//     });

//     pdfPage.drawText(subpagenumber.toString(), {
//       x:
//         (pageWidth - fontB.widthOfTextAtSize(subpagenumber.toString(), 12)) / 2,
//       y: 725,
//       size: 12,
//       font: fontB,
//       color: rgb(0, 0, 0),
//     });

//     const gridSize = 3;
//     const cellWidth = 575 / gridSize;
//     const cellHeight = 680 / gridSize;
//     const startX = 13;
//     const startY = 725;

//     for (const [productIndex, product] of page.productsOnPage.entries()) {
//       const col = productIndex % gridSize;
//       const row = Math.floor(productIndex / gridSize);
//       const xPosition = startX + col * cellWidth;
//       const yPosition = startY - row * cellHeight;

//       pdfPage.drawRectangle({
//         x: xPosition,
//         y: yPosition - cellHeight,
//         width: cellWidth - 5,
//         height: cellHeight - 5,
//         borderWidth: 1.5,
//         borderColor: rgb(0.05, 0.31, 0.87),
//       });

//       // const productNameFontSize = getDynamicFontSize(
//       //   product.name,
//       //   cellWidth - 10
//       // );
//       // pdfPage.drawText(product.name, {
//       //   x: xPosition + 5,
//       //   y: yPosition - 20,
//       //   size: productNameFontSize,
//       //   font: fontB,
//       //   color: rgb(0, 0, 0),
//       // });

//       // console.log(product.name);
//       // console.log(product.id);

//       // console.log(product.name + " Going to print");

//       const productNameFontSize = getDynamicFontSize(
//         product.name,
//         cellWidth - 15
//       );
//       const productNameWidth = fontB.widthOfTextAtSize(
//         product.name,
//         productNameFontSize
//       );
//       // console.log(product.name + " Printed");

//       // Calculate x-position to center the text
//       const productNameX = xPosition + (cellWidth - productNameWidth) / 2;

//       pdfPage.drawText(product.name, {
//         x: productNameX,
//         y: yPosition - 20,
//         size: productNameFontSize,
//         font: fontB,
//         color: rgb(0, 0, 0),
//       });

//       pdfPage.drawLine({
//         start: { x: xPosition, y: yPosition - 25 }, // Start from left edge
//         end: { x: xPosition + cellWidth - 5, y: yPosition - 25 }, // End at right edge
//         thickness: 1,
//         color: rgb(1, 0, 0),
//       });

//       const totalWidth = cellWidth - 10; // Available space in the cell
//       const priceWidth = totalWidth / 3 + 5; // 1:2 ratio (1 part for price)
//       const detailsWidth = (totalWidth * 2) / 3 - 5; // 2 parts for details

//       // console.log(product.name + " Going to print price");
//       // Calculate x-position for price (left-aligned)

//       // Calculate x-position for details (centered in its allocated space)

//       if (priceFlag) {
//         const priceX = xPosition + 5;
//         var originalPrice = parseFloat(product.price);

//         var revisedPrice = originalPrice;

//         if (priceAdjustment !== 0) {
//           revisedPrice =
//             originalPrice + (originalPrice * priceAdjustment) / 100;

//           // Round off to the nearest integer
//           revisedPrice = Math.round(revisedPrice);
//         }

//         if (revisedPrice % 1 !== 0) {
//           // revisedPrice = revisedPrice + 0.01;
//           // revisedPrice = revisedPrice - 0.01;
//           revisedPrice = revisedPrice.toFixed(2);
//         }
//         // Draw the adjusted price (left-aligned in its section)
//         pdfPage.drawText(`Rs. ${revisedPrice}`, {
//           x: priceX,
//           y: yPosition - 40,
//           size: 16,
//           font: fontB,
//           color: rgb(0.17, 0.83, 0.04), // Green color for emphasis
//         });
//       }
//       // console.log(product.name + " printed price");
//       // Draw the details (centered in its section)
//       // console.log(product.name + " Going to print detail");
//       const safeProductDetails = cleanText(product.details);
//       // Calculate dynamic font size for details
//       const detailsFontSize = getDynamicFontSize(
//         safeProductDetails,
//         detailsWidth,
//         14
//       );
//       const detailsX =
//         xPosition +
//         priceWidth +
//         (detailsWidth -
//           fontB.widthOfTextAtSize(safeProductDetails, detailsFontSize)) /
//           2;

//       // console.log(safeProductDetails);
//       pdfPage.drawText(safeProductDetails, {
//         x: detailsX,
//         y: yPosition - 40,
//         size: detailsFontSize,
//         font: fontB,
//         color: rgb(0.17, 0.83, 0.04),
//       });
//       // console.log(product.name + " printed detail");

//       // Draw a vertical line between price and details
//       pdfPage.drawLine({
//         start: { x: xPosition + priceWidth, y: yPosition - 44 },
//         end: { x: xPosition + priceWidth, y: yPosition - 24 },
//         thickness: 1,
//         color: rgb(1, 0, 0),
//       });

//       pdfPage.drawLine({
//         start: { x: xPosition, y: yPosition - 44 }, // Start from left edge
//         end: { x: xPosition + cellWidth - 5, y: yPosition - 44 }, // End at right edge
//         thickness: 1,
//         color: rgb(1, 0, 0),
//       });

//       const response = await fetch(product.image_url);
//       const contentType = response.headers.get("content-type");
//       let imageBytes;

//       if (
//         contentType &&
//         (contentType.includes("png") ||
//           contentType.includes("jpeg") ||
//           contentType.includes("jpg"))
//       ) {
//         imageBytes = await response.arrayBuffer();
//       } else {
//         console.warn(
//           "Unsupported image format:",
//           contentType,
//           "Using default image."
//         );

//         // Fetch default image if the format is unsupported
//         const defaultResponse = await fetch(
//           "https://i.ibb.co/YBtzwHqm/images-1.png"
//         );
//         imageBytes = await defaultResponse.arrayBuffer();
//       }

//       // Determine the correct embedding function
//       let image;
//       if (contentType?.includes("png")) {
//         image = await pdfDoc.embedPng(imageBytes);
//       } else {
//         image = await pdfDoc.embedJpg(imageBytes); // Default to JPG embedding
//       }

//       // Draw image on the PDF
//       pdfPage.drawImage(image, {
//         x: xPosition + 5,
//         y: yPosition - cellHeight + 5,
//         width: cellWidth - 15,
//         height: cellHeight - 50,
//       });
//     }

//     pdfPage.drawText(`Page ${pages.indexOf(page) + 1} of ${pages.length}`, {
//       x: 270,
//       y: 20,
//       size: 10,
//       font: fontB,
//       color: rgb(0.502, 0.502, 0.502),
//     });
//   }

//   return await pdfDoc.save();
// };

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

export const generatePDF = async (
  pages,
  companyName,
  dateApplicable,
  phoneNumbers,
  hintText,
  priceAdjustment,
  priceFlag
) => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const fontB = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595;

  // Function to dynamically adjust font size to fit within max width
  const getDynamicFontSize = (text, maxWidth, baseSize = 16) => {
    let fontSize = baseSize;
    while (fontB.widthOfTextAtSize(text, fontSize) > maxWidth && fontSize > 6) {
      fontSize -= 0.5;
    }
    return fontSize;
  };

  function cleanText(text) {
    return text
      .replace(/[\r\n]+/g, " ") // Remove newlines
      .replace(/[^\x20-\x7E]/g, ""); // Remove non-ANSI characters
  }

  let subcatname;
  let subpagenumber;

  for (const page of pages) {
    if (pages.indexOf(page) === 0) {
      subcatname = page.subcategoryName;
      subpagenumber = 1;
    } else {
      if (subcatname === page.subcategoryName) {
        subpagenumber += 1;
      } else {
        subcatname = page.subcategoryName;
        subpagenumber = 1;
      }
    }

    const pdfPage = pdfDoc.addPage([595, 842]);

    pdfPage.drawText(`Rates List applicable from ${dateApplicable}`, {
      x:
        (pageWidth -
          fontB.widthOfTextAtSize(
            `Rates List applicable from ${dateApplicable}`,
            10
          )) /
        2,
      y: 822,
      size: 10,
      font: fontB,
      color: rgb(1, 0, 0),
    });

    // Draw company name
    const companyNameFontSize = 30;
    const companyNameWidth = fontB.widthOfTextAtSize(
      companyName,
      companyNameFontSize
    );
    const companyNameX = (pageWidth - companyNameWidth) / 2;
    const companyNameY = 795;

    pdfPage.drawText(companyName, {
      x: companyNameX,
      y: companyNameY,
      size: companyNameFontSize,
      font: fontB,
      color: rgb(0.05, 0.31, 0.87),
    });

    // Draw underline below company name
    pdfPage.drawLine({
      start: { x: companyNameX, y: companyNameY - 3 },
      end: { x: companyNameX + companyNameWidth, y: companyNameY - 3 },
      thickness: 2,
      color: rgb(0.05, 0.31, 0.87),
    });

    pdfPage.drawText(phoneNumbers, {
      x: (pageWidth - fontB.widthOfTextAtSize(phoneNumbers, 25)) / 2,
      y: 769,
      size: 25,
      font: fontB,
      color: rgb(0.17, 0.83, 0.04),
    });

    pdfPage.drawText(`(${hintText})`, {
      x: (pageWidth - fontB.widthOfTextAtSize(hintText, 12)) / 2,
      y: 755,
      size: 12,
      font: fontB,
      color: rgb(1, 0, 0),
    });

    pdfPage.drawText(page.subcategoryName, {
      x: (pageWidth - fontB.widthOfTextAtSize(page.subcategoryName, 18)) / 2,
      y: 739,
      size: 18,
      font: fontB,
      color: rgb(0, 0, 0),
    });

    pdfPage.drawText(subpagenumber.toString(), {
      x:
        (pageWidth - fontB.widthOfTextAtSize(subpagenumber.toString(), 12)) / 2,
      y: 725,
      size: 12,
      font: fontB,
      color: rgb(0, 0, 0),
    });

    const gridSize = 3;
    const cellWidth = 575 / gridSize;
    const cellHeight = 680 / gridSize;
    const startX = 13;
    const startY = 725;

    for (const [productIndex, product] of page.productsOnPage.entries()) {
      const col = productIndex % gridSize;
      const row = Math.floor(productIndex / gridSize);
      const xPosition = startX + col * cellWidth;
      const yPosition = startY - row * cellHeight;

      pdfPage.drawRectangle({
        x: xPosition,
        y: yPosition - cellHeight,
        width: cellWidth - 5,
        height: cellHeight - 5,
        borderWidth: 1.5,
        borderColor: rgb(0.05, 0.31, 0.87),
      });

      const productNameFontSize = getDynamicFontSize(
        product.name,
        cellWidth - 15
      );
      const productNameWidth = fontB.widthOfTextAtSize(
        product.name,
        productNameFontSize
      );
      const productNameX = xPosition + (cellWidth - productNameWidth) / 2;

      pdfPage.drawText(product.name, {
        x: productNameX,
        y: yPosition - 20,
        size: productNameFontSize,
        font: fontB,
        color: rgb(0, 0, 0),
      });

      pdfPage.drawLine({
        start: { x: xPosition, y: yPosition - 25 },
        end: { x: xPosition + cellWidth - 5, y: yPosition - 25 },
        thickness: 1,
        color: rgb(1, 0, 0),
      });

      const totalWidth = cellWidth - 10;
      const priceWidth = totalWidth / 3 + 5;
      const detailsWidth = (totalWidth * 2) / 3 - 5;

      if (priceFlag) {
        const priceX = xPosition + 5;
        var originalPrice = parseFloat(product.price);
        var revisedPrice = originalPrice;

        if (priceAdjustment !== 0) {
          revisedPrice =
            originalPrice + (originalPrice * priceAdjustment) / 100;
          revisedPrice = Math.round(revisedPrice);
        }

        if (revisedPrice % 1 !== 0) {
          revisedPrice = revisedPrice.toFixed(2);
        }
        pdfPage.drawText(`Rs. ${revisedPrice}`, {
          x: priceX,
          y: yPosition - 40,
          size: 16,
          font: fontB,
          color: rgb(0.17, 0.83, 0.04),
        });
      }

      const safeProductDetails = cleanText(product.details);
      const detailsFontSize = getDynamicFontSize(
        safeProductDetails,
        detailsWidth,
        14
      );
      const detailsX =
        xPosition +
        priceWidth +
        (detailsWidth -
          fontB.widthOfTextAtSize(safeProductDetails, detailsFontSize)) /
          2;

      pdfPage.drawText(safeProductDetails, {
        x: detailsX,
        y: yPosition - 40,
        size: detailsFontSize,
        font: fontB,
        color: rgb(0.17, 0.83, 0.04),
      });

      pdfPage.drawLine({
        start: { x: xPosition + priceWidth, y: yPosition - 44 },
        end: { x: xPosition + priceWidth, y: yPosition - 24 },
        thickness: 1,
        color: rgb(1, 0, 0),
      });

      pdfPage.drawLine({
        start: { x: xPosition, y: yPosition - 44 },
        end: { x: xPosition + cellWidth - 5, y: yPosition - 44 },
        thickness: 1,
        color: rgb(1, 0, 0),
      });

      const response = await fetch(product.image_url);
      const contentType = response.headers.get("content-type");
      let imageBytes;

      if (
        contentType &&
        (contentType.includes("png") ||
          contentType.includes("jpeg") ||
          contentType.includes("jpg"))
      ) {
        imageBytes = await response.arrayBuffer();
      } else {
        console.warn(
          "Unsupported image format:",
          contentType,
          "Using default image."
        );
        const defaultResponse = await fetch(
          "https://i.ibb.co/YBtzwHqm/images-1.png"
        );
        imageBytes = await defaultResponse.arrayBuffer();
      }

      let image;
      if (contentType?.includes("png")) {
        image = await pdfDoc.embedPng(imageBytes);
      } else {
        image = await pdfDoc.embedJpg(imageBytes);
      }

      // Draw image on the PDF
      const imageX = xPosition + 5;
      const imageY = yPosition - cellHeight + 5;
      const imageWidth = cellWidth - 15;
      const imageHeight = cellHeight - 50;

      pdfPage.drawImage(image, {
        x: imageX,
        y: imageY,
        width: imageWidth,
        height: imageHeight,
      });

      // Add circle with number on top right of the image
      const circleRadius = 15; // Size of the circle
      const circleX = imageX + imageWidth - circleRadius; // Position on top right with some padding
      const circleY = imageY + imageHeight - circleRadius - 2;

      // Draw the circle
      pdfPage.drawCircle({
        x: circleX,
        y: circleY,
        size: circleRadius,
        color: rgb(1, 0, 0), // Red circle
        borderWidth: 1,
        borderColor: rgb(0, 0, 0),
      });

      // Add the number inside the circle (using productIndex + 1)
      const numberText = (productIndex + 1).toString().padStart(2, "0"); // Ensure 2-digit format
      const numberWidth = fontB.widthOfTextAtSize(numberText, 18);
      const numberHeight = 15; // Font size

      pdfPage.drawText(product.master_pack.toString(), {
        x: circleX - numberWidth / 2,
        y: circleY - numberHeight / 3, // Adjust vertical position
        size: 20,
        font: fontB,
        color: rgb(1, 1, 1), // White text
      });
    }

    pdfPage.drawText(`Page ${pages.indexOf(page) + 1} of ${pages.length}`, {
      x: 270,
      y: 20,
      size: 10,
      font: fontB,
      color: rgb(0.502, 0.502, 0.502),
    });
  }

  return await pdfDoc.save();
};
