// import React, { useRef, useState, useEffect } from "react";
// import { useReactToPrint } from "react-to-print";
// import { useLocation } from "react-router-dom";
// import Page from "./Page";
// import "./HandlePrint.css";

// const HandlePrint = () => {
//   const location = useLocation();
//   const {
//     dateApplicable,
//     priceFlag,
//     priceAdjustment,
//     companyName,
//     phoneNumbers,
//     hintText,
//     categoryId,
//     minPrice,
//     maxPrice,
//   } = location.state;

//   const printRef = useRef();
//   const [subcategories, setSubcategories] = useState([]);
//   const [pages, setPages] = useState([]); // Stores all pages to be rendered
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch subcategories for the given categoryId
//   useEffect(() => {
//     const fetchSubcategories = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.REACT_APP_SERVER_URL}/api/subcategories/${categoryId}`
//         );
//         if (!response.ok) throw new Error("Failed to fetch subcategories");

//         const data = await response.json();
//         setSubcategories(data);
//       } catch (error) {
//         console.error("Error fetching subcategories:", error);
//       }
//     };

//     if (categoryId) fetchSubcategories();
//   }, [categoryId]);

//   // Fetch products for each subcategory and create pages
//   useEffect(() => {
//     const fetchProductsAndCreatePages = async () => {
//       if (!subcategories.length) return;

//       const allPages = [];

//       for (const subcat of subcategories) {
//         try {
//           // Fetch products for the subcategory
//           const response = await fetch(
//             `${process.env.REACT_APP_SERVER_URL}/api/products/productfilter?subCategoryId=${subcat.id}&minPrice=${minPrice}&maxPrice=${maxPrice}`
//           );
//           if (!response.ok) throw new Error("Failed to fetch products");

//           const products = await response.json();

//           // Split products into chunks of 9 per page
//           const chunkSize = 9;
//           for (let i = 0; i < products.length; i += chunkSize) {
//             const chunk = products.slice(i, i + chunkSize);
//             allPages.push({
//               subcategoryName: subcat.name,
//               subPageNumber: Math.floor(i / chunkSize) + 1,
//               productsOnPage: chunk,
//             });
//           }
//         } catch (error) {
//           console.error("Error fetching products:", error);
//         }
//       }

//       setPages(allPages);
//       setIsLoading(false);
//     };

//     fetchProductsAndCreatePages();
//   }, [subcategories, minPrice, maxPrice]);

//   // Handle print functionality
//   const handlePrint = useReactToPrint({
//     contentRef: printRef,
//     documentTitle: "Product Catalog",
//     // onAfterPrint: () => console.log("Printing finished"),
//   });

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div style={{ textAlign: "center" }}>
//       <button className="printButton" onClick={handlePrint}>
//         Print
//       </button>
//       <div className="parent-container" ref={printRef}>
//         {pages.map((page, index) => (
//           <Page
//             key={index}
//             dateApplicable={dateApplicable}
//             companyName={companyName}
//             phoneNumbers={phoneNumbers}
//             hintText={hintText}
//             subcategoryName={page.subcategoryName}
//             subPageNumber={page.subPageNumber}
//             productsOnPage={page.productsOnPage}
//             pageNumber={index + 1}
//             totalPage={pages.length}
//             priceFlag={priceFlag}
//             priceAdjustment={priceAdjustment}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HandlePrint;

import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { generatePDF } from "./GeneratePDF"; // Import the PDF generation function
import "./HandlePrint.css";
import Page from "./Page";
// import "./HandlePrint.css";

const HandlePrint = () => {
  const location = useLocation();
  const {
    dateApplicable,
    priceFlag,
    priceAdjustment,
    companyName,
    phoneNumbers,
    hintText,
    categoryId,
    minPrice,
    maxPrice,
  } = location.state;

  const [subcategories, setSubcategories] = useState([]);
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/subcategories/${categoryId}`
        );
        if (!response.ok) throw new Error("Failed to fetch subcategories");

        const data = await response.json();
        setSubcategories(data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    if (categoryId) fetchSubcategories();
  }, [categoryId]);

  useEffect(() => {
    const fetchProductsAndCreatePages = async () => {
      if (!subcategories.length) return;

      const allPages = [];

      for (const subcat of subcategories) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/products/productfilter?subCategoryId=${subcat.id}&minPrice=${minPrice}&maxPrice=${maxPrice}`
          );
          if (!response.ok) throw new Error("Failed to fetch products");

          const products = await response.json();

          const chunkSize = 9;
          for (let i = 0; i < products.length; i += chunkSize) {
            const chunk = products.slice(i, i + chunkSize);
            // console.log(chunk);
            allPages.push({
              subcategoryName: subcat.name,
              subPageNumber: Math.floor(i / chunkSize) + 1,
              productsOnPage: chunk,
            });
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }

      setPages(allPages);
      setIsLoading(false);
    };

    fetchProductsAndCreatePages();
  }, [subcategories, minPrice, maxPrice]);

  const handleDownloadPDF = async () => {
    const pdfBytes = await generatePDF(
      pages,
      companyName,
      dateApplicable,
      phoneNumbers,
      hintText,
      priceAdjustment,
      priceFlag
    );
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ProductCatalog.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <button className="printButton" onClick={handleDownloadPDF}>
        Download PDF
      </button>
      <div className="parent-container">
        {pages.map((page, index) => (
          <Page
            key={index}
            dateApplicable={dateApplicable}
            companyName={companyName}
            phoneNumbers={phoneNumbers}
            hintText={hintText}
            subcategoryName={page.subcategoryName}
            subPageNumber={page.subPageNumber}
            productsOnPage={page.productsOnPage}
            pageNumber={index + 1}
            totalPage={pages.length}
            priceFlag={priceFlag}
            priceAdjustment={priceAdjustment}
          />
        ))}
      </div>
    </div>
  );
};

export default HandlePrint;
