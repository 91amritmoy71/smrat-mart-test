// src/components/CategoryGrid.jsx

import React from 'react';
import { Link } from 'react-router-dom';

import mobileImg from '../assets/categories/mobile.jpg';
import watchImg from '../assets/categories/watches.jpg';
import laptopImg from '../assets/categories/laptop.jpg';
import airbudsImg from '../assets/categories/airbuds.jpg';
import headsetImg from '../assets/categories/headset.jpg';
import speakerImg from '../assets/categories/speakers.jpg';

import './CategoryGrid.css';

const categories = [
  { name: 'Mobiles', image: mobileImg, link: '/category/mobiles' },
  { name: 'Watches', image: watchImg, link: '/category/watches' },
  { name: 'Laptops', image: laptopImg, link: '/category/laptops' },
  { name: 'Airbuds', image: airbudsImg, link: '/category/airbuds' },
  { name: 'Headsets', image: headsetImg, link: '/category/headsets' },
  { name: 'Speakers', image: speakerImg, link: '/category/speakers' },
];

const CategoryGrid = () => {
  return (
    <div className="container my-4">
      <h2 className="text-center fw-semibold mb-5 text-dark">Top Categories</h2>
      <div className="row justify-content-center g-4">
        {categories.map((cat, idx) => (
          <div className="col-6 col-md-4 col-lg-2" key={idx}>
            <div className="category-card text-center p-3">
              <div className="category-img-wrapper mb-2">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="img-fluid category-img"
                />
              </div>
              <h6 className="fw-semibold text-dark">{cat.name}</h6>
              <Link to={cat.link} className="btn btn-outline-danger btn-sm mt-2">
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;




