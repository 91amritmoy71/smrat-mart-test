import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Offcanvas, Badge, Button } from 'react-bootstrap';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiPackage, FiSettings, FiLogOut, 
  FiMenu, FiDashboard, FiShoppingBag, FiUser 
} from 'react-icons/fi';
import './AdminLayout.css';

const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated and is admin
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'ADMIN') {
        alert('Access denied. Admin privileges required.');
        navigate('/');
        return;
      }
      setUser(parsedUser);
    } catch (error) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: FiDashboard,
      label: 'Dashboard',
      badge: null
    },
    {
      path: '/admin/users',
      icon: FiUsers,
      label: 'Users',
      badge: null
    },
    {
      path: '/admin/products',
      icon: FiPackage,
      label: 'Products',
      badge: null
    },
    {
      path: '/admin/orders',
      icon: FiShoppingBag,
      label: 'Orders',
      badge: 'Coming Soon'
    },
    {
      path: '/admin/settings',
      icon: FiSettings,
      label: 'Settings',
      badge: null
    }
  ];

  const SidebarContent = ({ mobile = false }) => (
    <div className={`admin-sidebar ${mobile ? 'mobile' : ''}`}>
      {/* Logo */}
      <div className="sidebar-header">
        <h4 className="text-white mb-0">
          <FiDashboard className="me-2" />
          Smart Mart Admin
        </h4>
      </div>

      {/* Navigation */}
      <Nav className="flex-column">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Nav.Link
              key={item.path}
              onClick={() => {
                navigate(item.path);
                if (mobile) setShowSidebar(false);
              }}
              className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="me-2" size={18} />
              {item.label}
              {item.badge && (
                <Badge bg="warning" className="ms-auto text-dark">
                  {item.badge}
                </Badge>
              )}
            </Nav.Link>
          );
        })}
      </Nav>

      {/* User Info */}
      {user && (
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="d-flex align-items-center mb-2">
              <FiUser className="me-2" />
              <div>
                <div className="text-white small">{user.name}</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                  {user.email}
                </div>
              </div>
            </div>
            <Button
              variant="outline-light"
              size="sm"
              onClick={handleLogout}
              className="w-100"
            >
              <FiLogOut className="me-1" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Desktop Sidebar */}
      <div className="d-none d-lg-block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start">
        <Offcanvas.Body className="p-0">
          <SidebarContent mobile />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Navigation Bar */}
        <Navbar bg="white" className="border-bottom shadow-sm">
          <Container fluid>
            <Button
              variant="outline-secondary"
              className="d-lg-none me-2"
              onClick={() => setShowSidebar(true)}
            >
              <FiMenu />
            </Button>
            
            <Navbar.Brand className="d-lg-none">
              Smart Mart Admin
            </Navbar.Brand>

            <Nav className="ms-auto">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => navigate('/')}
                className="me-2"
              >
                <FiHome className="me-1" />
                Back to Store
              </Button>
              
              <div className="d-flex align-items-center">
                <span className="text-muted me-2">Welcome, {user.name}</span>
                <Badge bg="success">Admin</Badge>
              </div>
            </Nav>
          </Container>
        </Navbar>

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;