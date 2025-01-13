import React from "react";
import { useAuth } from "./AuthContext";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        <div className="Adminleftside_navbar">
          {/* Home Button on the Leftmost */}
          <a
            href="/"
            className="navbar-brand Admin-btn btn1 text-dark rounded-pill px-4 shiny-text"
          >
            Home
          </a>

          {/* Print Catalog Button next to Home */}
          <a
            href="/admin/printcatalog"
            className="navbar-brand Admin-btn btn1 text-dark rounded-pill px-4 shiny-text"
          >
            Print Catalog
          </a>
          <a
            href="/uploadcatalog"
            className="navbar-brand Admin-btn btn1 text-dark rounded-pill px-4 shiny-text"
          >
            Upload Catalog
          </a>
        </div>
        <div className="Adminrightside_navbar">
          <li className="nav-item">
            <button
              onClick={logout}
              className="btn btn-danger text-dark rounded-pill px-4 shiny-text"
            >
              Logout
            </button>
          </li>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
