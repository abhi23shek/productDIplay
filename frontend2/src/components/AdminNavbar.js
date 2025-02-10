import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import MobileAdminNavbar from "./MobileAdminNavbar";
import "./Navbar.css";

const AdminNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
        {/* Desktop Version */}
        <div className="container-fluid nav-bar-desktop">
          <div className="leftside_navbar">
            <div className="nav-links">
              <button
                className={`nav-link ${isActive("/admin") ? "active" : ""}`}
                onClick={() => navigate("/")}
              >
                Home
              </button>
              <button
                className={`nav-link ${
                  isActive("/admin/printcatalog") ? "active" : ""
                }`}
                onClick={() => navigate("/admin/printcatalog")}
              >
                Print Catalog
              </button>
              <button
                className={`nav-link ${
                  isActive("/admin/uploadcatalog") ? "active" : ""
                }`}
                onClick={() => navigate("/uploadcatalog")}
              >
                Upload Catalog
              </button>
            </div>
          </div>
          <div className="rightside_navbar">
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Version */}
        <div className="mobile-admin-navbar">
          <MobileAdminNavbar />
        </div>
      </nav>
    </>
  );
};

export default AdminNavbar;
