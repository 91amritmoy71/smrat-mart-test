import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products/featured')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Featured Products</h2>
      <div className="row">
        {products.map(product => (
          <div className="col-md-4 mb-4" key={product._id}>
            <div className="card h-100">
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                className="card-img-top"
                style={{ height: '250px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5>{product.name}</h5>
                <p>{product.description}</p>
                <h6>₹{product.price}</h6>
                <span className="badge bg-info">{product.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;

