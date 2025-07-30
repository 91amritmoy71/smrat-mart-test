// src/components/ProductUploadForm.jsx

import React, { useState } from 'react';
import axios from 'axios';

const ProductUploadForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isFeatured: false, // default: not featured
  });
  const [image, setImage] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => {
    setImage(e.target.files[0]);
  };

  const handleCheckboxChange = e => {
    setFormData(prev => ({
      ...prev,
      isFeatured: e.target.checked,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!image) {
      setErrorMsg('Please select an image.');
      return;
    }

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    data.append('image', image);

    try {
      const res = await axios.post('http://localhost:5000/api/products/create', data);
      if (res.status === 201) {
        setSuccessMsg('Product added successfully!');
        setErrorMsg('');
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          isFeatured: false
        });
        setImage(null);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Something went wrong.');
      setSuccessMsg('');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="text-center mb-4 fw-bold">Add New Product</h3>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Mobiles">Mobiles</option>
            <option value="Watches">Watches</option>
            <option value="Airbuds">Airbuds</option>
            <option value="Headset">Headset</option>
            <option value="Laptop">Laptop</option>
            <option value="Speaker">Speaker</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Product Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        {/* ✅ Featured Checkbox */}
        <div className="form-check mb-4">
          <input
            type="checkbox"
            className="form-check-input"
            id="isFeatured"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="isFeatured">
            Feature this product on homepage
          </label>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Upload Product
        </button>
      </form>
    </div>
  );
};

export default ProductUploadForm;

