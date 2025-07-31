import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, Badge, 
  Form, InputGroup, Modal, Alert, Pagination, Image 
} from 'react-bootstrap';
import { 
  FiSearch, FiEdit, FiTrash2, FiEye, FiPlus, 
  FiFilter, FiDownload, FiRefreshCw, FiPackage 
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState(''); // 'view', 'delete'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const categories = [
    'Mobile', 'Laptop', 'Tablet', 'Accessories', 'Audio', 
    'Camera', 'Gaming', 'Smart Home', 'Wearables', 'Other'
  ];

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, filterCategory, filterStatus]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(filterCategory && { category: filterCategory }),
        ...(filterStatus && { isActive: filterStatus })
      });

      const response = await axios.get(`http://localhost:5600/api/admin/products?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setProducts(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setModalType('view');
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    navigate(`/admin/products/edit/${product._id}`);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setModalType('delete');
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:5600/api/admin/products/${selectedProduct._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setShowModal(false);
        fetchProducts();
        alert('Product deleted successfully');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? 
      <Badge bg="success">Active</Badge> : 
      <Badge bg="secondary">Inactive</Badge>;
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return <Badge bg="danger">Out of Stock</Badge>;
    if (stock <= 10) return <Badge bg="warning">Low Stock</Badge>;
    return <Badge bg="success">In Stock</Badge>;
  };

  const ProductModal = () => (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {modalType === 'view' && 'Product Details'}
          {modalType === 'delete' && 'Confirm Deletion'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalType === 'view' && selectedProduct && (
          <Row>
            <Col md={4}>
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                <Image 
                  src={`http://localhost:5600${selectedProduct.images[0].url}`} 
                  alt={selectedProduct.name}
                  className="img-fluid rounded"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
              ) : (
                <div className="bg-light d-flex align-items-center justify-content-center rounded" 
                     style={{ height: '200px' }}>
                  <FiPackage size={48} className="text-muted" />
                </div>
              )}
            </Col>
            <Col md={8}>
              <h5>{selectedProduct.name}</h5>
              <p className="text-muted">{selectedProduct.description}</p>
              
              <Row className="mb-2">
                <Col sm={4}><strong>Price:</strong></Col>
                <Col sm={8}>₹{selectedProduct.price}</Col>
              </Row>
              
              <Row className="mb-2">
                <Col sm={4}><strong>Category:</strong></Col>
                <Col sm={8}>{selectedProduct.category}</Col>
              </Row>
              
              <Row className="mb-2">
                <Col sm={4}><strong>Brand:</strong></Col>
                <Col sm={8}>{selectedProduct.brand}</Col>
              </Row>
              
              <Row className="mb-2">
                <Col sm={4}><strong>SKU:</strong></Col>
                <Col sm={8}>{selectedProduct.sku}</Col>
              </Row>
              
              <Row className="mb-2">
                <Col sm={4}><strong>Stock:</strong></Col>
                <Col sm={8}>
                  {selectedProduct.stock} {getStockBadge(selectedProduct.stock)}
                </Col>
              </Row>
              
              <Row className="mb-2">
                <Col sm={4}><strong>Status:</strong></Col>
                <Col sm={8}>{getStatusBadge(selectedProduct.isActive)}</Col>
              </Row>
              
              <Row className="mb-2">
                <Col sm={4}><strong>Featured:</strong></Col>
                <Col sm={8}>
                  {selectedProduct.isFeatured ? 
                    <Badge bg="info">Yes</Badge> : 
                    <Badge bg="secondary">No</Badge>
                  }
                </Col>
              </Row>
              
              <Row className="mb-2">
                <Col sm={4}><strong>Created:</strong></Col>
                <Col sm={8}>{new Date(selectedProduct.createdAt).toLocaleDateString()}</Col>
              </Row>
            </Col>
          </Row>
        )}

        {modalType === 'delete' && selectedProduct && (
          <Alert variant="danger">
            <p>Are you sure you want to delete product <strong>{selectedProduct.name}</strong>?</p>
            <p>This action cannot be undone.</p>
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        {modalType === 'delete' && (
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete Product
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Product Management</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={fetchProducts}>
            <FiRefreshCw className="me-1" />
            Refresh
          </Button>
          <Button 
            variant="success"
            onClick={() => navigate('/admin/products/create')}
          >
            <FiPlus className="me-1" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FiSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button variant="outline-secondary" className="w-100">
                <FiDownload className="me-1" />
                Export
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Products Table */}
      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center p-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <td>
                        {product.images && product.images.length > 0 ? (
                          <Image 
                            src={`http://localhost:5600${product.images[0].url}`}
                            alt={product.name}
                            width="50"
                            height="50"
                            className="rounded object-fit-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="bg-light d-flex align-items-center justify-content-center rounded" 
                               style={{ width: '50px', height: '50px' }}>
                            <FiPackage className="text-muted" />
                          </div>
                        )}
                      </td>
                      <td>
                        <div>
                          <div className="fw-bold">{product.name}</div>
                          <small className="text-muted">{product.sku}</small>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>₹{product.price}</td>
                      <td>
                        <div>
                          {product.stock}
                          <br />
                          {getStockBadge(product.stock)}
                        </div>
                      </td>
                      <td>{getStatusBadge(product.isActive)}</td>
                      <td className="action-buttons">
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => handleViewProduct(product)}
                        >
                          <FiEye />
                        </Button>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <FiEdit />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          <FiTrash2 />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {products.length === 0 && !loading && (
                <div className="text-center p-4">
                  <FiPackage size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No products found</h5>
                  <p className="text-muted">Start by adding your first product</p>
                  <Button 
                    variant="primary"
                    onClick={() => navigate('/admin/products/create')}
                  >
                    <FiPlus className="me-1" />
                    Add Product
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.Prev 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Product Modal */}
      <ProductModal />
    </Container>
  );
};

export default ProductManagement;