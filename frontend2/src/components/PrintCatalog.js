// import React, { useEffect, useState } from "react";
// import { PDFDocument } from "pdf-lib";
// import axios from "axios";
// import PrintCatNav from "./PrintCatNav";

// const PrintCatalog = () => {
//   const [categoryName, setCategoryName] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [companyName, setCompanyName] = useState("SHIV ENTERPRISES");
//   const [mobileNumber, setMobileNumber] = useState(
//     "9958660231, 7838146412, 9717437131"
//   );
//   const [dateApplicaple, setDateApplicaple] = useState("1st April 2024");
//   const [priceFlag, setPriceFlag] = useState(true); // Whether to show prices
//   const [priceAdjustment, setPriceAdjustment] = useState(0); // Percentage adjustment
//   const [minPrice, setMinPrice] = useState(0); // Minimum price
//   const [maxPrice, setMaxPrice] = useState(1000); // Maximum price
//   const [hintText, setHintText] = useState("Trademark:-Vidhata");
//   const [isLoading, setIsLoading] = useState(false); // Loading state
//   const [successMessage, setSuccessMessage] = useState(""); // Success message

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_SERVER_URL}/api/categories`
//       );
//       setCategories(response.data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const handlePrint = () => {
//     if (!categoryName) {
//       alert("Please select a category.");
//       return;
//     }
//     const selectedCategory = categories.find(
//       (cat) => String(cat.id) === String(categoryName)
//     );

//     setIsLoading(true);
//     setSuccessMessage(""); // Clear previous success message

//     axios
//       .post(
//         `${process.env.REACT_APP_SERVER_URL}/api/print-catalog`,
//         {
//           categoryId: categoryName,
//           companyName,
//           mobileNumber,
//           dateApplicaple,
//           priceFlag,
//           priceAdjustment, // Send price adjustment value to backend
//           minPrice, // Include min price
//           maxPrice, // Include max price
//           hintText,
//         },
//         { responseType: "blob" }
//       )
//       .then(async (res) => {
//         try {
//           const arrayBuffer = await res.data.arrayBuffer();

//           const pdfDoc = await PDFDocument.load(arrayBuffer);

//           pdfDoc.removePage(0);

//           const modifiedPdfBytes = await pdfDoc.save();

//           const url = URL.createObjectURL(
//             new Blob([modifiedPdfBytes], { type: "application/pdf" })
//           );

//           const link = document.createElement("a");
//           link.href = url;
//           const fileName = `${selectedCategory.name}-catalog.pdf`;

//           link.setAttribute("download", fileName);
//           document.body.appendChild(link);
//           link.click();
//           document.body.removeChild(link);

//           setSuccessMessage("Catalog downloaded successfully!");
//         } catch (error) {
//           console.error("Error processing PDF:", error);
//           alert("Failed to modify the catalog PDF.");
//         }
//       })
//       .catch((err) => {
//         console.error("Error generating catalog:", err);
//         alert("Failed to generate catalog.");
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   return (
//     <div className="Admin-parent">
//       <div className="">
//         <PrintCatNav />
//       </div>
//       <div className="container my-4">
//         <div className="card shadow-sm">
//           <div className="card-body">
//             <h2 className="card-title text-center mb-4">Print Catalog</h2>
//             {isLoading && (
//               <div className="loading-overlay">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p>Generating and downloading catalog...</p>
//               </div>
//             )}
//             <form>
//               <div className="row mb-4">
//                 <div className="col-md-6">
//                   <label htmlFor="categoryName" className="form-label">
//                     Select Category:
//                   </label>
//                   <select
//                     id="categoryName"
//                     className="form-select"
//                     onChange={(e) => setCategoryName(e.target.value)}
//                     disabled={isLoading}
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map((cat) => (
//                       <option key={cat.id} value={cat.id}>
//                         {cat.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <div className="row mb-4">
//                 <div className="col-md-6">
//                   <label htmlFor="companyName" className="form-label">
//                     Company Name:
//                   </label>
//                   <input
//                     type="text"
//                     id="companyName"
//                     className="form-control"
//                     value={companyName}
//                     onChange={(e) => setCompanyName(e.target.value)}
//                     required
//                     disabled={isLoading}
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <label htmlFor="mobileNumber" className="form-label">
//                     Mobile Number:
//                   </label>
//                   <input
//                     type="text"
//                     id="mobileNumber"
//                     className="form-control"
//                     value={mobileNumber}
//                     onChange={(e) => setMobileNumber(e.target.value)}
//                     required
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <div className="row mb-4">
//                 <div className="col-md-6">
//                   <label htmlFor="dateApplicable" className="form-label">
//                     Date Applicable:
//                   </label>
//                   <input
//                     type="text"
//                     id="dateApplicable"
//                     className="form-control"
//                     value={dateApplicaple}
//                     onChange={(e) => setDateApplicaple(e.target.value)}
//                     disabled={isLoading}
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <label htmlFor="hintText" className="form-label">
//                     Hint Text:
//                   </label>
//                   <input
//                     type="text"
//                     id="hintText"
//                     className="form-control"
//                     value={hintText}
//                     onChange={(e) => setHintText(e.target.value)}
//                     placeholder="Enter hint text"
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <div className="row mb-4">
//                 <div className="col-md-6">
//                   <div className="form-check">
//                     <input
//                       type="checkbox"
//                       className="form-check-input"
//                       id="priceFlag"
//                       checked={priceFlag}
//                       onChange={(e) => setPriceFlag(e.target.checked)}
//                       disabled={isLoading}
//                     />
//                     <label className="form-check-label" htmlFor="priceFlag">
//                       Show Prices
//                     </label>
//                   </div>
//                 </div>

//                 <div className="col-md-6">
//                   <label htmlFor="priceAdjustment" className="form-label">
//                     Price Adjustment (%):
//                   </label>
//                   <input
//                     type="number"
//                     id="priceAdjustment"
//                     className="form-control"
//                     value={priceAdjustment}
//                     onChange={(e) => setPriceAdjustment(e.target.value)}
//                     placeholder="Enter percentage (e.g., 10 or -10)"
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <div className="row mb-4">
//                 <div className="col-md-6">
//                   <label htmlFor="minPrice" className="form-label">
//                     Minimum Price:
//                   </label>
//                   <input
//                     type="number"
//                     id="minPrice"
//                     className="form-control"
//                     value={minPrice}
//                     onChange={(e) => setMinPrice(e.target.value)}
//                     placeholder="Enter minimum price"
//                     disabled={isLoading}
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <label htmlFor="maxPrice" className="form-label">
//                     Maximum Price:
//                   </label>
//                   <input
//                     type="number"
//                     id="maxPrice"
//                     className="form-control"
//                     value={maxPrice}
//                     onChange={(e) => setMaxPrice(e.target.value)}
//                     placeholder="Enter maximum price"
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <div className="text-center">
//                 <button
//                   type="button"
//                   className="btn btn-primary"
//                   onClick={handlePrint}
//                   disabled={isLoading}
//                 >
//                   Print Catalog
//                 </button>
//               </div>
//             </form>
//             {successMessage && (
//               <div className="alert alert-success mt-4" role="alert">
//                 {successMessage}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PrintCatalog;

import React, { useEffect, useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import axios from "axios";
import PrintCatNav from "./PrintCatNav";

const PrintCatalog = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [companyName, setCompanyName] = useState("SHIV ENTERPRISES");
  const [mobileNumber, setMobileNumber] = useState(
    "9958660231, 7838146412, 9717437131"
  );
  const [dateApplicaple, setDateApplicaple] = useState("1st April 2024");
  const [priceFlag, setPriceFlag] = useState(true); // Whether to show prices
  const [priceAdjustment, setPriceAdjustment] = useState(0); // Percentage adjustment
  const [minPrice, setMinPrice] = useState(0); // Minimum price
  const [maxPrice, setMaxPrice] = useState(1000); // Maximum price
  const [hintText, setHintText] = useState("Trademark:-Vidhata");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [successMessage, setSuccessMessage] = useState(""); // Success message

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/categories`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handlePrint = async () => {
    if (!categoryName) {
      alert("Please select a category.");
      return;
    }

    setIsLoading(true);
    setSuccessMessage(""); // Clear previous success message

    try {
      // Fetch subcategories and products for the selected category
      const subcategoriesResponse = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/subcategories?categoryId=${categoryName}`
      );
      const subcategories = subcategoriesResponse.data;

      if (subcategories.length === 0) {
        alert("No subcategories found for the selected category.");
        return;
      }

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.45, 841.68]); // A4 size

      // Render header
      const { height } = page.getSize();
      page.drawText(`Rates List applicable from ${dateApplicaple}`, {
        x: 50,
        y: height - 50,
        size: 10,
        color: rgb(1, 0, 0),
      });
      page.drawText(companyName, {
        x: 50,
        y: height - 80,
        size: 26,
        color: rgb(0, 0.3, 0.9),
        underline: true,
      });
      page.drawText(mobileNumber, {
        x: 50,
        y: height - 120,
        size: 18,
        color: rgb(0.2, 0.8, 0.1),
      });
      page.drawText(`(${hintText})`, {
        x: 50,
        y: height - 140,
        size: 10,
        color: rgb(1, 0, 0),
      });

      // Render products for each subcategory
      let y = height - 200; // Starting Y position for products
      for (const subcat of subcategories) {
        const productsResponse = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/products?subcategoryId=${subcat.id}&minPrice=${minPrice}&maxPrice=${maxPrice}`
        );
        const products = productsResponse.data;

        if (products.length > 0) {
          page.drawText(subcat.name, {
            x: 50,
            y,
            size: 15,
            color: rgb(0, 0, 0),
          });
          y -= 30;

          for (const product of products) {
            if (y < 50) {
              // Add a new page if the current page is full
              y = height - 50;
              pdfDoc.addPage([595.45, 841.68]);
            }

            page.drawText(product.name, {
              x: 50,
              y,
              size: 12,
              color: rgb(0, 0, 0),
            });
            y -= 20;

            if (priceFlag) {
              const basePrice = parseFloat(product.price);
              const adjustedPrice =
                basePrice + (basePrice * priceAdjustment) / 100;
              const roundedPrice = Math.round(adjustedPrice);
              page.drawText(`Rs.${roundedPrice}/-`, {
                x: 300,
                y,
                size: 12,
                color: rgb(0.2, 0.8, 0.1),
              });
            }

            y -= 20;
          }
        }
      }

      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Download the PDF
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${categoryName}-catalog.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccessMessage("Catalog downloaded successfully!");
    } catch (error) {
      console.error("Error generating catalog:", error);
      alert("Failed to generate catalog.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Admin-parent">
      <div className="">
        <PrintCatNav />
      </div>
      <div className="container my-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Print Catalog</h2>
            {isLoading && (
              <div className="loading-overlay">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Generating and downloading catalog...</p>
              </div>
            )}

            {/* Form fields remain the same */}
            <form>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="categoryName" className="form-label">
                    Select Category:
                  </label>
                  <select
                    id="categoryName"
                    className="form-select"
                    onChange={(e) => setCategoryName(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="companyName" className="form-label">
                    Company Name:
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    className="form-control"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="mobileNumber" className="form-label">
                    Mobile Number:
                  </label>
                  <input
                    type="text"
                    id="mobileNumber"
                    className="form-control"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="dateApplicable" className="form-label">
                    Date Applicable:
                  </label>
                  <input
                    type="text"
                    id="dateApplicable"
                    className="form-control"
                    value={dateApplicaple}
                    onChange={(e) => setDateApplicaple(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="hintText" className="form-label">
                    Hint Text:
                  </label>
                  <input
                    type="text"
                    id="hintText"
                    className="form-control"
                    value={hintText}
                    onChange={(e) => setHintText(e.target.value)}
                    placeholder="Enter hint text"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="priceFlag"
                      checked={priceFlag}
                      onChange={(e) => setPriceFlag(e.target.checked)}
                      disabled={isLoading}
                    />
                    <label className="form-check-label" htmlFor="priceFlag">
                      Show Prices
                    </label>
                  </div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="priceAdjustment" className="form-label">
                    Price Adjustment (%):
                  </label>
                  <input
                    type="number"
                    id="priceAdjustment"
                    className="form-control"
                    value={priceAdjustment}
                    onChange={(e) => setPriceAdjustment(e.target.value)}
                    placeholder="Enter percentage (e.g., 10 or -10)"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="minPrice" className="form-label">
                    Minimum Price:
                  </label>
                  <input
                    type="number"
                    id="minPrice"
                    className="form-control"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Enter minimum price"
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="maxPrice" className="form-label">
                    Maximum Price:
                  </label>
                  <input
                    type="number"
                    id="maxPrice"
                    className="form-control"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Enter maximum price"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlePrint}
                    disabled={isLoading}
                  >
                    Print Catalog
                  </button>
                </div>
              </form> */}
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePrint}
                  disabled={isLoading}
                >
                  Print Catalog
                </button>
              </div>
            </form>
            {successMessage && (
              <div className="alert alert-success mt-4" role="alert">
                {successMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintCatalog;
