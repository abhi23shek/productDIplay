import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./MobileNavbar.css";

const MobileNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        {/* Company Logo */}
        <div className="logo-container" onClick={() => navigate("/")}>
          <img
            src={require("./image/ShivCollection-logo3.png")}
            alt="Company Logo"
            className="company-logo"
          />
        </div>
        <div className="companyname">shiv collection</div>

        {/* Hamburger Menu */}
        <div className="menu-toggle">
          <input type="checkbox" id="menu-checkbox" />
          <label htmlFor="menu-checkbox" className="menu-icon">
            <span></span>
            <span></span>
            <span></span>
          </label>

          {/* Dropdown Menu */}
          <div className="menu-dropdown">
            <ul>
              <li>
                <button
                  className={`M-nav-btn ${
                    isActive("/") ? "M-active" : "M-notactive"
                  }`}
                  onClick={() => navigate("/")}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  className={`M-nav-btn ${
                    isActive("/Contact-us") ? "M-active" : "M-notactive"
                  }`}
                  onClick={() => navigate("/Contact-us")}
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  className={`M-nav-btn ${
                    isActive("/downloads") ? "M-active" : "M-notactive"
                  }`}
                  onClick={() => navigate("/downloads")}
                >
                  Downloads
                </button>
              </li>
              <li>
                {auth ? (
                  <button
                    className={`M-nav-btn btn-success M-admin${
                      isActive("/admin") ? "" : ""
                    }`}
                    onClick={() => navigate("/admin")}
                  >
                    Admin
                  </button>
                ) : (
                  <button
                    className={`M-nav-btn ${
                      isActive("/admin") ? "M-active" : "M-notactive"
                    } login-btn`}
                    onClick={() => navigate("/admin")}
                  >
                    Login
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MobileNavbar;
