import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-black shadow-sm py-2 sticky-top">
      <div className="container d-flex align-items-center justify-content-between">

        {/* Logo */}
        <Link className="navbar-brand me-5" to="/">
          <img src={logo} alt="Smart Mart" height="40" />
        </Link>

        {/* Search Box */}
        <form className="d-none d-md-block ml-5 " style={{ maxWidth: '280px', width: '100%' }}>
          <div className="input-group">
            <input
              type="text"
              className="form-control border-danger"
              placeholder="Search..."
              style={{ borderRadius: '30px 0 0 30px' }}
            />
            <button className="btn btn-danger" type="submit" style={{ borderRadius: '0 30px 30px 0' }}>
              <i className="bi bi-search"></i>
            </button>
          </div>
        </form>

        {/* Navbar Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <div className="d-flex flex-wrap align-items-center justify-content-end w-100 gap-4 mt-3 mt-lg-0">

            {/* Nav Links */}
            <ul className="navbar-nav flex-row gap-5 mr-5">
              <li className="nav-item">
                <Link className="nav-link text-light fw-semibold" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light fw-semibold" to="/shop">Shop</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light fw-semibold" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light fw-semibold" to="/contact">Contact</Link>
              </li>
             
              
             
            </ul>

            {/* Icons & Login */}
            <div className="d-flex align-items-center gap-4">
              <Link to="/cart" className="text-light fs-5">
                <i className="bi bi-cart-fill"></i>
              </Link>

              <Link to="/profile" className="text-light fs-5">
                <i className="bi bi-person-circle"></i>
              </Link>

              <div className="dropdown">
                <button
                  className="btn btn-outline-light btn-sm dropdown-toggle"
                  type="button"
                  id="loginDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Login
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="loginDropdown">
                  <li className="dropdown-item small d-flex justify-content-between">
                    <span>New customer?</span>
                    <Link to="/signup" className="text-primary ms-2">Sign Up</Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link to="/login" className="dropdown-item">Login</Link></li>
                  <li><Link to="/orders" className="dropdown-item">Orders</Link></li>
                </ul>
              </div>
            </div>

          </div>
        </div>

      </div>
    </nav>
  );
};

export default Header;















