import React from "react";
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
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="Home-nav">
        <Navbar />
      </div>

      <div className="hero-section">
        <Slider {...sliderSettings} className="full-width-slider">
          {[3, 2, 1].map((slide) => (
            <div key={slide} className="hero-slide">
              <img
                src={require(`./image/image${slide}.jpg`)}
                alt={`Collection ${slide}`}
              />
              <div className="slide-content">
                <h1 className="hero-title">Shiv Collection</h1>
                <p className="hero-slogon">
                  We Make Better Things In A Better Way
                </p>
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

      <section className="Home-product-showcase">
        <div className="Home-product-card">
          <img src={require("./image/image1.jpg")} alt="Product 1" />
          <h3>Classic Style</h3>
          <p>Timeless designs for everyday wear</p>
        </div>
        <div className="Home-product-card">
          <img src={require("./image/image1.jpg")} alt="Product 2" />
          <h3>Premium Materials</h3>
          <p>Ethically sourced fabrics</p>
        </div>
        <div className="Home-product-card">
          <img src={require("./image/image1.jpg")} alt="Product 3" />
          <h3>New Arrivals</h3>
          <p>Latest collection pieces</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;
