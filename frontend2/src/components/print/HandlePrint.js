import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import Page from "./Page";
import "./HandlePrint.css";

const HandlePrint = ({
  dateApplicable,
  priceFlag,
  priceAdjustment,
  companyName,
  phoneNumbers,
  hintText,
  categoryId,
  minPrice,
  maxPrice,
}) => {
  const printRef = useRef();
  const [subcategories, setSubcategories] = useState([]);
  const [pages, setPages] = useState([]); // Stores all pages to be rendered
  const [isLoading, setIsLoading] = useState(true);

  // Fetch subcategories for the given categoryId
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

  // Fetch products for each subcategory and create pages
  useEffect(() => {
    const fetchProductsAndCreatePages = async () => {
      if (!subcategories.length) return;

      const allPages = [];

      for (const subcat of subcategories) {
        try {
          // Fetch products for the subcategory
          const response = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/products/productfilter?subCategoryId=${subcat.id}&minPrice=${minPrice}&maxPrice=${maxPrice}`
          );
          if (!response.ok) throw new Error("Failed to fetch products");

          const products = await response.json();

          // Split products into chunks of 9 per page
          const chunkSize = 9;
          for (let i = 0; i < products.length; i += chunkSize) {
            const chunk = products.slice(i, i + chunkSize);
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

  // Handle print functionality
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Product Catalog",
    onAfterPrint: () => console.log("Printing finished"),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <button className="printButton" onClick={handlePrint}>
        Print
      </button>
      <div className="parent-container" ref={printRef}>
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
