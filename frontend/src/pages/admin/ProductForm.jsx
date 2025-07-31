import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, Alert, 
  Image, Badge, InputGroup, Spinner 
} from 'react-bootstrap';
import { FiSave, FiArrowLeft, FiUpload, FiX, FiPlus } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ProductForm = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(productId);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [specifications, setSpecifications] = useState([{ key: '', value: '' }]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    subcategory: '',
    brand: '',
    model: '',
    sku: '',
    stock: '',
    isFeatured: false,
    isActive: true,
    tags: '',
    weight: '',
    warranty: ''
  });

  const categories = [
    'Mobile', 'Laptop', 'Tablet', 'Accessories', 'Audio', 
    'Camera', 'Gaming', 'Smart Home', 'Wearables', 'Other'
  ];

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [productId, isEdit]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5600/api/admin/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const product = response.data.data;
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          originalPrice: product.originalPrice || '',
          category: product.category || '',
          subcategory: product.subcategory || '',
          brand: product.brand || '',
          model: product.model || '',
          sku: product.sku || '',
          stock: product.stock || '',
          isFeatured: product.isFeatured || false,
          isActive: product.isActive !== undefined ? product.isActive : true,
          tags: product.tags ? product.tags.join(', ') : '',
          weight: product.weight || '',
          warranty: product.warranty ? JSON.stringify(product.warranty) : ''
        });

        // Set specifications
        if (product.specifications) {
          const specsArray = Object.entries(product.specifications).map(([key, value]) => ({
            key, value
          }));
          setSpecifications(specsArray.length > 0 ? specsArray : [{ key: '', value: '' }]);
        }

        // Set existing images
        if (product.images && product.images.length > 0) {
          setImagePreviews(product.images.map(img => `http://localhost:5600${img.url}`));
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpecification = (index) => {
    const newSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecs.length > 0 ? newSpecs : [{ key: '', value: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();

      // Add form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      // Add specifications
      const specsObject = {};
      specifications.forEach(spec => {
        if (spec.key && spec.value) {
          specsObject[spec.key] = spec.value;
        }
      });
      if (Object.keys(specsObject).length > 0) {
        submitData.append('specifications', JSON.stringify(specsObject));
      }

      // Add images (only for new uploads)
      if (imageFiles.length > 0) {
        imageFiles.forEach(file => {
          submitData.append('images', file);
        });
      }

      const url = isEdit 
        ? `http://localhost:5600/api/admin/products/${productId}`
        : 'http://localhost:5600/api/admin/products';
      
      const method = isEdit ? 'put' : 'post';
      
      const response = await axios[method](url, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccess(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
        setTimeout(() => {
          navigate('/admin/products');
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <Container fluid className="p-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          {isEdit ? 'Edit Product' : 'Create Product'}
        </h2>
        <Button 
          variant="outline-secondary"
          onClick={() => navigate('/admin/products')}
        >
          <FiArrowLeft className="me-1" />
          Back to Products
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Form */}
      <Form onSubmit={handleSubmit}>
        <Row>
          {/* Basic Information */}
          <Col md={8}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Basic Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Product Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter product name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>SKU *</Form.Label>
                      <Form.Control
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter SKU"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product description"
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category *</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Brand *</Form.Label>
                      <Form.Control
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter brand"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Model</Form.Label>
                      <Form.Control
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        placeholder="Enter model"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Subcategory</Form.Label>
                      <Form.Control
                        type="text"
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleInputChange}
                        placeholder="Enter subcategory"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tags</Form.Label>
                      <Form.Control
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="Enter tags separated by commas"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Pricing and Inventory */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Pricing & Inventory</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price *</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>₹</InputGroup.Text>
                        <Form.Control
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Original Price</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>₹</InputGroup.Text>
                        <Form.Control
                          type="number"
                          name="originalPrice"
                          value={formData.originalPrice}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Stock Quantity *</Form.Label>
                      <Form.Control
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                        min="0"
                        placeholder="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Weight (kg)</Form.Label>
                      <Form.Control
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Specifications */}
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Specifications</h5>
                <Button variant="outline-primary" size="sm" onClick={addSpecification}>
                  <FiPlus className="me-1" />
                  Add Specification
                </Button>
              </Card.Header>
              <Card.Body>
                {specifications.map((spec, index) => (
                  <Row key={index} className="mb-3">
                    <Col md={4}>
                      <Form.Control
                        type="text"
                        placeholder="Specification name"
                        value={spec.key}
                        onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        placeholder="Specification value"
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                      />
                    </Col>
                    <Col md={2}>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeSpecification(index)}
                        disabled={specifications.length === 1}
                      >
                        <FiX />
                      </Button>
                    </Col>
                  </Row>
                ))}
              </Card.Body>
            </Card>
          </Col>

          {/* Settings and Images */}
          <Col md={4}>
            {/* Product Settings */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Product Settings</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="isActive"
                    label="Active Product"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="isFeatured"
                    label="Featured Product"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Warranty Information</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleInputChange}
                    placeholder="Enter warranty details"
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Product Images */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Product Images</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Images</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <Form.Text className="text-muted">
                    Upload up to 5 images. First image will be the primary image.
                  </Form.Text>
                </Form.Group>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div>
                    <h6>Image Previews:</h6>
                    <Row>
                      {imagePreviews.map((preview, index) => (
                        <Col xs={6} key={index} className="mb-2">
                          <div className="position-relative">
                            <Image
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="img-fluid rounded"
                              style={{ height: '100px', objectFit: 'cover' }}
                            />
                            {index === 0 && (
                              <Badge 
                                bg="primary" 
                                className="position-absolute top-0 start-0 m-1"
                              >
                                Primary
                              </Badge>
                            )}
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Submit Button */}
            <Card>
              <Card.Body>
                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" className="me-2" />
                    ) : (
                      <FiSave className="me-2" />
                    )}
                    {isEdit ? 'Update Product' : 'Create Product'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default ProductForm;