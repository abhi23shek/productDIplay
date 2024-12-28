import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FrontPage from "./components/FrontPage";
import AdminDashboard from "./components/AdminDashboard";
import AdminUpdateProduct from "./components/AdminUpdateProduct";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/update/:id" element={<AdminUpdateProduct />} />
      </Routes>
    </Router>
  );
}

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import ProductCatalog from './components/ProductCatalog';
// import AdminProductList from './components/AdminProductList';
// import AdminAddProduct from './components/AdminAddProduct';
// import AdminUpdateProduct from './components/AdminUpdateProduct';
// import './App.css';

// function App() {
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/" element={<ProductCatalog />} />
//                 <Route path="/admin" element={<AdminProductList />} />
//                 <Route path="/admin/add" element={<AdminAddProduct />} />
//                 <Route path="/admin/update/:id" element={<AdminUpdateProduct />} />
//             </Routes>
//         </Router>
//     );
// }

// export default App;
