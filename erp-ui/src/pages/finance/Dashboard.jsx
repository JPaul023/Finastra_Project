import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import financeAPI from '../../services/financeAPI';

// Register required Chart.js components
ChartJS.register(
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Clean, consistent styles across financial pages
const styles = {
  card: {
    border: 'none',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '12px',
    overflow: 'hidden'
  },
  chartContainer: {
    height: '250px'
  },
  smallChartContainer: {
    height: '220px'
  },
  iconWrapper: {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    marginRight: '16px',
    fontSize: '18px',
    transition: 'all 0.2s ease'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'white',
    borderBottom: '1px solid rgba(0,0,0,0.05)'
  },
  summaryCard: {
    borderRadius: '8px',
    border: 'none',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    height: '100%',
    overflow: 'hidden'
  },
  dashboardHeader: {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
};

// SVG icons for summary cards
const RevenueIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0078D4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17V13" stroke="#0078D4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.5 10.5C15.5 7.46 12 5 12 5C12 5 8.5 7.46 8.5 10.5C8.5 11.6935 8.97411 12.8381 9.81802 13.682C10.6619 14.5259 11.8065 15 13 15" stroke="#0078D4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExpenseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 8L22 8" stroke="#D94C53" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 3H6C3.79086 3 2 4.79086 2 7V17C2 19.2091 3.79086 21 6 21H18C20.2091 21 22 19.2091 22 17V7C22 4.79086 20.2091 3 18 3Z" stroke="#D94C53" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17C13.6569 17 15 15.6569 15 14C15 12.3431 13.6569 11 12 11C10.3431 11 9 12.3431 9 14C9 15.6569 10.3431 17 12 17Z" stroke="#D94C53" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IncomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 12H18L15 21L9 3L6 12H2" stroke="#38A169" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BalanceIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5Z" stroke="#0C87B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 10H21" stroke="#0C87B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 15C16 15.5304 15.7893 16.0391 15.4142 16.4142C15.0391 16.7893 14.5304 17 14 17C13.4696 17 12.9609 16.7893 12.5858 16.4142C12.2107 16.0391 12 15.5304 12 15C12 14.4696 12.2107 13.9609 12.5858 13.5858C12.9609 13.2107 13.4696 13 14 13C14.5304 13 15.0391 13.2107 15.4142 13.5858C15.7893 13.9609 16 14.4696 16 15Z" stroke="#0C87B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 16V14" stroke="#0C87B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Professional icon choices for financial display
const financialIcons = {
  cashFlow: 'ri-exchange-funds-line',    // Cash flow icon
  pieChart: 'ri-pie-chart-2-line',       // Pie chart icon
  barChart: 'ri-bar-chart-grouped-line', // Bar chart icon
  analytics: 'ri-bar-chart-box-line',    // Analytics icon
  printer: 'ri-printer-line'             // Printer icon
};

// Consistent colors that match other financial pages
const themeColors = {
  income: [
    '#3a86ff',  // Blue
    '#38b2ac',  // Teal
    '#805ad5',  // Purple
    '#f6ad55'   // Orange
  ],
  expense: [
    '#f56565',  // Red
    '#f6ad55',  // Orange
    '#48bb78',  // Green
    '#9f7aea',  // Purple
    '#4fd1c5',  // Teal
    '#ecc94b'   // Yellow
  ],
  icons: {
    revenue: '#ebf7ff',    // Light blue bg
    revenueText: '#0078d4', // Blue icon
    expense: '#fff5f5',    // Light red bg
    expenseText: '#d94c53', // Red icon
    income: '#f0fff4',     // Light green bg
    incomeText: '#38a169', // Green icon
    balance: '#e6f7ff',    // Light cyan bg
    balanceText: '#0c87b8' // Cyan icon
  }
};

// Add Remix Icon link to head
const addRemixIconsLink = () => {
  if (!document.getElementById('remix-icons')) {
    const link = document.createElement('link');
    link.id = 'remix-icons';
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css';
    document.head.appendChild(link);
  }
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summaryData, setSummaryData] = useState(null);
  const [cashFlowData, setCashFlowData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({ 
    tested: false, 
    connected: false, 
    message: 'Connection status unknown'
  });
  
  // Load Remix Icons
  useEffect(() => {
    addRemixIconsLink();
  }, []);
  
  // Filter states
  const [selectedPeriod, setSelectedPeriod] = useState('quarterly');
  const [selectedViewType, setSelectedViewType] = useState('overview');
  
  // Applied filter states
  const [appliedFilters, setAppliedFilters] = useState({
    period: 'quarterly',
    viewType: 'overview'
  });
  
  // Apply filters
  const applyFilters = () => {
    setAppliedFilters({
      period: selectedPeriod,
      viewType: selectedViewType
    });
  };

  // Test API connection
  const testConnection = async () => {
    try {
      await financeAPI.testAPI();
      setConnectionStatus({
        tested: true,
        connected: true,
        message: 'Successfully connected to the finance API'
      });
      // Load data after successful connection test
      fetchDashboardData();
    } catch (err) {
      console.error('API connection test failed:', err);
      setConnectionStatus({
        tested: true,
        connected: false,
        message: `Failed to connect to finance API: ${err.message || 'Unknown error'}`
      });
      setError('Unable to connect to backend. Please check your API connection.');
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    // Map financial periods to API timeRange
    const timeRangeMap = {
      quarterly: '3months',
      biannual: '6months',
      annual: '1year',
      ytd: 'ytd'
    };
    
    const apiTimeRange = timeRangeMap[appliedFilters.period] || '3months';
    
    try {
      // Make API requests in parallel for better performance
      const [summary, cashFlow] = await Promise.all([
        financeAPI.getSummary({ timeRange: apiTimeRange }),
        financeAPI.getCashFlow('monthly', { timeRange: apiTimeRange })
      ]);
      
      setSummaryData(summary);
      setCashFlowData(cashFlow);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Initial load - test connection then load data
  useEffect(() => {
    testConnection();
  }, []);
  
  // Load data when applied filters change
  useEffect(() => {
    if (connectionStatus.connected) {
      fetchDashboardData();
    }
  }, [appliedFilters.period, connectionStatus.connected]);

  // Format currency for display
  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };
  
  // Get period label text
  const getPeriodLabel = () => {
    switch (appliedFilters.period) {
      case 'quarterly':
        return 'Quarterly (Last 3 Months)';
      case 'biannual':
        return 'Biannual (Last 6 Months)';
      case 'annual':
        return 'Annual (Last 12 Months)';
      case 'ytd':
        return 'Year-to-Date';
      default:
        return 'Quarterly (Last 3 Months)';
    }
  };

  // Income category mappings to match the forms
  const incomeCategoryLabels = {
    'sales_revenue': 'Sales Revenue',
    'interest_income': 'Interest Income',
    'investment_return': 'Investment Return',
    'other_income': 'Other Income'
  };

  // Expense category mappings to match the forms
  const expenseCategoryLabels = {
    'operational_expenses': 'Operational Expenses',
    'marketing_advertising': 'Marketing & Advertising',
    'supplies_office': 'Supplies & Office Expenses',
    'technology_infrastructure': 'Technology & Infrastructure',
    'employee_hr': 'Employee & HR Expenses',
    'compliance_legal': 'Compliance & Legal'
  };

  // Helper function to get category display name
  const formatCategoryLabel = (category, type) => {
    if (type === 'income') {
      return incomeCategoryLabels[category] || category;
    } else {
      return expenseCategoryLabels[category] || category;
    }
  };

  // Cash flow trend data - Line Chart
  const getCashFlowData = () => {
    if (!cashFlowData) return null;
    
    const { labels = [], incomeData = [], expensesData = [], netData = [] } = cashFlowData;
    
    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          borderColor: '#3182ce',
          backgroundColor: 'rgba(49, 130, 206, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#3182ce',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Expenses',
          data: expensesData,
          borderColor: '#e53e3e',
          backgroundColor: 'rgba(229, 62, 62, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#e53e3e',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Net Cash Flow',
          data: netData,
          borderColor: '#38a169',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#38a169',
          borderDash: [5, 5],
          fill: false,
          tension: 0.4
        }
      ]
    };
  };

  // Income breakdown - Pie Chart
  const getIncomeBreakdownData = () => {
    if (!summaryData || !summaryData.incomeByCategory) return null;
    
    const labels = [];
    const data = [];
    const colors = themeColors.income;
    
    summaryData.incomeByCategory.forEach((item, index) => {
      labels.push(formatCategoryLabel(item.category, 'income'));
      data.push(parseFloat(item.amount));
    });
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors.slice(0, data.length),
          borderWidth: 0
        }
      ]
    };
  };

  // Expense breakdown - Pie Chart
  const getExpenseBreakdownData = () => {
    if (!summaryData || !summaryData.expensesByCategory) return null;
    
    const labels = [];
    const data = [];
    const colors = themeColors.expense;
    
    summaryData.expensesByCategory.forEach((item, index) => {
      labels.push(formatCategoryLabel(item.category, 'expense'));
      data.push(parseFloat(item.amount));
    });
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors.slice(0, data.length),
          borderWidth: 0
        }
      ]
    };
  };

  // Chart options
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    }
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  return (
    <Container fluid className="py-4 bg-light">
      <div style={styles.dashboardHeader}>
        <div>
          <h2 className="mb-1">Financial Dashboard</h2>
          <p className="text-muted mb-0">Financial performance overview and key metrics</p>
        </div>
      </div>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          <div className="d-flex align-items-center">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
          <div className="mt-2">
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={testConnection}
            >
              <i className="fas fa-sync-alt me-1"></i>
              Test Connection
            </Button>
          </div>
        </Alert>
      )}
      
      {/* Filter Controls */}
      <Card className="shadow-sm mb-4 border-0" style={styles.card}>
        <Card.Body className="p-3">
          <Row className="align-items-center">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small text-muted mb-1">Time Period</Form.Label>
                <Form.Select 
                  size="sm"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="shadow-none"
                >
                  <option value="quarterly">Quarterly (Last 3 Months)</option>
                  <option value="biannual">Biannual (Last 6 Months)</option>
                  <option value="annual">Annual (Last 12 Months)</option>
                  <option value="ytd">Year-to-Date</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small text-muted mb-1">View Type</Form.Label>
                <Form.Select 
                  size="sm"
                  value={selectedViewType}
                  onChange={(e) => setSelectedViewType(e.target.value)}
                  className="shadow-none"
                >
                  <option value="overview">Overview</option>
                  <option value="trends">Trend Analysis</option>
                  <option value="breakdown">Category Breakdown</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="text-end mt-md-3">
              <Button 
                variant="primary" 
                size="sm"
                onClick={applyFilters}
              >
                <i className="fas fa-filter me-1"></i>
                Apply Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading financial data...</p>
        </div>
      ) : (
        <>
          {/* Financial Summary Cards */}
          <Row className="mb-4 g-3">
            <Col xl={3} md={6}>
              <Card className="h-100 shadow-sm border-0" style={styles.summaryCard}>
                <Card.Body className="d-flex flex-column p-3">
                  <div className="d-flex align-items-center mb-3">
                    <div style={{
                      ...styles.iconWrapper,
                      backgroundColor: themeColors.icons.revenue
                    }}>
                      <RevenueIcon />
                    </div>
                    <div>
                      <h6 className="mb-0 text-muted">Total Revenue</h6>
                      <p className="fs-4 fw-bold mb-0">
                        {formatCurrency(summaryData?.totalIncome || 0)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto small">
                    {summaryData?.comparisonToPreviousPeriod?.income > 0 ? (
                      <span className="text-success">
                        <i className="fas fa-arrow-up me-1"></i>
                        {summaryData.comparisonToPreviousPeriod.income.toFixed(1)}% increase
                      </span>
                    ) : summaryData?.comparisonToPreviousPeriod?.income < 0 ? (
                      <span className="text-danger">
                        <i className="fas fa-arrow-down me-1"></i>
                        {Math.abs(summaryData.comparisonToPreviousPeriod.income).toFixed(1)}% decrease
                      </span>
                    ) : (
                      <span className="text-muted">
                        <i className="fas fa-minus me-1"></i>
                        No change from previous period
                      </span>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col xl={3} md={6}>
              <Card className="h-100 shadow-sm border-0" style={styles.summaryCard}>
                <Card.Body className="d-flex flex-column p-3">
                  <div className="d-flex align-items-center mb-3">
                    <div style={{
                      ...styles.iconWrapper,
                      backgroundColor: themeColors.icons.expense
                    }}>
                      <ExpenseIcon />
                    </div>
                    <div>
                      <h6 className="mb-0 text-muted">Total Expenses</h6>
                      <p className="fs-4 fw-bold mb-0">
                        {formatCurrency(summaryData?.totalExpenses || 0)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto small">
                    {summaryData?.comparisonToPreviousPeriod?.expenses > 0 ? (
                      <span className="text-danger">
                        <i className="fas fa-arrow-up me-1"></i>
                        {summaryData.comparisonToPreviousPeriod.expenses.toFixed(1)}% increase
                      </span>
                    ) : summaryData?.comparisonToPreviousPeriod?.expenses < 0 ? (
                      <span className="text-success">
                        <i className="fas fa-arrow-down me-1"></i>
                        {Math.abs(summaryData.comparisonToPreviousPeriod.expenses).toFixed(1)}% decrease
                      </span>
                    ) : (
                      <span className="text-muted">
                        <i className="fas fa-minus me-1"></i>
                        No change from previous period
                      </span>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col xl={3} md={6}>
              <Card className="h-100 shadow-sm border-0" style={styles.summaryCard}>
                <Card.Body className="d-flex flex-column p-3">
                  <div className="d-flex align-items-center mb-3">
                    <div style={{
                      ...styles.iconWrapper,
                      backgroundColor: themeColors.icons.income
                    }}>
                      <IncomeIcon />
                    </div>
                    <div>
                      <h6 className="mb-0 text-muted">Net Income</h6>
                      <p className={`fs-4 fw-bold mb-0 ${(summaryData?.netIncome || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                        {formatCurrency(summaryData?.netIncome || 0)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto small">
                    {summaryData?.comparisonToPreviousPeriod?.profit > 0 ? (
                      <span className="text-success">
                        <i className="fas fa-arrow-up me-1"></i>
                        {summaryData.comparisonToPreviousPeriod.profit.toFixed(1)}% increase
                      </span>
                    ) : summaryData?.comparisonToPreviousPeriod?.profit < 0 ? (
                      <span className="text-danger">
                        <i className="fas fa-arrow-down me-1"></i>
                        {Math.abs(summaryData.comparisonToPreviousPeriod.profit).toFixed(1)}% decrease
                      </span>
                    ) : (
                      <span className="text-muted">
                        <i className="fas fa-minus me-1"></i>
                        No change from previous period
                      </span>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col xl={3} md={6}>
              <Card className="h-100 shadow-sm border-0" style={styles.summaryCard}>
                <Card.Body className="d-flex flex-column p-3">
                  <div className="d-flex align-items-center mb-3">
                    <div style={{
                      ...styles.iconWrapper,
                      backgroundColor: themeColors.icons.balance
                    }}>
                      <BalanceIcon />
                    </div>
                    <div>
                      <h6 className="mb-0 text-muted">Profit Margin</h6>
                      <p className="fs-4 fw-bold mb-0">
                        {summaryData?.totalIncome && summaryData.totalIncome > 0 
                          ? ((summaryData.netIncome / summaryData.totalIncome) * 100).toFixed(1) + '%'
                          : '0.0%'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto small">
                    <span className="text-muted">
                      <i className="fas fa-calendar-alt me-1"></i>
                      {getPeriodLabel()}
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Charts Row */}
          <Row className="mb-4 g-3">
            <Col lg={8}>
              <Card className="shadow-sm border-0 h-100" style={styles.card}>
                <div style={styles.cardHeader}>
                  <div className="d-flex align-items-center">
                    <i className={`${financialIcons.cashFlow} me-2`} style={{ fontSize: '20px' }}></i>
                    <h5 className="mb-0">Cash Flow Trend</h5>
                  </div>
                  <span className="text-muted">
                    {getPeriodLabel()}
                  </span>
                </div>
                <Card.Body>
                  <div style={styles.chartContainer}>
                    {getCashFlowData() ? (
                      <Line data={getCashFlowData()} options={lineChartOptions} />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <div className="text-center text-muted">
                          <i className="fas fa-chart-line fa-3x mb-3" style={{ opacity: 0.3 }}></i>
                          <p>No cash flow data available for selected period</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4}>
              <Row className="h-100 g-3">
                <Col xs={12}>
                  <Card className="shadow-sm border-0" style={styles.card}>
                    <div style={styles.cardHeader}>
                      <div className="d-flex align-items-center">
                        <i className={`${financialIcons.pieChart} me-2`} style={{ fontSize: '20px' }}></i>
                        <h5 className="mb-0">Income Breakdown</h5>
                      </div>
                    </div>
                    <Card.Body>
                      <div style={styles.smallChartContainer}>
                        {getIncomeBreakdownData() && summaryData?.incomeByCategory?.length > 0 ? (
                          <Pie data={getIncomeBreakdownData()} options={pieChartOptions} />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center h-100">
                            <div className="text-center text-muted">
                              <i className="fas fa-chart-pie fa-3x mb-3" style={{ opacity: 0.3 }}></i>
                              <p>No income data available for selected period</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col xs={12}>
                  <Card className="shadow-sm border-0" style={styles.card}>
                    <div style={styles.cardHeader}>
                      <div className="d-flex align-items-center">
                        <i className={`${financialIcons.pieChart} me-2`} style={{ fontSize: '20px' }}></i>
                        <h5 className="mb-0">Expense Breakdown</h5>
                      </div>
                    </div>
                    <Card.Body>
                      <div style={styles.smallChartContainer}>
                        {getExpenseBreakdownData() && summaryData?.expensesByCategory?.length > 0 ? (
                          <Pie data={getExpenseBreakdownData()} options={pieChartOptions} />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center h-100">
                            <div className="text-center text-muted">
                              <i className="fas fa-chart-pie fa-3x mb-3" style={{ opacity: 0.3 }}></i>
                              <p>No expense data available for selected period</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Dashboard;