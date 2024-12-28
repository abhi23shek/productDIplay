import React from 'react';
import './HeroSection.css';


const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Welcome to Our Website</h1>
        <p className="hero-subtitle">
          Discover amazing features and experience seamless services tailored just for you.
        </p>
        <button className="hero-button">Get Started</button>
      </div>
      <div className="hero-image-container">
        <img
          src={require("./image/imgage.jpg")}
          alt="Hero"
          className="hero-image"
        />
      </div>
    </section>
  );
};

export default HeroSection;
