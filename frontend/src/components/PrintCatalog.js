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
  const [minPrice, setMinPrice] = useState(0); // Minimum price
  const [maxPrice, setMaxPrice] = useState(1000); // Maximum price
  const [hintText, setHintText] = useState("Trademark:-Vidhata");

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
    const selectedCategory = categories.find(
      (cat) => String(cat.id) === String(categoryName)
    );

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
          minPrice, // Include min price
          maxPrice, // Include max price
          hintText,
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
          const fileName = `${selectedCategory.name}-catalog.pdf`;

          link.setAttribute("download", fileName);
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
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Print Catalog</h2>
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
                />
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePrint}
              >
                Print Catalog
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrintCatalog;
