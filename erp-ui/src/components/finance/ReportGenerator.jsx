import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';

const ReportGenerator = ({ onSubmit }) => {
  const [reportType, setReportType] = useState('income_statement');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!reportType || !startDate || !endDate) {
      setError('Please fill in all required fields.');
      return;
    }
    
    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      setError('Start date cannot be after end date.');
      return;
    }
    
    try {
      onSubmit({
        reportType,
        startDate,
        endDate
      });
    } catch (err) {
      setError('Failed to generate report. Please try again.');
    }
  };
  
  // Pre-defined date ranges
  const setDateRange = (range) => {
    const today = new Date();
    let start = new Date();
    
    switch (range) {
      case 'this_month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'last_month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        setEndDate(endOfLastMonth.toISOString().split('T')[0]);
        break;
      case 'this_quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        break;
      case 'this_year':
        start = new Date(today.getFullYear(), 0, 1);
        break;
      case 'last_year':
        start = new Date(today.getFullYear() - 1, 0, 1);
        const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
        setEndDate(endOfLastYear.toISOString().split('T')[0]);
        break;
      default:
        // Default to current month
        start = new Date(today.getFullYear(), today.getMonth(), 1);
    }
    
    setStartDate(start.toISOString().split('T')[0]);
    
    // Only set end date to today if not already set in switch cases
    if (range !== 'last_month' && range !== 'last_year') {
      setEndDate(today.toISOString().split('T')[0]);
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      <Form.Group className="mb-3">
        <Form.Label>Report Type</Form.Label>
        <Form.Select 
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          required
        >
          <option value="income_statement">Income Statement</option>
          <option value="balance_sheet">Balance Sheet</option>
          <option value="cash_flow">Cash Flow Statement</option>
          <option value="expense_by_category">Expenses by Category</option>
          <option value="tax_summary">Tax Summary</option>
        </Form.Select>
      </Form.Group>
      
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Form.Group className="mb-4">
        <Form.Label>Quick Date Ranges</Form.Label>
        <div className="d-flex flex-wrap gap-2">
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => setDateRange('this_month')}
            type="button"
          >
            This Month
          </Button>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => setDateRange('last_month')}
            type="button"
          >
            Last Month
          </Button>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => setDateRange('this_quarter')}
            type="button"
          >
            This Quarter
          </Button>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => setDateRange('this_year')}
            type="button"
          >
            Year-to-Date
          </Button>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => setDateRange('last_year')}
            type="button"
          >
            Last Year
          </Button>
        </div>
      </Form.Group>
      
      <Button variant="primary" type="submit" className="w-100">
        <i className="fas fa-file-invoice me-1"></i>
        Generate Report
      </Button>
    </Form>
  );
};

export default ReportGenerator;