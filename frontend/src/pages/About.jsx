import React from 'react';
import logo from '../assets/logo.png';

const About = () => {
  return (
    <div className="container py-5">
      {/* Heading */}
      <h2 className="text-center text-danger mb-4">About Us</h2>

      {/* Company Intro */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6 mb-3 mb-md-0">
          <img src={logo} alt="Smart Mart" height="160" />
        </div>
        <div className="col-md-6">
          <h4 className="text-dark">Welcome to Smart Mart</h4>
          <p className="text-muted">
            At Smart Mart, we are committed to delivering high-quality products and outstanding customer service.
            We bring the latest and most trusted electronics, fashion, and accessories to your doorstep.
            Our mission is to simplify your shopping experience with convenience, affordability, and trust.
          </p>
        </div>
      </div>

      {/* Mission and Vision Cards */}
      <div className="row text-center">
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow h-100">
            <div className="card-body">
              <h5 className="card-title text-danger">Our Mission</h5>
              <p className="card-text text-muted">
                To revolutionize online shopping by offering best-in-class products, fast delivery,
                and seamless support — all while keeping customers at the center of everything we do.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow h-100">
            <div className="card-body">
              <h5 className="card-title text-danger">Our Vision</h5>
              <p className="card-text text-muted">
                To become the most trusted online marketplace for every household by delivering value,
                innovation, and satisfaction through every interaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
