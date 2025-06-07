// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { generatePDF } from "./print/GeneratePDF";

// const AdminUpdateCatalog = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_SERVER_URL}/api/categories`
//         );
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleUploadAllPDFs = async () => {
//     setLoading(true);

//     for (const category of categories) {
//       try {
//         const subcategoryResponse = await axios.get(
//           `${process.env.REACT_APP_SERVER_URL}/api/subcategories/${category.id}`
//         );
//         const subcategories = subcategoryResponse.data;

//         let pages = [];

//         for (const subcat of subcategories) {
//           const productResponse = await fetch(
//             `${process.env.REACT_APP_SERVER_URL}/api/products/productfilter?subCategoryId=${subcat.id}&minPrice=0&maxPrice=999999&imgFlag=false`
//           );
//           const products = await productResponse.json();
//           // console.log(products);
//           // const products = productResponse.data;
//           // console.log(products);

//           const chunkSize = 9;
//           for (let i = 0; i < products.length; i += chunkSize) {
//             pages.push({
//               subcategoryName: subcat.name,
//               subPageNumber: Math.floor(i / chunkSize) + 1,
//               productsOnPage: products.slice(i, i + chunkSize),
//             });
//           }
//         }

//         if (pages.length === 0) continue;

//         // Generate PDF as a Blob
//         const pdfBytes = await generatePDF(
//           pages,
//           "SHIV COLLECTION",
//           "1st April 2024",
//           "9958660231, 7838146412",
//           "Trademark:-Vidhata",
//           0,
//           true
//         );

//         // Convert PDF Bytes to a Blob
//         const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

//         // Create a FormData object to send the PDF
//         const formData = new FormData();
//         formData.append("catalogs", pdfBlob, `${category.name}_Catalog.pdf`);

//         // Upload the PDF to the backend
//         const uploadResponse = await axios.post(
//           `${process.env.REACT_APP_SERVER_URL}/api/gdrive`,
//           formData,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );

//         const categoryDetailsResponse = await axios.get(
//           `${process.env.REACT_APP_SERVER_URL}/api/categories/${category.id}`
//         );
//         const existingCatalogId = categoryDetailsResponse.data.catalog_id;
//         console.log(existingCatalogId);

//         // if (existingCatalogId) {
//         //   await axios.delete(
//         //     `${process.env.REACT_APP_SERVER_URL}/api/gdrive/${existingCatalogId}`
//         //   );
//         //   console.log(`Deleted old file with ID: ${existingCatalogId}`);
//         // }

//         if (existingCatalogId) {
//           try {
//             await axios.delete(
//               `${process.env.REACT_APP_SERVER_URL}/api/gdrive/${existingCatalogId}`
//             );
//             console.log(`Deleted old file with ID: ${existingCatalogId}`);
//           } catch (deleteError) {
//             console.error(
//               `Failed to delete old file with ID: ${existingCatalogId}, proceeding with new upload.`,
//               deleteError
//             );
//           }
//         }

//         // Update catalog_id in the database
//         await axios.put(
//           `${process.env.REACT_APP_SERVER_URL}/api/categories/${category.id}/update-catalog`,
//           { catalog_id: uploadResponse.data.fileId }
//         );

//         console.log(
//           `Uploaded ${category.name} PDF, File ID:`,
//           uploadResponse.data.fileId
//         );
//       } catch (error) {
//         console.error(`Error processing ${category.name}:`, error);
//       }
//     }

//     setLoading(false);
//   };

//   return (
//     <div>
//       <h1>Admin Update Catalog</h1>
//       <button onClick={handleUploadAllPDFs} disabled={loading}>
//         {loading ? "Uploading..." : "Upload All Catalogs"}
//       </button>
//     </div>
//   );
// };

// export default AdminUpdateCatalog;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { generatePDF } from "./print/GeneratePDF";

// const AdminUpdateCatalog = () => {
//   const [categories, setCategories] = useState([]);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_SERVER_URL}/api/categories`
//         );
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const toggleCategory = (categoryId) => {
//     setSelectedCategories((prevSelected) =>
//       prevSelected.includes(categoryId)
//         ? prevSelected.filter((id) => id !== categoryId)
//         : [...prevSelected, categoryId]
//     );
//   };

//   const handleUploadAllPDFs = async () => {
//     if (selectedCategories.length === 0) {
//       alert("Please select at least one category.");
//       return;
//     }

//     setLoading(true);

//     const selected = categories.filter((cat) =>
//       selectedCategories.includes(cat.id)
//     );

//     for (const category of selected) {
//       try {
//         const subcategoryResponse = await axios.get(
//           `${process.env.REACT_APP_SERVER_URL}/api/subcategories/${category.id}`
//         );
//         const subcategories = subcategoryResponse.data;

//         let pages = [];

//         for (const subcat of subcategories) {
//           const productResponse = await fetch(
//             `${process.env.REACT_APP_SERVER_URL}/api/products/productfilter?subCategoryId=${subcat.id}&minPrice=0&maxPrice=999999&imgFlag=false`
//           );
//           const products = await productResponse.json();

//           const chunkSize = 9;
//           for (let i = 0; i < products.length; i += chunkSize) {
//             pages.push({
//               subcategoryName: subcat.name,
//               subPageNumber: Math.floor(i / chunkSize) + 1,
//               productsOnPage: products.slice(i, i + chunkSize),
//             });
//           }
//         }

//         if (pages.length === 0) continue;

//         const pdfBytes = await generatePDF(
//           pages,
//           "SHIV COLLECTION",
//           "1st April 2024",
//           "9958660231, 7838146412",
//           "Trademark:-Vidhata",
//           0,
//           true
//         );

//         const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
//         const formData = new FormData();
//         formData.append("catalogs", pdfBlob, `${category.name}_Catalog.pdf`);

//         const uploadResponse = await axios.post(
//           `${process.env.REACT_APP_SERVER_URL}/api/gdrive`,
//           formData,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );

//         const categoryDetailsResponse = await axios.get(
//           `${process.env.REACT_APP_SERVER_URL}/api/categories/${category.id}`
//         );
//         const existingCatalogId = categoryDetailsResponse.data.catalog_id;

//         if (existingCatalogId) {
//           try {
//             await axios.delete(
//               `${process.env.REACT_APP_SERVER_URL}/api/gdrive/${existingCatalogId}`
//             );
//             console.log(`Deleted old file with ID: ${existingCatalogId}`);
//           } catch (deleteError) {
//             console.error(`Failed to delete old file:`, deleteError);
//           }
//         }

//         await axios.put(
//           `${process.env.REACT_APP_SERVER_URL}/api/categories/${category.id}/update-catalog`,
//           { catalog_id: uploadResponse.data.fileId }
//         );

//         console.log(
//           `Uploaded ${category.name} PDF, File ID:`,
//           uploadResponse.data.fileId
//         );
//       } catch (error) {
//         console.error(`Error processing ${category.name}:`, error);
//       }
//     }

//     setLoading(false);
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>Update Catalogs</h2>

//       <div style={styles.categoryList}>
//         {categories.map((category) => (
//           <label key={category.id} style={styles.checkboxLabel}>
//             <input
//               type="checkbox"
//               checked={selectedCategories.includes(category.id)}
//               onChange={() => toggleCategory(category.id)}
//             />
//             <span style={styles.categoryName}>{category.name}</span>
//           </label>
//         ))}
//       </div>

//       <button
//         onClick={handleUploadAllPDFs}
//         disabled={loading}
//         style={{
//           ...styles.button,
//           backgroundColor: loading ? "#ccc" : "#4CAF50",
//         }}
//       >
//         {loading ? "Uploading..." : "Upload Selected Catalogs"}
//       </button>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: "800px",
//     margin: "40px auto",
//     padding: "20px",
//     border: "1px solid #ddd",
//     borderRadius: "10px",
//     backgroundColor: "#fafafa",
//     fontFamily: "Arial, sans-serif",
//   },
//   title: {
//     textAlign: "center",
//     marginBottom: "20px",
//     color: "#333",
//   },
//   categoryList: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: "10px 20px",
//     marginBottom: "30px",
//   },
//   checkboxLabel: {
//     display: "flex",
//     alignItems: "center",
//     fontSize: "16px",
//     color: "#444",
//   },
//   categoryName: {
//     marginLeft: "10px",
//   },
//   button: {
//     padding: "12px 20px",
//     fontSize: "16px",
//     border: "none",
//     borderRadius: "5px",
//     color: "#fff",
//     cursor: "pointer",
//     display: "block",
//     margin: "0 auto",
//   },
// };

// export default AdminUpdateCatalog;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { generatePDF } from "./print/GeneratePDF";

const AdminUpdateCatalog = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

    fetchCategories();
  }, []);

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const handleUploadAllPDFs = async () => {
    if (selectedCategories.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    setLoading(true);

    const selected = categories.filter((cat) =>
      selectedCategories.includes(cat.id)
    );

    for (const category of selected) {
      try {
        const subcategoryResponse = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/subcategories/${category.id}`
        );
        const subcategories = subcategoryResponse.data;

        let pages = [];

        for (const subcat of subcategories) {
          const productResponse = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/products/productfilter?subCategoryId=${subcat.id}&minPrice=0&maxPrice=999999&imgFlag=false`
          );
          const products = await productResponse.json();

          const chunkSize = 9;
          for (let i = 0; i < products.length; i += chunkSize) {
            pages.push({
              subcategoryName: subcat.name,
              subPageNumber: Math.floor(i / chunkSize) + 1,
              productsOnPage: products.slice(i, i + chunkSize),
            });
          }
        }

        if (pages.length === 0) continue;

        const pdfBytes = await generatePDF(
          pages,
          "SHIV COLLECTION",
          "1st April 2024",
          "9958660231, 7838146412",
          "Trademark:-Vidhata",
          0,
          true
        );

        const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
        const formData = new FormData();
        formData.append("catalogs", pdfBlob, `${category.name}_Catalog.pdf`);

        const uploadResponse = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/gdrive`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const categoryDetailsResponse = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/categories/${category.id}`
        );
        const existingCatalogId = categoryDetailsResponse.data.catalog_id;

        if (existingCatalogId) {
          try {
            await axios.delete(
              `${process.env.REACT_APP_SERVER_URL}/api/gdrive/${existingCatalogId}`
            );
            console.log(`Deleted old file with ID: ${existingCatalogId}`);
          } catch (deleteError) {
            console.error(`Failed to delete old file:`, deleteError);
          }
        }

        await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/api/categories/${category.id}/update-catalog`,
          { catalog_id: uploadResponse.data.fileId }
        );

        console.log(
          `Uploaded ${category.name} PDF, File ID:`,
          uploadResponse.data.fileId
        );
      } catch (error) {
        console.error(`Error processing ${category.name}:`, error);
      }
    }

    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.navbar}>
        <button
          onClick={() => window.history.back()}
          style={styles.navBackButton}
        >
          ⬅ Back
        </button>
      </div>

      <div style={styles.container}>
        <div style={styles.heading}>
          <h2 style={styles.navTitle}>Update Catalogs</h2>
        </div>

        <div style={styles.categoryList}>
          {categories.map((category) => (
            <label key={category.id} style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
              />
              <span style={styles.categoryName}>{category.name}</span>
            </label>
          ))}
        </div>

        <div style={styles.buttonRow}>
          <button
            onClick={handleUploadAllPDFs}
            disabled={loading}
            style={{
              ...styles.uploadButton,
              backgroundColor: loading ? "#ccc" : "#4CAF50",
            }}
          >
            {loading ? "Uploading..." : "Upload Selected Catalogs"}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  navbar: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    // backgroundColor: "#333",
    color: "#fff",
  },
  navBackButton: {
    backgroundColor: "#555",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "15px",
  },
  navTitle: {
    color: "#000",
    margin: 0,
    fontSize: "50px",
    justifyContent: "center",
  },
  container: {
    // display: "flex",
    maxWidth: "800px",
    margin: "30px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
  },
  categoryList: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px 20px",
    marginBottom: "30px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    color: "#444",
  },
  categoryName: {
    marginLeft: "10px",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
  },
  uploadButton: {
    padding: "10px 16px",
    fontSize: "14px",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
    cursor: "pointer",
  },
  heading: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
};

export default AdminUpdateCatalog;
