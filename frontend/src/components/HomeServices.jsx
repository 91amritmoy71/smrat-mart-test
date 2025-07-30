// src/components/HomeServices.jsx

import React from 'react';

const services = [
  {
    icon: 'bi-truck',
    title: 'Free Delivery',
    desc: 'On orders over ₹999',
    color: 'text-warning',
  },
  {
    icon: 'bi-arrow-counterclockwise',
    title: 'Easy Returns',
    desc: '7-day return policy',
    color: 'text-success',
  },
  {
    icon: 'bi-patch-check-fill',
    title: 'Premium Quality',
    desc: 'Original products only',
    color: 'text-primary',
  },
  {
    icon: 'bi-headset',
    title: '24/7 Support',
    desc: 'Always here to help',
    color: 'text-danger',
  },
  {
    icon: 'bi-shield-lock',
    title: 'Secure Payment',
    desc: '100% safe & secure',
    color: 'text-info',
  },
  {
    icon: 'bi-lightning-charge-fill',
    title: 'Fast Shipping',
    desc: 'Same day dispatch',
    color: 'text-warning',
  },
];

const HomeServices = () => {
  return (
    <div className="container py-4 ">
      <div className="row text-center">
        {services.map((service, index) => (
          <div key={index} className="col-6 col-md-4 col-lg-2 mb-0">
            <div className="p-2 border rounded bg-light h-100">
              <i className={`bi ${service.icon} fs-4 ${service.color}`}></i>
              <h6 className="mt-0 fw-semibold">{service.title}</h6>
              <p className="text-muted small mb-0">{service.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeServices;

