import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, Badge, 
  Form, InputGroup, Modal, Alert, Pagination 
} from 'react-bootstrap';
import { 
  FiSearch, FiEdit, FiTrash2, FiEye, FiUserPlus, 
  FiFilter, FiDownload, FiRefreshCw 
} from 'react-icons/fi';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(''); // 'view', 'edit', 'delete'
  const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, filterRole, filterStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(filterRole && { role: filterRole }),
        ...(filterStatus && { isActive: filterStatus })
      });

      const response = await axios.get(`http://localhost:5600/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUsers(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalType('view');
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      phone: user.phone || '',
      address: user.address || {}
    });
    setModalType('edit');
    setShowModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setModalType('delete');
    setShowModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5600/api/admin/users/${selectedUser._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setShowModal(false);
        fetchUsers();
        alert('User updated successfully');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeactivateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:5600/api/admin/users/${selectedUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setShowModal(false);
        fetchUsers();
        alert('User deactivated successfully');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to deactivate user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    const matchesStatus = !filterStatus || user.isActive.toString() === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role) => {
    return role === 'ADMIN' ? 
      <Badge bg="danger">Admin</Badge> : 
      <Badge bg="primary">User</Badge>;
  };

  const getStatusBadge = (isActive) => {
    return isActive ? 
      <Badge bg="success">Active</Badge> : 
      <Badge bg="secondary">Inactive</Badge>;
  };

  const UserModal = () => (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {modalType === 'view' && 'User Details'}
          {modalType === 'edit' && 'Edit User'}
          {modalType === 'delete' && 'Confirm Deactivation'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalType === 'view' && selectedUser && (
          <Row>
            <Col md={6}>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {getRoleBadge(selectedUser.role)}</p>
              <p><strong>Status:</strong> {getStatusBadge(selectedUser.isActive)}</p>
            </Col>
            <Col md={6}>
              <p><strong>Phone:</strong> {selectedUser.phone || 'Not provided'}</p>
              <p><strong>Created:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              <p><strong>Last Updated:</strong> {new Date(selectedUser.updatedAt).toLocaleDateString()}</p>
            </Col>
          </Row>
        )}

        {modalType === 'edit' && (
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={formData.role || ''}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="GENERAL">User</option>
                    <option value="ADMIN">Admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.isActive?.toString() || ''}
                    onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </Form.Group>
          </Form>
        )}

        {modalType === 'delete' && selectedUser && (
          <Alert variant="warning">
            <p>Are you sure you want to deactivate user <strong>{selectedUser.name}</strong>?</p>
            <p>This action will set the user status to inactive. The user will not be able to login.</p>
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        {modalType === 'edit' && (
          <Button variant="primary" onClick={handleUpdateUser}>
            Save Changes
          </Button>
        )}
        {modalType === 'delete' && (
          <Button variant="danger" onClick={handleDeactivateUser}>
            Deactivate User
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">User Management</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={fetchUsers}>
            <FiRefreshCw className="me-1" />
            Refresh
          </Button>
          <Button variant="success">
            <FiUserPlus className="me-1" />
            Add User
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="GENERAL">User</option>
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

      {/* Users Table */}
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
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{getStatusBadge(user.isActive)}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="action-buttons">
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => handleViewUser(user)}
                        >
                          <FiEye />
                        </Button>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <FiEdit />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <FiTrash2 />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

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

      {/* User Modal */}
      <UserModal />
    </Container>
  );
};

export default UserManagement;