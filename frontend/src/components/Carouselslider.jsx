import React from 'react';
import banner1 from '../assets/mainbanner.png';
import banner2 from '../assets/laptop.jpg';

const Carouselslider = () => {
  return (
    <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={banner1} className="d-block w-100" alt="mainbanner 1" />
        </div>
       
        <div className="carousel-item">
          <img src={banner2} className="d-block w-100" alt="laptops" />
        </div>
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>

      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carouselslider;
