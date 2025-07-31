import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./pages/Home"
import ShopPage from "./pages/ShopPage";
import About from "./pages/About"
import Contact from "./pages/Contact"
import Header from './components/Header'
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/Forgotpassword"
import Footer from "./components/Footer"
import ProductUploadForm from "./components/ProductUploadForm";

// Admin Components
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import ProductManagement from "./pages/admin/ProductManagement";
import ProductForm from "./pages/admin/ProductForm";

const AppContent = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/create" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
        </Route>
      </Routes>

      {!isAdmin && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
      <Footer/>
    </BrowserRouter>
  );
};

export default App;
