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
import Cart from "./components/Cart";
import TrialProductCard from "./components/trial/TrialProductCard";

const sampleProduct = {
  image: "https://i.ibb.co/d78tPG7/image.png", // Replace with your image URL
  name: "Awesome Product",
  price: 29.99,
  description:
    "This is a detailed description of the product.  It can span multiple lines and provide all the necessary information to the user.",
};

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
          <Route path="/Cart" element={<Cart />} />
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
          <Route
            path="/temp"
            element={<TrialProductCard product={sampleProduct} />}
          />
        </Routes>
      </AuthProvider>
      <SpeedInsights />
    </Router>
  );
}

export default App;
