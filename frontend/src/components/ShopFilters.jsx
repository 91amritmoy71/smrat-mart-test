// client/src/components/ShopFilters.jsx
import React from 'react';
import { Form } from 'react-bootstrap';

const ShopFilters = ({ filters, setFilters }) => {
  const categories = ['Mobiles', 'Watches', 'Laptops', 'Airbuds', 'Headsets', 'Speakers'];
  const brands = ['Noise', 'Boat', 'Fire-Boltt', 'Samsung', 'Nothing', 'Realme', 'Oneplus'];
  
  const handlePriceChange = (e, index) => {
    const newPriceRange = [...filters.priceRange];
    newPriceRange[index] = parseInt(e.target.value);
    setFilters({ ...filters, priceRange: newPriceRange });
  };

  return (
    <div className="shop-filters">
      <h5 className="filter-title">Filters</h5>
      
      <div className="filter-section">
        <h6>CATEGORIES</h6>
        <Form>
          {categories.map(category => (
            <Form.Check 
              key={category}
              type="radio"
              label={category}
              name="category"
              id={`category-${category}`}
              checked={filters.category === category}
              onChange={() => setFilters({ ...filters, category })}
            />
          ))}
        </Form>
      </div>
      
      <div className="filter-section">
        <h6>PRICE</h6>
        <div className="price-range">
          <input 
            type="range" 
            min="500" 
            max="20000" 
            value={filters.priceRange[0]} 
            onChange={(e) => handlePriceChange(e, 0)}
          />
          
          <div className="price-values">
             ₹{filters.priceRange[0].toLocaleString('en-IN')} - ₹{filters.priceRange[1].toLocaleString('en-IN')}
        </div>
    </div>
</div>
      
      <div className="filter-section">
        <h6>BRAND</h6>
        <Form>
          {brands.map(brand => (
            <Form.Check 
              key={brand}
              type="checkbox"
              label={brand}
              id={`brand-${brand}`}
              checked={filters.brand === brand}
              onChange={() => setFilters({ ...filters, brand })}
            />
          ))}
        </Form>
      </div>
      
      <div className="filter-section">
        <h6>CUSTOMER RATINGS</h6>
        <Form>
          {[4, 3, 2, 1].map(rating => (
            <Form.Check 
              key={rating}
              type="radio"
              label={`${rating} ★ & above`}
              name="rating"
              id={`rating-${rating}`}
              checked={filters.rating === rating}
              onChange={() => setFilters({ ...filters, rating })}
            />
          ))}
        </Form>
      </div>
    </div>
  );
};

export default ShopFilters;