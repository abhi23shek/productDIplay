import React, { useEffect } from "react";
import {
  useNavigate,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Login from "./components/Login";
import FrontPage from "./components/FrontPage";
import AdminDashboard from "./components/AdminDashboard";
import AdminUpdateProduct from "./components/AdminUpdateProduct";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import PrintCatalog from "./components/PrintCatalog";
import ContactUsPage from "./components/ContactUsPage";

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate("/login"); // Redirect to login page if not authenticated
    }
  }, [auth, navigate]);

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<FrontPage />} />
          <Route path="/Contact-us" element={<ContactUsPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/update/:id" element={<AdminUpdateProduct />} />
          <Route path="/printcatalog" element={<PrintCatalog />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
