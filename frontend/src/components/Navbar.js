import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import MobileNavbar from "./MobileNavbar";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  // Check if a path is active
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar navbar-expand-xs navbar-light bg-transparent">
        <div className="container-fluid nav-bar-destop">
          {/* Company Logo */}
          {/* <div className="nav-bar-destop"> */}
          <div className="leftside_navbar">
            <div className="navbar-logo mx-auto" onClick={() => navigate("/")}>
              <img
                src={require("./image/ShivCollection-logo3.png")} // Update with your actual logo path
                alt="Company Logo"
                className="logo-img"
              />
            </div>
            <button
              className={`navbar-brand text-dark rounded-pill px-4 shiny-text ${
                isActive("/") ? "NavBorder" : "NavBorderNotActive"
              } home-btn`}
              onClick={() => navigate("/")}
            >
              Home
            </button>
            <button
              className={`nav-link navbar-brand text-dark rounded-pill px-4 shiny-text ${
                isActive("/Contact-us") ? "NavBorder" : "NavBorderNotActive"
              } about-btn`}
              onClick={() => navigate("/Contact-us")}
            >
              Contact Us
            </button>
            <button
              className={`navbar-brand text-dark rounded-pill px-4 shiny-text ${
                isActive("/downloads") ? "NavBorder" : "NavBorderNotActive"
              } about-btn`}
              onClick={() => navigate("/downloads")}
            >
              Downloads
            </button>
          </div>
          <div className="rightside_navbar">
            <div className="d-flex">
              {auth ? (
                <button
                  className={`btn btn-success shiny-text text-dark rounded-pill px-4${
                    isActive("/admin") ? "border border-dark" : ""
                  }`}
                  onClick={() => navigate("/admin")}
                >
                  Admin
                </button>
              ) : (
                <button
                  className={`nav-link navbar-brand text-dark rounded-pill px-4 shiny-text ${
                    isActive("/admin") ? "border border-dark" : ""
                  } login-btn`}
                  onClick={() => navigate("/admin")}
                >
                  Login
                </button>
              )}
            </div>
          </div>
          {/* </div> */}
        </div>
        <div className="mobilenav">
          <MobileNavbar></MobileNavbar>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
