import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import ShopFilters from './ShopFilters';
import ProductCard from './Productcard';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popularity');

  const [filters, setFilters] = useState({
    category: '',
    priceRange: [500, 20000],
    brand: '',
    rating: 0
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let results = [...products];
    
    // Apply filters
    if (filters.category) {
      results = results.filter(p => p.category === filters.category);
    }
    if (filters.brand) {
      results = results.filter(p => p.brand === filters.brand);
    }
    if (filters.rating > 0) {
      results = results.filter(p => p.rating >= filters.rating);
    }
    results = results.filter(p => 
      p.price >= filters.priceRange[0] && 
      p.price <= filters.priceRange[1]
    );

    // Apply sorting
    switch(sortBy) {
      case 'price-low-high':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default: // popularity
        results.sort((a, b) => b.popularity - a.popularity);
    }

    setFilteredProducts(results);
  }, [filters, products, sortBy]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <Container fluid className="px-3 py-4">
      <Row>
        {/* Filters Sidebar */}
        <Col md={3} className="pe-4">
          <ShopFilters filters={filters} setFilters={setFilters} />
        </Col>

        {/* Products Grid */}
        <Col md={9}>
          <div className="d-flex justify-content-between mb-4">
            <h4>All Products</h4>
            <select 
              className="form-select w-auto" 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popularity">Popularity</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <p>No products found. Try adjusting your filters.</p>
              <button 
                className="btn btn-outline-primary"
                onClick={() => setFilters({
                  category: '',
                  priceRange: [500, 20000],
                  brand: '',
                  rating: 0
                })}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Shop;