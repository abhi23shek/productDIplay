import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  // Check if a path is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
      <div className="container-fluid">
        <button
          className={`navbar-brand text-dark rounded-pill px-4 ${
            isActive("/") ? "border border-dark" : ""
          } home-btn`}
          onClick={() => navigate("/")}
        >
          Home
        </button>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <button
                className={`nav-link navbar-brand text-dark rounded-pill px-4 ${
                  isActive("/Contact-us") ? "border border-dark" : ""
                } about-btn`}
                onClick={() => navigate("/Contact-us")}
              >
                Contact Us
              </button>
            </li>
          </ul>
          <div className="d-flex">
            {auth ? (
              <button
                className={`btn btn-success ${
                  isActive("/admin") ? "border border-dark" : ""
                }`}
                onClick={() => navigate("/admin")}
              >
                Admin
              </button>
            ) : (
              <button
                className={`nav-link navbar-brand text-dark rounded-pill px-4 ${
                  isActive("/admin") ? "border border-dark" : ""
                } login-btn`}
                onClick={() => navigate("/admin")}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
