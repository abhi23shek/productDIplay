import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";
import Navbar from "./Navbar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./Footer";

const NextArrow = ({ onClick }) => (
  <div className="arrow next" onClick={onClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
    </svg>
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="arrow prev" onClick={onClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
    </svg>
  </div>
);

const Homepage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    fade: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const sliderImages = isMobile
    ? ["./image/image5.jpg", "./image/image6.jpg", "./image/image7.jpg"]
    : ["./image/image1.jpg", "./image/image2.jpg", "./image/image3.jpg"];

  return (
    <div className="home-container">
      <div className="Home-nav">
        <Navbar />
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <Slider {...sliderSettings} className="full-width-slider">
          {sliderImages.map((image, index) => (
            <div key={index} className="hero-slide">
              <img src={require(`${image}`)} alt={`Collection ${index + 1}`} />
              <div className="slide-content">
                <div className="hero-title">Shiv Collection</div>
                <div className="hero-slogan">
                  We Make Better Things In A Better Way
                </div>
                <button
                  className="cta-button"
                  onClick={() => navigate("/FrontPage")}
                >
                  Explore Now
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <div className="categories-heading">
        <h2>Our Categories</h2>
        <div className="heading-divider"></div>
      </div>

      {/* Product Showcase Section */}
      <section className="Home-product-showcase">
        <div className="Home-product-card">
          <img src={require("./image/simple.jpg")} />
          <button
            className="product-hover-button"
            onClick={() => navigate("/FrontPage?category=1")} // Pass category ID
          >
            Explore Now
          </button>
        </div>
        <div className="Home-product-card">
          <img src={require("./image/stone.jpg")} />
          <button
            className="product-hover-button"
            onClick={() => navigate("/FrontPage?category=2")}
          >
            Explore Now
          </button>
        </div>
        <div className="Home-product-card">
          <img src={require("./image/redium.jpg")} />
          <button
            className="product-hover-button"
            onClick={() => navigate("/FrontPage?category=3")}
          >
            Explore Now
          </button>
        </div>
        <div className="Home-product-card">
          <img src={require("./image/photo frame.jpg")} />
          <button
            className="product-hover-button"
            onClick={() => navigate("/FrontPage?category=4")}
          >
            Explore Now
          </button>
        </div>
        <div className="Home-product-card">
          <img src={require("./image/toys.jpg")} />
          <button
            className="product-hover-button"
            onClick={() => navigate("/FrontPage?category=5")}
          >
            Explore Now
          </button>
        </div>
      </section>
      <section className="about-section">
        <div className="about-container">
          <div className="about-logo">
            <img
              src={require("./image/ShivCollection-logo4.png")}
              alt="Company Logo"
            />
          </div>
          <div className="about-content">
            <h2>About Shiv Collection</h2>
            <p className="tagline">Crafting Excellence Since 2008</p>
            <p className="description">
              We are dedicated to creating premium quality products that blend
              traditional craftsmanship with modern design. Our commitment to
              quality and sustainability drives every aspect of our production
              process.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;
