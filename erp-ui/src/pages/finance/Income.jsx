import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Modal, Button, Form, Badge, Tabs, Tab } from 'react-bootstrap';
import IncomeForm from '../../components/finance/IncomeForm';
import TransactionTable from '../../components/finance/TransactionTable';
import financeAPI from '../../services/financeAPI';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingIncome, setEditingIncome] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Income categories from Dashboard.jsx
  const incomeCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'software_licensing', label: 'Software Licensing Fees' },
    { value: 'maintenance_services', label: 'Maintenance & Support Services' },
    { value: 'implementation', label: 'Implementation Services' },
    { value: 'consulting', label: 'Financial Consulting' },
    { value: 'cloud_services', label: 'Cloud & SaaS Revenue' },
    { value: 'professional_services', label: 'Professional Services' },
    { value: 'partner_revenue', label: 'Partner Channel Revenue' },
    { value: 'training', label: 'Training & Certification' },
    { value: 'subscription', label: 'Subscription Revenue' },
    { value: 'api_services', label: 'API & Integration Services' },
    { value: 'other', label: 'Other Income' }
  ];
  
  // Fetch incomes from API
  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const response = await financeAPI.getIncomes();
      setIncomes(response);
      setError('');
    } catch (err) {
      console.error('Failed to fetch incomes:', err);
      setError('Failed to load income data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchIncomes();
  }, []);
  
  // Handle income creation - UPDATED
  const handleAddIncome = async (formData) => {
    try {
      await financeAPI.addIncome(formData);
      fetchIncomes(); // Refresh data
      setShowForm(false); // Hide form after successful submission
      
      // Show success message
      setError(''); // Clear any previous errors
      // You can add a success alert/toast here if desired
      
    } catch (err) {
      console.error('Failed to add income:', err);
      setError('Failed to add income. Please check your data and try again.');
      throw err; // Let the form component handle the error
    }
  };
  
  // Handle income update
  const handleUpdateIncome = async (formData) => {
    try {
      await financeAPI.updateIncome(editingIncome.id, formData);
      setEditingIncome(null);
      fetchIncomes(); // Refresh data
    } catch (err) {
      console.error('Failed to update income:', err);
      throw err; // Let the form component handle the error
    }
  };
  
  // Handle income deletion
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await financeAPI.deleteIncome(deleteId);
      fetchIncomes(); // Refresh data
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Failed to delete income:', err);
      setError('Failed to delete the income. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };
  
  // Filter transactions
  const getFilteredTransactions = () => {
    if (!incomes || incomes.length === 0) return [];
    
    let filtered = [...incomes];
    
    // Apply category filter
    if (filter !== 'all') {
      filtered = filtered.filter(income => income.category === filter);
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(income => 
        income.description.toLowerCase().includes(query) ||
        income.category.toLowerCase().includes(query) ||
        income.amount.toString().includes(query)
      );
    }
    
    return filtered;
  };
  
  const filteredIncomes = getFilteredTransactions();
  
  return (
    <Container fluid className="py-4 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Income Management</h2>
          <p className="text-muted mb-0">Manage your revenue sources and track all incoming funds</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => {
            setEditingIncome(null); // Clear any editing state
            setShowForm(!showForm); // Toggle form visibility
          }}
        >
          {showForm ? (
            <>
              <i className="fas fa-chevron-up me-1"></i>
              Hide Form
            </>
          ) : (
            <>
              <i className="fas fa-plus me-1"></i>
              Add New Income
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {/* Form Section - Collapsible */}
      {(showForm || editingIncome) && (
        <Card className="shadow-sm mb-4 border-0">
          <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
            <h5 className="mb-0">{editingIncome ? 'Edit Income Record' : 'Add New Income Record'}</h5>
            <div>
              {editingIncome && (
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  className="me-2"
                  onClick={() => setEditingIncome(null)}
                >
                  <i className="fas fa-times me-1"></i>
                  Cancel Edit
                </Button>
              )}
              {!editingIncome && (
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => setShowForm(false)}
                >
                  <i className="fas fa-times me-1"></i>
                  Close
                </Button>
              )}
            </div>
          </Card.Header>
          <Card.Body className="p-4">
            <IncomeForm 
              initialData={editingIncome} 
              onSubmit={editingIncome ? handleUpdateIncome : handleAddIncome}
              onCancel={() => editingIncome ? setEditingIncome(null) : setShowForm(false)}
            />
          </Card.Body>
        </Card>
      )}
      
      {/* Filter and Search Controls */}
      <Card className="shadow-sm mb-4 border-0">
        <Card.Body className="py-3">
          <Row className="align-items-center g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="mb-1 small fw-bold">
                  <i className="fas fa-filter me-1"></i> Filter by Category
                </Form.Label>
                <Form.Select 
                  size="sm"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  {incomeCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group>
                <Form.Label className="mb-1 small fw-bold">
                  <i className="fas fa-search me-1"></i> Search Transactions
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by description, category, or amount..."
                  size="sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Form.Group>
            </Col>
            
            <Col md={2} className="text-md-end mt-md-3">
              <Badge bg="info">
                {filteredIncomes.length} {filteredIncomes.length === 1 ? 'Record' : 'Records'}
              </Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Table Section */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white py-3">
          <h5 className="mb-0">Income Transactions</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3 text-muted">Loading income transactions...</p>
            </div>
          ) : filteredIncomes.length > 0 ? (
            <TransactionTable 
              transactions={filteredIncomes}
              type="income"
              onEdit={setEditingIncome}
              onDelete={handleDeleteClick}
            />
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-file-invoice-dollar fa-3x text-muted mb-3"></i>
              <h5>No income records found</h5>
              <p className="text-muted">
                {searchQuery || filter !== 'all' 
                  ? "Try adjusting your filters or search query"
                  : "Add your first income record to get started"}
              </p>
              {(!showForm && !editingIncome) && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowForm(true)}
                >
                  <i className="fas fa-plus me-1"></i>
                  Add Income Record
                </Button>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <i className="fas fa-exclamation-triangle text-warning me-2"></i>
          Are you sure you want to delete this income record? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDelete} 
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Deleting...
              </>
            ) : (
              <>
                <i className="fas fa-trash-alt me-1"></i>
                Delete Record
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Income;