import React from "react";
import "./Navbar.css"; // Optional: For additional custom styling
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth } = useAuth(); // Access auth state from AuthContext

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Home
        </a>
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
              <a className="nav-link" href="/about-us">
                About Us
              </a>
            </li>
          </ul>
          <div className="d-flex">
            {auth ? (
              // If user is logged in, show "Admin" button with green color
              <button
                className="btn btn-success"
                onClick={() => navigate("/admin")}
              >
                Admin
              </button>
            ) : (
              // If user is not logged in, show "Login" button
              <button
                className="btn btn-primary"
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

// import React from "react";
// import "./Navbar.css"; // Optional: For styling
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const { auth } = useAuth(); // Access auth state from AuthContext

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <a href="/" className="navbar-logo">
//           Home
//         </a>
//         <a href="/about-us" className="navbar-link">
//           About Us
//         </a>
//       </div>
//       <div className="navbar-right">
//         {auth ? (
//           // If user is logged in, show "Admin" button with green color
//           <button
//             className="btn btn-success"
//             onClick={() => navigate("/admin")}
//             style={{ backgroundColor: "green", color: "white" }}
//           >
//             Admin
//           </button>
//         ) : (
//           // If user is not logged in, show "Login" button
//           <button
//             className="btn btn-primary"
//             onClick={() => navigate("/admin")}
//           >
//             Login
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// import React from "react";
// import "./Navbar.css"; // Optional: For styling
// import { useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const navigate = useNavigate();
//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <a href="/" className="navbar-logo">
//           Home
//         </a>
//         <a href="/about-us" className="navbar-link">
//           About Us
//         </a>
//       </div>
//       <div className="navbar-right">
//         <button className="login-btn" onClick={() => navigate("/admin")}>
//           Login
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
