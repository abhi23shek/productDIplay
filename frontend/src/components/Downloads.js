import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const Downloads = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const updatedCatalogs = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/publiccatalog`
        );
        setCatalogs(updatedCatalogs.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogs();
  }, []);

  const handleDownload = (filename) => {
    window.open(
      `${process.env.REACT_APP_SERVER_URL}/api/publiccatalog/download/${filename}`,
      "_blank"
    );
  };

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const generatePreviewImage = (name, index) => {
    const firstLetter = name.charAt(0).toUpperCase();

    // Generate a background color based on the index or name
    const backgroundColors = [
      "#FF5733",
      "#33FF57",
      "#3357FF",
      "#FF33A1",
      "#A1FF33",
      "#33FFFC",
      "#FF8C00",
      "#8CFF00",
      "#FF00FF",
    ];

    const backgroundColor =
      backgroundColors[index % backgroundColors.length] ||
      generateRandomColor();

    return (
      <div
        style={{
          width: "100%",
          height: "200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: backgroundColor,
          color: "#fff",
          fontSize: "9rem", // Large font size for first letter
          fontWeight: "bold",
          borderRadius: "0.25rem",
        }}
      >
        {firstLetter}
      </div>
    );
  };

  return (
    <div>
      <div className="ContactNavbar">
        <Navbar />
      </div>
      <div className="container mt-4">
        <h1 className="mb-4">Catalogs: </h1>
        {loading && <p>Loading catalogs...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && catalogs.length === 0 && (
          <p>No catalogs available for download.</p>
        )}
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {catalogs.map((catalog, index) => (
            <div key={index} className="col">
              <div className="card shadow-sm">
                {/* Preview image or first letter of file name as preview */}
                {generatePreviewImage(catalog.name)}
                <div className="card-body">
                  <h5 className="card-title">{catalog.name}</h5>
                  {/* Download button */}
                  <button
                    onClick={() => handleDownload(catalog.filename)}
                    className="btn btn-success w-100"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Downloads;
