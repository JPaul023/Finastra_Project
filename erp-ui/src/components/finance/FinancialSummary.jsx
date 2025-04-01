import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const FinancialSummary = ({ summaryData }) => {
  const {
    totalIncome = 0,
    totalExpenses = 0,
    netProfit = 0,
    comparisonToPreviousPeriod = {
      income: 0,
      expenses: 0,
      profit: 0
    }
  } = summaryData || {};
  
  // Format numbers with comma separators and 2 decimal points
  const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Determine color based on the change percentage
  const getChangeColor = (changePercent) => {
    if (changePercent > 0) return 'text-success';
    if (changePercent < 0) return 'text-danger';
    return 'text-muted';
  };
  
  // Format the change indicator
  const formatChange = (changePercent) => {
    const sign = changePercent > 0 ? '+' : '';
    const icon = changePercent > 0 ? 'fa-arrow-up' : changePercent < 0 ? 'fa-arrow-down' : 'fa-equals';
    return (
      <span className={getChangeColor(changePercent)}>
        <i className={`fas ${icon} me-1`}></i>
        {sign}{changePercent.toFixed(1)}%
      </span>
    );
  };
  
  return (
    <Row className="g-3">
      {/* Income Summary Card */}
      <Col md={4}>
        <Card className="h-100 shadow-sm border-0">
          <Card.Body className="d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted fw-normal mb-0">Total Income</h6>
              <div className="rounded-circle d-flex align-items-center justify-content-center" 
                   style={{ 
                     width: '40px', 
                     height: '40px', 
                     backgroundColor: 'rgba(40, 167, 69, 0.1)' 
                   }}>
                <i className="fas fa-money-bill-wave text-success"></i>
              </div>
            </div>
            <h3 className="mb-1 fw-bold">{formatCurrency(totalIncome)}</h3>
            <div className="mt-auto small">
              {formatChange(comparisonToPreviousPeriod.income)} from last period
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      {/* Expenses Summary Card */}
      <Col md={4}>
        <Card className="h-100 shadow-sm border-0">
          <Card.Body className="d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted fw-normal mb-0">Total Expenses</h6>
              <div className="rounded-circle d-flex align-items-center justify-content-center" 
                   style={{ 
                     width: '40px', 
                     height: '40px', 
                     backgroundColor: 'rgba(220, 53, 69, 0.1)' 
                   }}>
                <i className="fas fa-credit-card text-danger"></i>
              </div>
            </div>
            <h3 className="mb-1 fw-bold">{formatCurrency(totalExpenses)}</h3>
            <div className="mt-auto small">
              {formatChange(comparisonToPreviousPeriod.expenses)} from last period
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      {/* Net Profit Summary Card */}
      <Col md={4}>
        <Card className="h-100 shadow-sm border-0">
          <Card.Body className="d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted fw-normal mb-0">Net Profit</h6>
              <div className="rounded-circle d-flex align-items-center justify-content-center" 
                   style={{ 
                     width: '40px', 
                     height: '40px', 
                     backgroundColor: 'rgba(0, 123, 255, 0.1)' 
                   }}>
                <i className="fas fa-chart-line text-primary"></i>
              </div>
            </div>
            <h3 className={`mb-1 fw-bold ${netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatCurrency(netProfit)}
            </h3>
            <div className="mt-auto small">
              {formatChange(comparisonToPreviousPeriod.profit)} from last period
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default FinancialSummary;