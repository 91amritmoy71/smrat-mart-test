import React from 'react';
import { Button } from 'react-bootstrap';
import { FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AdminAccess = () => {
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Only show admin access if user is logged in and is an admin
  if (!user.role || user.role !== 'ADMIN') {
    return null;
  }
  
  return (
    <Button 
      variant="outline-danger" 
      size="sm"
      onClick={() => navigate('/admin/dashboard')}
      className="ms-2"
    >
      <FiSettings className="me-1" />
      Admin Panel
    </Button>
  );
};

export default AdminAccess;