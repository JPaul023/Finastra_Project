import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Modal, Button, Form, Badge, Tabs, Tab } from 'react-bootstrap';
import ExpenseForm from '../../components/finance/ExpenseForm';
import TransactionTable from '../../components/finance/TransactionTable';
import financeAPI from '../../services/financeAPI';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Expense categories from Dashboard.jsx
  const expenseCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'software_development', label: 'Software Development' },
    { value: 'cloud_infrastructure', label: 'Cloud Infrastructure' },
    { value: 'data_services', label: 'Data Services' },
    { value: 'research_development', label: 'Research & Development' },
    { value: 'employee_salaries', label: 'Employee Salaries & Benefits' },
    { value: 'marketing_sales', label: 'Marketing & Sales' },
    { value: 'travel_entertainment', label: 'Travel & Entertainment' },
    { value: 'office_operations', label: 'Office Operations' },
    { value: 'legal_compliance', label: 'Legal & Compliance' },
    { value: 'hardware_equipment', label: 'Hardware & Equipment' },
    { value: 'licenses_subscriptions', label: 'Licenses & Subscriptions' },
    { value: 'vendor_services', label: 'Third-party Vendor Services' },
    { value: 'professional_fees', label: 'Professional Fees' },
    { value: 'taxes', label: 'Taxes & Duties' },
    { value: 'other', label: 'Other Expenses' }
  ];
  
  // Fetch expenses from API
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await financeAPI.getExpenses();
      setExpenses(response);
      setError('');
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
      setError('Failed to load expense data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchExpenses();
  }, []);
  
  // Handle expense creation - UPDATED
  const handleAddExpense = async (formData) => {
    try {
      await financeAPI.addExpense(formData);
      fetchExpenses(); // Refresh data
      setShowForm(false); // Hide form after successful submission
      
      // Show success message
      setError(''); // Clear any previous errors
      // You can add a success alert/toast here if desired
      
    } catch (err) {
      console.error('Failed to add expense:', err);
      setError('Failed to add expense. Please check your data and try again.');
      throw err; // Let the form component handle the error
    }
  };
  
  // Handle expense update
  const handleUpdateExpense = async (formData) => {
    try {
      await financeAPI.updateExpense(editingExpense.id, formData);
      setEditingExpense(null);
      fetchExpenses(); // Refresh data
    } catch (err) {
      console.error('Failed to update expense:', err);
      throw err; // Let the form component handle the error
    }
  };
  
  // Handle expense deletion
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await financeAPI.deleteExpense(deleteId);
      fetchExpenses(); // Refresh data
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Failed to delete expense:', err);
      setError('Failed to delete the expense. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };
  
  // Filter transactions
  const getFilteredTransactions = () => {
    if (!expenses || expenses.length === 0) return [];
    
    let filtered = [...expenses];
    
    // Apply category filter
    if (filter !== 'all') {
      filtered = filtered.filter(expense => expense.category === filter);
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(expense => 
        expense.description.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query) ||
        expense.amount.toString().includes(query)
      );
    }
    
    return filtered;
  };
  
  const filteredExpenses = getFilteredTransactions();
  
  return (
    <Container fluid className="py-4 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Expense Management</h2>
          <p className="text-muted mb-0">Track and manage your expenses and operating costs</p>
        </div>
        <Button 
          variant="danger" 
          onClick={() => {
            setEditingExpense(null); // Clear any editing state
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
              Add New Expense
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
      {(showForm || editingExpense) && (
        <Card className="shadow-sm mb-4 border-0">
          <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
            <h5 className="mb-0">{editingExpense ? 'Edit Expense Record' : 'Add New Expense Record'}</h5>
            <div>
              {editingExpense && (
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  className="me-2"
                  onClick={() => setEditingExpense(null)}
                >
                  <i className="fas fa-times me-1"></i>
                  Cancel Edit
                </Button>
              )}
              {!editingExpense && (
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
            <ExpenseForm 
              initialData={editingExpense} 
              onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
              onCancel={() => editingExpense ? setEditingExpense(null) : setShowForm(false)}
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
                  {expenseCategories.map((category) => (
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
              <Badge bg="danger">
                {filteredExpenses.length} {filteredExpenses.length === 1 ? 'Record' : 'Records'}
              </Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Table Section */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white py-3">
          <h5 className="mb-0">Expense Transactions</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" variant="danger">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3 text-muted">Loading expense transactions...</p>
            </div>
          ) : filteredExpenses.length > 0 ? (
            <TransactionTable 
              transactions={filteredExpenses}
              type="expense"
              onEdit={setEditingExpense}
              onDelete={handleDeleteClick}
            />
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-receipt fa-3x text-muted mb-3"></i>
              <h5>No expense records found</h5>
              <p className="text-muted">
                {searchQuery || filter !== 'all' 
                  ? "Try adjusting your filters or search query"
                  : "Add your first expense record to get started"}
              </p>
              {(!showForm && !editingExpense) && (
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => setShowForm(true)}
                >
                  <i className="fas fa-plus me-1"></i>
                  Add Expense Record
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
          Are you sure you want to delete this expense record? This action cannot be undone.
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

export default Expenses;