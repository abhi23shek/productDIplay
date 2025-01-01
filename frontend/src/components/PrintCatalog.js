import React, { useEffect, useState } from "react";
import axios from "axios";

const PrintCatalog = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);

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
        { categoryId: categoryName },
        { responseType: "blob" }
      )
      .then((res) => {
        const url = URL.createObjectURL(
          new Blob([res.data], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `catalog-${categoryName}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        console.error("Error generating catalog:", err);
        alert("Failed to generate catalog.");
      });
  };

  return (
    <div>
      <h2>Print Catalog</h2>
      <select onChange={(e) => setCategoryName(e.target.value)}>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <button onClick={handlePrint}>Print Catalog</button>
    </div>
  );
};

export default PrintCatalog;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const PrintCatalog = () => {
//   const [categoryName, setCategoryName] = useState("");
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handlePrint = () => {
//     if (!categoryName) {
//       alert("Please select a category.");
//       return;
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch("http://localhost:3001/api/categories");
//       const data = await response.json();
//       setCategories(data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   axios
//     .post(
//       "/api/print-catalog",
//       { categoryId: categoryName },
//       { responseType: "blob" }
//     )
//     .then((res) => {
//       const url = URL.createObjectURL(
//         new Blob([res.data], { type: "application/pdf" })
//       );
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `catalog-${categoryName}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     })
//     .catch((err) => {
//       console.error("Error generating catalog:", err);
//       alert("Failed to generate catalog.");
//     });
// };
// return (
//   <div>
//     <h2>Print Catalog</h2>
//     <select onChange={(e) => setSelectedCategory(e.target.value)}>
//       <option value="">Select Category</option>
//       {categories.map((cat) => (
//         <option key={cat.id} value={cat.id}>
//           {cat.name}
//         </option>
//       ))}
//     </select>
//     <button onClick={handlePrint}>Print Catalog</button>
//   </div>
// );
// };
// export default PrintCatalog;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const PrintCatalog = () => {
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");

//   useEffect(() => {
//     // Fetch categories
//     axios.get("/api/categories").then((res) => {
//       setCategories(res.data);
//     });
//   }, []);

//   const handlePrint = () => {
//     if (!selectedCategory) {
//       alert("Please select a category.");
//       return;
//     }

//     axios
//       .post("/api/print-catalog", { categoryId: selectedCategory }, { responseType: "blob" })
//       .then((res) => {
//         const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
//         const link = document.createElement("a");
//         link.href = url;
//         link.setAttribute("download", `catalog-${selectedCategory}.pdf`);
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       })
//       .catch((err) => {
//         console.error("Error generating catalog:", err);
//         alert("Failed to generate catalog.");
//       });
//   };

//   return (
//     <div>
//       <h2>Print Catalog</h2>
//       <select onChange={(e) => setSelectedCategory(e.target.value)}>
//         <option value="">Select Category</option>
//         {categories.map((cat) => (
//           <option key={cat.id} value={cat.id}>
//             {cat.name}
//           </option>
//         ))}
//       </select>
//       <button onClick={handlePrint}>Print Catalog</button>
//     </div>
//   );
// };
