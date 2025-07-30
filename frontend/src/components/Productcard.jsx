// client/src/components/ProductCard.jsx
import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Card className="product-card">
      <Link to={`/product/${product._id}`}>
        <Card.Img variant="top" src={product.image} />
      </Link>
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
       // Update the price display in ProductCard.jsx
    <div className="product-price">
     <span className="current-price">₹{product.price.toLocaleString('en-IN')}</span>
        {product.originalPrice && (
    <span className="original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
    )}
    {product.discount && (
        <span className="discount">{product.discount}% off</span>
    )}
    </div>
        <div className="product-badge">
          {product.assured && <span className="assured-badge">Assured</span>}
        </div>
        <div className="product-offer">
          {product.exchangeOffer && (
            <span className="exchange-offer">{product.exchangeOffer}</span>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;