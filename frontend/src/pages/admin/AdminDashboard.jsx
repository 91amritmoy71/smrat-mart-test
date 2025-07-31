import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert } from 'react-bootstrap';
import { FiUsers, FiPackage, FiShoppingCart, FiAlertTriangle } from 'react-icons/fi';
import { BiTrendingUp, BiUser, BiBox } from 'react-icons/bi';
import axios from 'axios';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5600/api/admin/dashboard/overview', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="text-muted small mb-1">{title}</div>
            <div className={`h4 mb-0 text-${color}`}>{value}</div>
            {subtitle && <div className="text-muted small">{subtitle}</div>}
          </div>
          <div className={`text-${color}`}>
            <Icon size={24} />
          </div>
        </div>
        {trend && (
          <div className="mt-2">
            <small className={`text-${trend > 0 ? 'success' : 'danger'}`}>
              <BiTrendingUp size={14} />
              {trend > 0 ? '+' : ''}{trend}% from last month
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <Container fluid className="p-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="p-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Admin Dashboard</h2>
        <Badge bg="success" className="px-3 py-2">
          <FiUsers className="me-1" />
          Admin Panel
        </Badge>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <StatCard
            icon={FiUsers}
            title="Total Users"
            value={dashboardData?.users?.total || 0}
            subtitle={`${dashboardData?.users?.active || 0} active`}
            color="primary"
            trend={12}
          />
        </Col>
        <Col md={3}>
          <StatCard
            icon={BiUser}
            title="Admin Users"
            value={dashboardData?.users?.admins || 0}
            subtitle="Administrators"
            color="info"
          />
        </Col>
        <Col md={3}>
          <StatCard
            icon={FiPackage}
            title="Total Products"
            value={dashboardData?.products?.total || 0}
            subtitle={`${dashboardData?.products?.active || 0} active`}
            color="success"
            trend={8}
          />
        </Col>
        <Col md={3}>
          <StatCard
            icon={FiAlertTriangle}
            title="Out of Stock"
            value={dashboardData?.products?.outOfStock || 0}
            subtitle="Products"
            color="warning"
          />
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="bg-primary text-white">
              <FiUsers className="me-2" />
              Quick Actions - Users
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => window.location.href = '/admin/users'}
                >
                  <BiUser className="me-2" />
                  Manage Users
                </button>
                <button 
                  className="btn btn-outline-info"
                  onClick={() => window.location.href = '/admin/users/create'}
                >
                  <FiUsers className="me-2" />
                  Create New Admin
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="bg-success text-white">
              <FiPackage className="me-2" />
              Quick Actions - Products
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-outline-success"
                  onClick={() => window.location.href = '/admin/products'}
                >
                  <BiBox className="me-2" />
                  Manage Products
                </button>
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => window.location.href = '/admin/products/create'}
                >
                  <FiPackage className="me-2" />
                  Add New Product
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row className="g-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">System Overview</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6 className="text-muted">User Statistics</h6>
                  <ul className="list-unstyled">
                    <li>Total Users: <strong>{dashboardData?.users?.total || 0}</strong></li>
                    <li>Active Users: <strong>{dashboardData?.users?.active || 0}</strong></li>
                    <li>Admin Users: <strong>{dashboardData?.users?.admins || 0}</strong></li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6 className="text-muted">Product Statistics</h6>
                  <ul className="list-unstyled">
                    <li>Total Products: <strong>{dashboardData?.products?.total || 0}</strong></li>
                    <li>Active Products: <strong>{dashboardData?.products?.active || 0}</strong></li>
                    <li>Out of Stock: <strong className="text-warning">{dashboardData?.products?.outOfStock || 0}</strong></li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;