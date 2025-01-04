// import React, { useEffect, useState } from "react";
// import { PDFDocument } from "pdf-lib";
// import axios from "axios";

// const PrintCatalog = () => {
//   const [categoryName, setCategoryName] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [companyName, setCompanyName] = useState("SHIV ENTERPRISES");
//   const [mobileNumber, setMobileNumber] = useState(
//     "9958660231, 7838146412, 9717437131"
//   );
//   const [dateApplicaple, setDateApplicaple] = useState("1st April 2024");
//   const [priceFlag, setPriceFlag] = useState(true); // New state for price visibility

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("http://localhost:3001/api/categories");
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

//     axios
//       .post(
//         "http://localhost:3001/api/print-catalog",
//         {
//           categoryId: categoryName,
//           companyName,
//           mobileNumber,
//           dateApplicaple,
//           priceFlag, // Send the priceFlag to the backend
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
//           link.setAttribute("download", `catalog-${categoryName}.pdf`);
//           document.body.appendChild(link);
//           link.click();
//           document.body.removeChild(link);
//         } catch (error) {
//           console.error("Error processing PDF:", error);
//           alert("Failed to modify the catalog PDF.");
//         }
//       })
//       .catch((err) => {
//         console.error("Error generating catalog:", err);
//         alert("Failed to generate catalog.");
//       });
//   };

//   return (
//     <div>
//       <h2>Print Catalog</h2>
//       <div>
//         <label>
//           Company Name:
//           <input
//             type="text"
//             value={companyName}
//             onChange={(e) => setCompanyName(e.target.value)}
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           Mobile Number:
//           <input
//             type="text"
//             value={mobileNumber}
//             onChange={(e) => setMobileNumber(e.target.value)}
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           Date Applicable:
//           <input
//             type="text"
//             value={dateApplicaple}
//             onChange={(e) => setDateApplicaple(e.target.value)}
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           Select Category:
//           <select onChange={(e) => setCategoryName(e.target.value)}>
//             <option value="">Select Category</option>
//             {categories.map((cat) => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>
//         </label>
//       </div>
//       <div>
//         <label>
//           Show Prices:
//           <input
//             type="checkbox"
//             checked={priceFlag}
//             onChange={(e) => setPriceFlag(e.target.checked)}
//           />
//         </label>
//       </div>
//       <button onClick={handlePrint}>Print Catalog</button>
//     </div>
//   );
// };

// export default PrintCatalog;

import React, { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import axios from "axios";

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handlePrint = () => {
    if (!categoryName) {
      alert("Please select a category.");
      return;
    }

    axios
      .post(
        "http://localhost:3001/api/print-catalog",
        {
          categoryId: categoryName,
          companyName,
          mobileNumber,
          dateApplicaple,
          priceFlag,
          priceAdjustment, // Send price adjustment value to backend
        },
        { responseType: "blob" }
      )
      .then(async (res) => {
        try {
          const arrayBuffer = await res.data.arrayBuffer();

          const pdfDoc = await PDFDocument.load(arrayBuffer);

          pdfDoc.removePage(0);

          const modifiedPdfBytes = await pdfDoc.save();

          const url = URL.createObjectURL(
            new Blob([modifiedPdfBytes], { type: "application/pdf" })
          );

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `catalog-${categoryName}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error("Error processing PDF:", error);
          alert("Failed to modify the catalog PDF.");
        }
      })
      .catch((err) => {
        console.error("Error generating catalog:", err);
        alert("Failed to generate catalog.");
      });
  };

  return (
    <div>
      <h2>Print Catalog</h2>
      <div>
        <label>
          Company Name:
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Mobile Number:
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Date Applicable:
          <input
            type="text"
            value={dateApplicaple}
            onChange={(e) => setDateApplicaple(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Select Category:
          <select onChange={(e) => setCategoryName(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Show Prices:
          <input
            type="checkbox"
            checked={priceFlag}
            onChange={(e) => setPriceFlag(e.target.checked)}
          />
        </label>
      </div>
      <div>
        <label>
          Price Adjustment (%):
          <input
            type="number"
            value={priceAdjustment}
            onChange={(e) => setPriceAdjustment(e.target.value)}
            placeholder="Enter percentage (e.g., 10 or -10)"
          />
        </label>
      </div>
      <button onClick={handlePrint}>Print Catalog</button>
    </div>
  );
};

export default PrintCatalog;
