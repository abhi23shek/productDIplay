import React, { useEffect } from "react";
import "./HeroSection.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Import Bootstrap JS

const HeroSection = () => {
  useEffect(() => {
    const carouselElement = document.getElementById("carouselExampleDark");

    if (carouselElement) {
      // Initialize the carousel with a delay
      setTimeout(() => {
        new window.bootstrap.Carousel(carouselElement, {
          interval: 5000, // Slide interval in milliseconds
          ride: "carousel", // Automatically start sliding
        });
      }, 2000); // Initial delay of 2 seconds
    }
  }, []);

  return (
    <>
      <div id="carouselExampleDark" className="carousel carousel-dark slide">
        {/* Static Text Overlay */}
        <div className="static-text">
          {/* <img
            src={require("./image/ShivCollection logo.png")}
            className="herologo"
          /> */}
        </div>

        {/* Carousel Content */}
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src={require("./image/image1.jpg")}
              className="d-block w-100"
              alt="First slide"
            />
          </div>
          <div className="carousel-item">
            <img
              src={require("./image/image1.jpg")}
              className="d-block w-100"
              alt="Second slide"
            />
          </div>
          <div className="carousel-item">
            <img
              src={require("./image/image1.jpg")}
              className="d-block w-100"
              alt="Third slide"
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </>
  );
};

export default HeroSection;
