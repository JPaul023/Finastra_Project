import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, InputGroup } from 'react-bootstrap';

const IncomeForm = ({ initialData, onSubmit, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('sales_revenue');
  const [subcategory, setSubcategory] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Income categories for Finastra ERP
  const incomeCategories = [
    { 
      value: 'sales_revenue', 
      label: 'Sales Revenue',
      subcategories: [
        { value: 'subscription_fees', label: 'Subscription Fees (ERP plans)' },
        { value: 'custom_software', label: 'Custom Software Solutions' },
        { value: 'sales', label: 'Sales' },
        { value: 'system_setup', label: 'System Setup & Deployment Fees' },
        { value: 'training_services', label: 'Training Services Fees' }
      ]
    },
    { 
      value: 'interest_income', 
      label: 'Interest Income',
      subcategories: [
        { value: 'loan_interest', label: 'Loan Interest Revenue' },
        { value: 'wealth_management', label: 'Investment & Wealth Management Fees' }
      ]
    },
    { 
      value: 'investment_return', 
      label: 'Investment Return',
      subcategories: [
        { value: 'forex_revenue', label: 'Foreign Exchange (Forex) Revenue' },
        { value: 'interbank_lending', label: 'Interbank Lending & Liquidity Management' }
      ]
    },
    { 
      value: 'other_income', 
      label: 'Other Income',
      subcategories: [
        { value: 'payment_processing', label: 'Payment Processing Fees' },
        { value: 'card_services', label: 'ATM & Card Service Fees' },
        { value: 'insurance_products', label: 'Insurance & Financial Products' },
        { value: 'api_monetization', label: 'Data & API Monetization' }
      ]
    }
  ];
  
  // Get subcategories for selected category
  const getSubcategories = () => {
    const selectedCategory = incomeCategories.find(cat => cat.value === category);
    return selectedCategory ? selectedCategory.subcategories : [];
  };
  
  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount || '');
      setDate(initialData.date || '');
      setDescription(initialData.description || '');
      setCategory(initialData.category || 'sales_revenue');
      
      // Handle different data structures - backend vs frontend
      if (initialData.source) {
        // This means we're getting data directly from backend
        setDescription(initialData.description || initialData.source || '');
      }
      
      setSubcategory(initialData.subcategory || getSubcategories()[0]?.value || '');
      setReference(initialData.reference || '');
      setNotes(initialData.notes || '');
    } else {
      // Set default date to today for new records
      setDate(new Date().toISOString().split('T')[0]);
      
      // Set default subcategory
      const defaultSubcategories = getSubcategories();
      setSubcategory(defaultSubcategories.length > 0 ? defaultSubcategories[0].value : '');
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
    if (!amount || !date || !description || !category) {
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
        source: description,  // Map to source field in backend
        amount: numAmount,
        date,
        description,
        category,
        // Include frontend-only fields for future use if needed
        subcategory,
        reference,
        notes
      };
      
      setLoading(true);
      await onSubmit(formData);
      
      // Reset form if not editing
      if (!initialData) {
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setDescription('');
        setCategory('sales_revenue');
        const defaultSubcategories = getSubcategories();
        setSubcategory(defaultSubcategories.length > 0 ? defaultSubcategories[0].value : '');
        setReference('');
        setNotes('');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError('Failed to save income record. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
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
              placeholder="Brief description of this income"
              required
            />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Income Category*</Form.Label>
            <Form.Select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {incomeCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Revenue Source*</Form.Label>
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
            <Form.Label>Reference Number</Form.Label>
            <Form.Control
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Invoice or payment reference"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Additional Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information about this income"
            />
          </Form.Group>
        </Col>
      </Row>
      
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
          variant="primary" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : initialData ? 'Update' : 'Save'}
        </Button>
      </div>
    </Form>
  );
};

export default IncomeForm;