import React from "react";
import { useAuth } from "./AuthContext";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
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

        {/* Navbar Toggle for mobile view */}
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
          <ul className="navbar-nav ms-auto">
            {/* Logout Button on the Rightmost */}
            <li className="nav-item">
              <button
                onClick={logout}
                className="btn btn-danger text-dark rounded-pill px-4 shiny-text"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
