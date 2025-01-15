import React, { useEffect } from "react";
import {
  useNavigate,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Login from "./components/Login";
import FrontPage from "./components/FrontPage";
import AdminDashboard from "./components/AdminDashboard";
import AdminUpdateProduct from "./components/AdminUpdateProduct";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import PrintCatalog from "./components/PrintCatalog";
import ContactUsPage from "./components/ContactUsPage";
import AdminUploadCatalog from "./components/AdminUploadCatalog";
import Downloads from "./components/Downloads";
import ContactusSuccess from "./components/ContactusSuccess";

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
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/" element={<FrontPage />} />
          <Route path="/Contact-us" element={<ContactUsPage />} />
          <Route path="/Contact-success" element={<ContactusSuccess />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/update/:id"
            element={
              <ProtectedRoute>
                <AdminUpdateProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/printcatalog"
            element={
              <ProtectedRoute>
                <PrintCatalog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/uploadCatalog"
            element={
              <ProtectedRoute>
                <AdminUploadCatalog />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
      <SpeedInsights />
    </Router>
  );
}

export default App;
