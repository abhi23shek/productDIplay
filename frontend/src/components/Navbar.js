import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth } = useAuth(); // Access auth state from AuthContext

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
      <div className="container-fluid">
        <a
          className="navbar-brand text-dark rounded-pill  px-4 border border-dark home-btn"
          href="/"
        >
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
              <a
                className="nav-link text-dark navbar-brand text-dark rounded-pill about-btn"
                href="/about-us"
              >
                About Us
              </a>
            </li>
          </ul>
          <div className="d-flex">
            {auth ? (
              <button
                className="btn btn-success"
                onClick={() => navigate("/admin")}
              >
                Admin
              </button>
            ) : (
              <button
                className="nav-link text-dark navbar-brand text-dark rounded-pill px-4 border border-dark login-btn"
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
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const { auth } = useAuth(); // Access auth state from AuthContext

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
//       <div className="container-fluid">
//         <a
//           className="navbar-brand text-dark rounded-pill py-2 px-4 border border-dark" // Adjusted padding and border
//           href="/"
//         >
//           Home
//         </a>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav me-auto">
//             <li className="nav-item">
//               <a className="nav-link text-dark" href="/about-us">
//                 About Us
//               </a>
//             </li>
//           </ul>
//           <div className="d-flex">
//             {auth ? (
//               <button
//                 className="btn btn-success"
//                 onClick={() => navigate("/admin")}
//               >
//                 Admin
//               </button>
//             ) : (
//               <button
//                 className="btn btn-primary"
//                 onClick={() => navigate("/admin")}
//               >
//                 Login
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
