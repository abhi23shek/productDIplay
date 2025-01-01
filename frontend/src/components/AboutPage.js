import React from "react";
import "./AboutPage.css"; // Create a separate CSS file for styling this page
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

function AboutPage() {
  return (
    <div className="about-page">
      <Navbar />
      <div className="hero-section text-center p-5 bg-primary text-white">
        <h1>About Us</h1>
        <p className="mt-3">
          Welcome to [Your Company Name], where innovation meets excellence!
        </p>
      </div>

      <div className="container my-5">
        <section className="mission-section text-center">
          <h2>Our Mission</h2>
          <p className="mt-4">
            At [Your Company Name], our mission is to deliver high-quality
            products that enhance the lives of our customers. We are dedicated
            to sustainability, innovation, and outstanding customer service.
          </p>
        </section>

        <section className="team-section mt-5">
          <h2 className="text-center">Meet the Team</h2>
          <div className="row justify-content-center mt-4">
            <div className="col-md-4">
              <div className="card">
                <img
                  src="https://via.placeholder.com/150"
                  className="card-img-top"
                  alt="Team Member"
                />
                <div className="card-body">
                  <h5 className="card-title">John Doe</h5>
                  <p className="card-text">Founder & CEO</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <img
                  src="https://via.placeholder.com/150"
                  className="card-img-top"
                  alt="Team Member"
                />
                <div className="card-body">
                  <h5 className="card-title">Jane Smith</h5>
                  <p className="card-text">Head of Product Development</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <img
                  src="https://via.placeholder.com/150"
                  className="card-img-top"
                  alt="Team Member"
                />
                <div className="card-body">
                  <h5 className="card-title">Emily Brown</h5>
                  <p className="card-text">Marketing Specialist</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="values-section mt-5">
          <h2 className="text-center">Our Values</h2>
          <div className="row mt-4">
            <div className="col-md-4 text-center">
              <h5>Innovation</h5>
              <p>We prioritize creativity and forward-thinking solutions.</p>
            </div>
            <div className="col-md-4 text-center">
              <h5>Sustainability</h5>
              <p>
                We are committed to making a positive impact on the environment.
              </p>
            </div>
            <div className="col-md-4 text-center">
              <h5>Customer First</h5>
              <p>Your satisfaction is at the heart of everything we do.</p>
            </div>
          </div>
        </section>
      </div>

      <div className="call-to-action text-center p-4 bg-light border-top">
        <h3>Want to learn more?</h3>
        <p className="mt-3">
          Reach out to us or explore our products to see what we offer!
        </p>
        <button className="btn btn-primary mt-2">Contact Us</button>
      </div>

      <Footer />
    </div>
  );
}

export default AboutPage;
