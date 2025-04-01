import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, InputGroup } from 'react-bootstrap';

const ExpenseForm = ({ initialData, onSubmit, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('operational_expenses');
  const [subcategory, setSubcategory] = useState('rent');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [vendor, setVendor] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Expense categories for Finastra ERP
  const expenseCategories = [
    { 
      value: 'operational_expenses', 
      label: 'Operational Expenses',
      subcategories: [
        { value: 'rent', label: 'Rent' },
        { value: 'utilities', label: 'Utilities' },
        { value: 'maintenance', label: 'Maintenance' }
      ]
    },
    { 
      value: 'marketing_advertising', 
      label: 'Marketing & Advertising',
      subcategories: [
        { value: 'marketing', label: 'Marketing' }
      ]
    },
    { 
      value: 'supplies_office', 
      label: 'Supplies & Office Expenses',
      subcategories: [
        { value: 'supplies', label: 'Supplies' }
      ]
    },
    { 
      value: 'technology_infrastructure', 
      label: 'Technology & Infrastructure',
      subcategories: [
        { value: 'software_licenses', label: 'Software Licenses' },
        { value: 'it_equipment', label: 'IT Equipment' },
        { value: 'cloud_services', label: 'Cloud Services' }
      ]
    },
    { 
      value: 'employee_hr', 
      label: 'Employee & HR Expenses',
      subcategories: [
        { value: 'salaries', label: 'Salaries & Benefits' },
        { value: 'training', label: 'Training & Development' }
      ]
    },
    { 
      value: 'compliance_legal', 
      label: 'Compliance & Legal',
      subcategories: [
        { value: 'regulatory_fees', label: 'Regulatory Fees' },
        { value: 'legal_consulting', label: 'Legal & Consulting Fees' }
      ]
    }
  ];
  
  // Get subcategories for selected category
  const getSubcategories = () => {
    const selectedCategory = expenseCategories.find(cat => cat.value === category);
    return selectedCategory ? selectedCategory.subcategories : [];
  };
  
  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount || '');
      setDate(initialData.date || '');
      setDescription(initialData.description || '');
      setCategory(initialData.category || 'operational_expenses');
      
      // Handle different data structures - backend vs frontend
      if (initialData.payee) {
        // This means we're getting data directly from backend
        setVendor(initialData.payee || '');
      } else {
        setVendor(initialData.vendor || '');
      }
      
      setSubcategory(initialData.subcategory || 'rent');
      setPaymentMethod(initialData.paymentMethod || 'credit_card');
      setNotes(initialData.notes || '');
    } else {
      // Set default date to today for new records
      setDate(new Date().toISOString().split('T')[0]);
      
      // Set default subcategory
      const defaultSubcategories = getSubcategories();
      setSubcategory(defaultSubcategories.length > 0 ? defaultSubcategories[0].value : 'rent');
    }
  }, [initialData]);
  
  // When category changes, reset subcategory if not valid
  useEffect(() => {
    const validSubcategories = getSubcategories().map(sub => sub.value);
    if (!validSubcategories.includes(subcategory)) {
      setSubcategory(validSubcategories[0] || '');
    }
  }, [category, subcategory]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!amount || !date || !description || !category || !subcategory) {
      setError('Please fill in all required fields.');
      return;
    }
    
    try {
      // Convert amount to number to catch errors early
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount)) {
        setError('Please enter a valid amount.');
        return;
      }
      
      // Form data to submit - map to backend model fields
      const formData = {
        payee: vendor || description, // Use vendor as payee in backend
        amount: numAmount,
        date,
        description,
        category,
        // Include frontend-only fields for future use if needed
        subcategory,
        paymentMethod,
        vendor,
        notes
      };
      
      setLoading(true);
      await onSubmit(formData);
      
      // Reset form if not editing
      if (!initialData) {
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setDescription('');
        setCategory('operational_expenses');
        const defaultSubcategories = getSubcategories();
        setSubcategory(defaultSubcategories.length > 0 ? defaultSubcategories[0].value : 'rent');
        setPaymentMethod('credit_card');
        setVendor('');
        setNotes('');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError('Failed to save expense record. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Payment methods
  const paymentMethods = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'check', label: 'Check' },
    { value: 'cash', label: 'Cash' },
    { value: 'online', label: 'Online Payment' },
    { value: 'other', label: 'Other' }
  ];
  
  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Amount*</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />
            </InputGroup>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Date*</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Description*</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this expense"
              required
            />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Expense Category*</Form.Label>
            <Form.Select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {expenseCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Expense Type*</Form.Label>
            <Form.Select 
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              required
            >
              {getSubcategories().map((subcat) => (
                <option key={subcat.value} value={subcat.value}>
                  {subcat.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Payment Method</Form.Label>
            <Form.Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Vendor/Payee</Form.Label>
            <Form.Control
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="Name of vendor or service provider"
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Form.Group className="mb-3">
        <Form.Label>Additional Notes</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional information about this expense"
        />
      </Form.Group>
      
      <div className="d-flex justify-content-end gap-2 mt-2">
        {onCancel && (
          <Button 
            variant="outline-secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button 
          variant="danger" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : initialData ? 'Update' : 'Save'}
        </Button>
      </div>
    </Form>
  );
};

export default ExpenseForm;