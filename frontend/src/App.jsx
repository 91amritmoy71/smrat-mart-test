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

const AppContent = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <Header />
      {isHome }

      

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopPage />} />
      
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
       
       
        
        
      </Routes>
     
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
