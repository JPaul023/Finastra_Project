import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Alert, Button, Form, Tabs, Tab, Nav } from 'react-bootstrap';
import ReportGenerator from '../../components/finance/ReportGenerator';
import BalanceSheetTable from '../../components/finance/BalanceSheetTable';
import financeAPI from '../../services/financeAPI';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

// Logos for report types (using Font Awesome for consistency)
const ReportTypeLogos = {
  income_statement: <i className="fas fa-file-invoice-dollar text-primary fa-2x"></i>,
  balance_sheet: <i className="fas fa-balance-scale text-success fa-2x"></i>,
  cash_flow: <i className="fas fa-chart-line text-info fa-2x"></i>,
  expense_by_category: <i className="fas fa-tags text-danger fa-2x"></i>,
  tax_summary: <i className="fas fa-receipt text-warning fa-2x"></i>
};

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [reportHistory, setReportHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('generator');
  const [connectionStatus, setConnectionStatus] = useState({ 
    tested: false, 
    connected: false, 
    message: 'Connection status unknown'
  });
  
  // Test API connection
  const testConnection = async () => {
    try {
      await financeAPI.testAPI();
      setConnectionStatus({
        tested: true,
        connected: true,
        message: 'Successfully connected to the finance API'
      });
      // Load initial data after successful connection
      fetchInitialData();
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
  
  // Fetch balance sheet and report history on component mount
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch balance sheet
      const balanceData = await financeAPI.getBalanceSheet();
      setBalanceSheet(balanceData);
      
      // Fetch report history
      await fetchReportHistory();
      
      setError('');
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
      setError('Failed to load initial data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Separate function to fetch report history
  const fetchReportHistory = async () => {
    try {
      console.log("Fetching report history...");
      setLoading(true);
      
      const historyData = await financeAPI.getReportHistory();
      console.log("Report history data received:", historyData);
      
      if (!historyData || !Array.isArray(historyData)) {
        console.warn("Report history is not an array, initializing empty array:", historyData);
        setReportHistory([]);
      } else {
        // Sort by timestamp (newest first)
        const sortedHistory = [...historyData].sort((a, b) => 
          new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
        );
        setReportHistory(sortedHistory);
      }
      
      setError('');
    } catch (err) {
      console.error('Failed to fetch report history:', err);
      setError('Could not retrieve report history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Test connection on component mount
  useEffect(() => {
    testConnection();
  }, []);
  
  // Generate a summary of the report for history display
  const generateReportSummary = (reportData) => {
    const { type, data } = reportData;
    
    switch(type) {
      case 'income_statement':
        return `Revenue: ${formatCurrency(data.totalRevenue)}, Expenses: ${formatCurrency(data.totalExpenses)}, Net Income: ${formatCurrency(data.netIncome)}`;
      case 'expense_by_category':
        return `Total Expenses: ${formatCurrency(data.totalExpenses)}, Categories: ${data.expensesByCategory?.length || 0}`;
      case 'balance_sheet':
        return `Total Assets: ${formatCurrency(data.totalAssets)}, Total Liabilities: ${formatCurrency(data.totalLiabilities)}, Equity: ${formatCurrency(data.totalEquity)}`;
      case 'cash_flow':
        return `Net Cash Flow: ${formatCurrency(data.netCashIncrease)}, Ending Balance: ${formatCurrency(data.endingCashBalance)}`;
      case 'tax_summary':
        return `Taxable Income: ${formatCurrency(data.netTaxableIncome)}, Estimated Tax: ${formatCurrency(data.totalTax)}`;
      default:
        return `Generated on ${new Date().toLocaleDateString()}`;
    }
  };
  
  // Save report to history function
  const saveReportToHistory = async (reportData) => {
    try {
      // Create history record with all necessary details
      const historyRecord = {
        type: reportData.type,
        startDate: reportData.period.startDate,
        endDate: reportData.period.endDate,
        timestamp: new Date().toISOString(),
        reportName: getReportTypeLabel(reportData.type),
        reportSummary: generateReportSummary(reportData)
      };
      
      console.log("Saving report to history:", historyRecord);
      
      // Save to backend
      const result = await financeAPI.saveReportToHistory(historyRecord);
      console.log("Report saved to history, result:", result);
      
      // Refresh report history
      await fetchReportHistory();
      
    } catch (err) {
      console.error('Failed to save report to history:', err);
      setError('Could not save report to history. The report was generated but will not appear in history.');
    }
  };
  
  // Handle report generation
  const handleGenerateReport = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      const reportData = await financeAPI.getFinancialReports(
        formData.reportType,
        formData.startDate,
        formData.endDate
      );
      
      const newReport = {
        type: formData.reportType,
        data: reportData,
        period: {
          startDate: formData.startDate,
          endDate: formData.endDate
        }
      };
      
      setReport(newReport);
      
      // Save the generated report to history
      await saveReportToHistory(newReport);
      
    } catch (err) {
      console.error('Failed to generate report:', err);
      setError('Failed to generate the report. Please try again.');
    } finally {
      setLoading(false);
      setActiveTab('report'); // Switch to report tab
    }
  };
  
  // Load a previously generated report
  const handleLoadReport = async (reportInfo) => {
    setLoading(true);
    setError('');
    
    try {
      console.log("Loading report from history:", reportInfo);
      
      const reportData = await financeAPI.getFinancialReports(
        reportInfo.type,
        reportInfo.startDate,
        reportInfo.endDate
      );
      
      setReport({
        type: reportInfo.type,
        data: reportData,
        period: {
          startDate: reportInfo.startDate,
          endDate: reportInfo.endDate
        }
      });
      
    } catch (err) {
      console.error('Failed to load report:', err);
      setError('Failed to load the report. Please try again.');
    } finally {
      setLoading(false);
      setActiveTab('report'); // Switch to report tab
    }
  };
  
  // Handle exporting a report from history
  const handleExportHistoryReport = async (reportInfo, format) => {
    try {
      setLoading(true);
      console.log(`Exporting ${format} from history:`, reportInfo);
      
      // First, load the report data
      const reportData = await financeAPI.getFinancialReports(
        reportInfo.type,
        reportInfo.startDate,
        reportInfo.endDate
      );
      
      const tempReport = {
        type: reportInfo.type,
        data: reportData,
        period: {
          startDate: reportInfo.startDate,
          endDate: reportInfo.endDate
        }
      };
      
      // Export based on format
      if (format === 'pdf') {
        // Set temp report and then export
        setReport(tempReport);
        setTimeout(() => exportToPDF(tempReport), 100);
      } else if (format === 'excel') {
        // Set temp report and then export
        setReport(tempReport);
        setTimeout(() => exportToExcel(tempReport), 100);
      }
      
    } catch (err) {
      console.error(`Failed to export ${format} from history:`, err);
      setError(`Could not export report as ${format.toUpperCase()}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };
  
  // Export to PDF without using autoTable
  const exportToPDF = (reportToExport) => {
    const reportData = reportToExport || report;
    if (!reportData) return;
    
    const { type, data, period } = reportData;
    const doc = new jsPDF();
    
    // Set up the PDF
    const reportTitle = getReportTypeLabel(type);
    const dateRange = `${formatDate(period.startDate)} - ${formatDate(period.endDate)}`;
    
    // Add title and company info
    doc.setFontSize(18);
    doc.text(reportTitle, 14, 20);
    
    // Add company info
    doc.setFontSize(12);
    doc.text("Finastra Financial ERP", 14, 28);
    
    // Add date range
    doc.setFontSize(10);
    doc.text(`Report Period: ${dateRange}`, 14, 36);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 42);
    
    let yPos = 55;
    const lineHeight = 8;
    
    if (type === 'income_statement') {
      // Income Statement PDF without autoTable
      doc.setFontSize(14);
      doc.text('Revenue', 14, yPos);
      yPos += lineHeight * 1.5;
      
      // Header
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Category", 14, yPos);
      doc.text("Amount", 140, yPos);
      yPos += lineHeight;
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos - 2, 196, yPos - 2);
      
      // Revenue items
      doc.setTextColor(0, 0, 0);
      if (data.revenues && data.revenues.length > 0) {
        data.revenues.forEach(item => {
          doc.text(item.category, 14, yPos);
          doc.text(formatCurrency(item.amount), 140, yPos);
          yPos += lineHeight;
        });
      } else {
        doc.text("No revenue data available", 14, yPos);
        yPos += lineHeight;
      }
      
      // Total Revenue
      doc.setFillColor(240, 240, 240);
      doc.rect(14, yPos - 4, 182, lineHeight, 'F');
      doc.setFont(undefined, 'bold');
      doc.text("Total Revenue", 14, yPos);
      doc.text(formatCurrency(data.totalRevenue), 140, yPos);
      doc.setFont(undefined, 'normal');
      yPos += lineHeight * 2;
      
      // Expenses
      doc.setFontSize(14);
      doc.text('Expenses', 14, yPos);
      yPos += lineHeight * 1.5;
      
      // Header
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Category", 14, yPos);
      doc.text("Amount", 140, yPos);
      yPos += lineHeight;
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos - 2, 196, yPos - 2);
      
      // Expense items
      doc.setTextColor(0, 0, 0);
      if (data.expenses && data.expenses.length > 0) {
        data.expenses.forEach(item => {
          doc.text(item.category, 14, yPos);
          doc.text(formatCurrency(item.amount), 140, yPos);
          yPos += lineHeight;
        });
      } else {
        doc.text("No expense data available", 14, yPos);
        yPos += lineHeight;
      }
      
      // Total Expenses
      doc.setFillColor(255, 240, 240);
      doc.rect(14, yPos - 4, 182, lineHeight, 'F');
      doc.setFont(undefined, 'bold');
      doc.text("Total Expenses", 14, yPos);
      doc.text(formatCurrency(data.totalExpenses), 140, yPos);
      yPos += lineHeight * 1.5;
      
      // Net Income
      const isPositive = data.netIncome >= 0;
      doc.setFillColor(isPositive ? 240 : 255, isPositive ? 255 : 240, isPositive ? 240 : 240);
      doc.rect(14, yPos - 4, 182, lineHeight, 'F');
      doc.setFont(undefined, 'bold');
      doc.text("Net Income", 14, yPos);
      doc.text(formatCurrency(data.netIncome), 140, yPos);
      doc.setFont(undefined, 'normal');
    } else if (type === 'expense_by_category') {
      // Expenses by Category - simple implementation without autoTable
      doc.setFontSize(14);
      doc.text('Expenses by Category', 14, yPos);
      yPos += lineHeight * 1.5;
      
      // Header
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Category", 14, yPos);
      doc.text("Amount", 100, yPos);
      doc.text("% of Total", 140, yPos);
      yPos += lineHeight;
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos - 2, 196, yPos - 2);
      
      // Expense items
      doc.setTextColor(0, 0, 0);
      if (data.expensesByCategory && data.expensesByCategory.length > 0) {
        data.expensesByCategory.forEach(item => {
          doc.text(item.category, 14, yPos);
          doc.text(formatCurrency(item.amount), 100, yPos);
          const percentage = data.totalExpenses ? (item.amount / data.totalExpenses * 100).toFixed(1) + '%' : '0%';
          doc.text(percentage, 140, yPos);
          yPos += lineHeight;
        });
      } else {
        doc.text("No expense data available", 14, yPos);
        yPos += lineHeight;
      }
      
      // Total Expenses
      doc.setFillColor(255, 240, 240);
      doc.rect(14, yPos - 4, 182, lineHeight, 'F');
      doc.setFont(undefined, 'bold');
      doc.text("Total Expenses", 14, yPos);
      doc.text(formatCurrency(data.totalExpenses), 100, yPos);
      doc.text("100%", 140, yPos);
      doc.setFont(undefined, 'normal');
    } else if (type === 'balance_sheet') {
      // Balance Sheet - simple implementation
      doc.setFontSize(14);
      doc.text('Assets', 14, yPos);
      yPos += lineHeight * 1.5;
      
      // Header for Assets
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Asset Type", 14, yPos);
      doc.text("Amount", 140, yPos);
      yPos += lineHeight;
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos - 2, 196, yPos - 2);
      
      // Asset items
      doc.setTextColor(0, 0, 0);
      let assetsRendered = false;
      if (data.assets) {
        Object.entries(data.assets).forEach(([key, value]) => {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          doc.text(label, 14, yPos);
          doc.text(formatCurrency(value), 140, yPos);
          yPos += lineHeight;
          assetsRendered = true;
        });
      }
      
      if (!assetsRendered) {
        doc.text("No asset data available", 14, yPos);
        yPos += lineHeight;
      }
      
      // Total Assets
      doc.setFillColor(240, 255, 240);
      doc.rect(14, yPos - 4, 182, lineHeight, 'F');
      doc.setFont(undefined, 'bold');
      doc.text("Total Assets", 14, yPos);
      doc.text(formatCurrency(data.totalAssets), 140, yPos);
      doc.setFont(undefined, 'normal');
      yPos += lineHeight * 2;
      
      // Liabilities
      doc.setFontSize(14);
      doc.text('Liabilities', 14, yPos);
      yPos += lineHeight * 1.5;
      
      // Header for Liabilities
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Liability Type", 14, yPos);
      doc.text("Amount", 140, yPos);
      yPos += lineHeight;
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos - 2, 196, yPos - 2);
      
      // Liability items
      doc.setTextColor(0, 0, 0);
      let liabilitiesRendered = false;
      if (data.liabilities) {
        Object.entries(data.liabilities).forEach(([key, value]) => {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          doc.text(label, 14, yPos);
          doc.text(formatCurrency(value), 140, yPos);
          yPos += lineHeight;
          liabilitiesRendered = true;
        });
      }
      
      if (!liabilitiesRendered) {
        doc.text("No liability data available", 14, yPos);
        yPos += lineHeight;
      }
      
      // Total Liabilities
      doc.setFillColor(255, 240, 240);
      doc.rect(14, yPos - 4, 182, lineHeight, 'F');
      doc.setFont(undefined, 'bold');
      doc.text("Total Liabilities", 14, yPos);
      doc.text(formatCurrency(data.totalLiabilities), 140, yPos);
      doc.setFont(undefined, 'normal');
      yPos += lineHeight * 2;
      
      // Check if we need a new page
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      
      // Equity
      doc.setFontSize(14);
      doc.text('Equity', 14, yPos);
      yPos += lineHeight * 1.5;
      
      // Header for Equity
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Equity Component", 14, yPos);
      doc.text("Amount", 140, yPos);
      yPos += lineHeight;
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos - 2, 196, yPos - 2);
      
      // Equity items
      doc.setTextColor(0, 0, 0);
      let equityRendered = false;
      if (data.equity) {
        Object.entries(data.equity).forEach(([key, value]) => {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          doc.text(label, 14, yPos);
          doc.text(formatCurrency(value), 140, yPos);
          yPos += lineHeight;
          equityRendered = true;
        });
      }
      
      if (!equityRendered) {
        doc.text("No equity data available", 14, yPos);
        yPos += lineHeight;
      }
      
      // Total Equity
      doc.setFillColor(240, 240, 255);
      doc.rect(14, yPos - 4, 182, lineHeight, 'F');
      doc.setFont(undefined, 'bold');
      doc.text("Total Equity", 14, yPos);
      doc.text(formatCurrency(data.totalEquity), 140, yPos);
      doc.setFont(undefined, 'normal');
    } else if (type === 'cash_flow') {
      // Cash Flow Statement
      doc.setFontSize(14);
      doc.text('Operating Activities', 14, yPos);
      yPos += lineHeight * 1.5;
      
      // Header for Operating Activities
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Description", 14, yPos);
      doc.text("Amount", 140, yPos);
      yPos += lineHeight;
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos - 2, 196, yPos - 2);
      
      // Operating Activities items
      doc.setTextColor(0, 0, 0);
      let operatingRendered = false;
      if (data.operatingActivities && data.operatingActivities.length > 0) {
        data.operatingActivities.forEach(item => {
          doc.text(item.description, 14, yPos);
          doc.text(formatCurrency(item.amount), 140, yPos);
          yPos += lineHeight;
          operatingRendered = true;
        });
      }
      
      if (!operatingRendered) {
        doc.text("No operating activities data available", 14, yPos);
        yPos += lineHeight;
      }
      
      // Net Operating Cash
      doc.setFillColor(240, 240, 255);
      doc.rect(14, yPos - 4, 182, lineHeight, 'F');
      doc.setFont(undefined, 'bold');
      doc.text("Net Cash from Operating Activities", 14, yPos);
      doc.text(formatCurrency(data.netOperatingCash), 140, yPos);
      doc.setFont(undefined, 'normal');
      yPos += lineHeight * 2;
      
      // Check if we need a new page
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      // Investing Activities
      doc.setFontSize(14);
      doc.text('Investing Activities', 14, yPos);
      yPos += lineHeight * 1.5;
      
      // Header for Investing Activities
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Description", 14, yPos);
      doc.text("Amount", 140, yPos);
      yPos += lineHeight;
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos - 2, 196, yPos - 2);
      
      // Investing Activities items
      doc.setTextColor(0, 0, 0);
      let investingRendered = false;
      if (data.investingActivities && data.investingActivities.length > 0) {
        data.investingActivities.forEach(item => {
          doc.text(item.description, 14, yPos);
          doc.text(formatCurrency(item.amount), 140, yPos);
          yPos += lineHeight;
          investingRendered = true;
        });
      }
      
      if (!investingRendered) {
        doc.text("No investing activities data available", 14, yPos);
        yPos += lineHeight;
      }
      
      // Net Investing Cash
      doc.setFillColor(240, 240, 255);
      doc.rect(14, yPos - 4, 182, lineHeight, 'F');
      doc.setFont(undefined, 'bold');
      doc.text("Net Cash from Investing Activities", 14, yPos);
      doc.text(formatCurrency(data.netInvestingCash), 140, yPos);
      doc.setFont(undefined, 'normal');
      yPos += lineHeight * 2;
      
      // Check if we need a new page
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      // Financing Activities
      doc.setFontSize(14);
      doc.text('Financing Activities', 14, yPos);
      yPos += lineHeight * 1.5;
      
      // Header for Financing Activities
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Description", 14, yPos);
      doc.text("Amount", 140, yPos);
      yPos += lineHeight;
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos - 2, 196, yPos - 2);
      
      // Financing Activities items
      doc.setTextColor(0, 0, 0);
      let financingRendered = false;
      if (data.financingActivities && data.financingActivities.length > 0) {
        data.financingActivities.forEach(item => {
          doc.text(item.description, 14, yPos);
          doc.text(formatCurrency(item.amount), 140, yPos);
          yPos += lineHeight;
          financingRendered = true;
        });
      }
      
      if (!financingRendered) {
        doc.text("No financing activities data available", 14, yPos);
        yPos += lineHeight;
      }
      
      // Net Financing Cash
      doc.setFillColor(240, 240, 255);
      doc.rect(14, yPos - 4, 182, lineHeight, 'F');
      doc.setFont(undefined, 'bold');
      doc.text("Net Cash from Financing Activities", 14, yPos);
      doc.text(formatCurrency(data.netFinancingCash), 140, yPos);
      doc.setFont(undefined, 'normal');
      yPos += lineHeight * 2;
      
      // Check if we need a new page
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      // Summary
      doc.setFillColor(240, 255, 240);
      doc.rect(14, yPos - 4, 182, lineHeight, 'F');
      doc.setFont(undefined, 'bold');
      doc.text("Net Increase in Cash", 14, yPos);
      doc.text(formatCurrency(data.netCashIncrease), 140, yPos);
      yPos += lineHeight * 1.5;
      
      doc.setFillColor(240, 240, 240);
      doc.rect(14, yPos - 4, 182, lineHeight, 'F');
      doc.text("Beginning Cash Balance", 14, yPos);
      doc.text(formatCurrency(data.beginningCashBalance), 140, yPos);
      yPos += lineHeight * 1.5;
      
      doc.setFillColor(240, 240, 255);
      doc.rect(14, yPos - 4, 182, lineHeight, 'F');
      doc.text("Ending Cash Balance", 14, yPos);
      doc.text(formatCurrency(data.endingCashBalance), 140, yPos);
      doc.setFont(undefined, 'normal');
    } else if (type === 'tax_summary') {
      // Tax Summary
      doc.setFontSize(14);
      doc.text('Taxable Income', 14, yPos);
      yPos += lineHeight * 1.5;
      
      // Taxable Income
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("Gross Revenue", 14, yPos);
      doc.text(formatCurrency(data.grossRevenue), 140, yPos);
      yPos += lineHeight;
      
      doc.text("Deductible Expenses", 14, yPos);
      doc.text(formatCurrency(data.deductibleExpenses), 140, yPos);
      yPos += lineHeight * 1.5;
      
      // Net Taxable Income
      doc.setFillColor(240, 240, 255);
      doc.rect(14, yPos - 4, 182, lineHeight, 'F');
      doc.setFont(undefined, 'bold');
      doc.text("Net Taxable Income", 14, yPos);
      doc.text(formatCurrency(data.netTaxableIncome), 140, yPos);
      doc.setFont(undefined, 'normal');
      yPos += lineHeight * 2;
      
      // Tax Calculations
      doc.setFontSize(14);
      doc.text('Tax Calculations', 14, yPos);
      yPos += lineHeight * 1.5;
      
      // Tax Calculation Items
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      let taxCalcRendered = false;
      if (data.taxCalculations && data.taxCalculations.length > 0) {
        data.taxCalculations.forEach(item => {
          doc.text(item.description, 14, yPos);
          doc.text(formatCurrency(item.amount), 140, yPos);
          yPos += lineHeight;
          taxCalcRendered = true;
        });
      }
      
      if (!taxCalcRendered) {
        doc.text("No tax calculation data available", 14, yPos);
        yPos += lineHeight;
      }
      
      // Total Tax
      doc.setFillColor(255, 240, 240);
      doc.rect(14, yPos - 4, 182, lineHeight, 'F');
      doc.setFont(undefined, 'bold');
      doc.text("Total Estimated Tax", 14, yPos);
      doc.text(formatCurrency(data.totalTax), 140, yPos);
      doc.setFont(undefined, 'normal');
      yPos += lineHeight * 2;
      
      // After-Tax Results
      doc.setFontSize(14);
      doc.text('After-Tax Results', 14, yPos);
      yPos += lineHeight * 1.5;
      
      // After-Tax Results Items
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      doc.setFillColor(240, 255, 240);
      doc.rect(14, yPos - 4, 182, lineHeight, 'F');
      doc.setFont(undefined, 'bold');
      doc.text("Net Income After Tax", 14, yPos);
      doc.text(formatCurrency(data.netIncomeAfterTax), 140, yPos);
      doc.setFont(undefined, 'normal');
      yPos += lineHeight * 1.5;
      
      doc.text("Effective Tax Rate", 14, yPos);
      doc.text(data.effectiveTaxRate ? data.effectiveTaxRate.toFixed(1) + '%' : '0%', 140, yPos);
    } else {
      // Generic report with key-value pairs
      doc.setFontSize(14);
      doc.text('Report Data', 14, yPos);
      yPos += lineHeight * 1.5;
      
      // Header
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Item", 14, yPos);
      doc.text("Value", 140, yPos);
      yPos += lineHeight;
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos - 2, 196, yPos - 2);
      
      // Data items
      doc.setTextColor(0, 0, 0);
      let itemsRendered = false;
      
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'number' || typeof value === 'string') {
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
          doc.text(label, 14, yPos);
          const valueText = typeof value === 'number' ? formatCurrency(value) : value.toString();
          doc.text(valueText, 140, yPos);
          yPos += lineHeight;
          itemsRendered = true;
          
          // Add a new page if we're running out of space
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
        }
      });
      
      if (!itemsRendered) {
        doc.text("No report data available", 14, yPos);
      }
    }
    
    // Add footer with page number
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(
        `Page ${i} of ${pageCount} - Generated by Finastra ERP Finance Module`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Use a simple safe filename to avoid Windows issues
    const safeFileName = `Report${type.charAt(0).toUpperCase() + type.slice(1)}.pdf`;
    doc.save(safeFileName);
  };
  
  // Export to Excel with better formatting
  const exportToExcel = (reportToExport) => {
    const reportData = reportToExport || report;
    if (!reportData) return;
    
    const { type, data, period } = reportData;
    const reportTitle = getReportTypeLabel(type);
    
    // Create a very simple filename that works on Windows
    const safeFileName = `Report${type.charAt(0).toUpperCase() + type.slice(1)}.xlsx`;
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    let excelData = [];
    
    // Add company header and report information
    excelData.push(['Finastra Financial ERP']);
    excelData.push([reportTitle]);
    excelData.push([`Report Period: ${formatDate(period.startDate)} - ${formatDate(period.endDate)}`]);
    excelData.push([`Generated: ${new Date().toLocaleString()}`]);
    excelData.push([]);  // Empty row for spacing
    
    if (type === 'income_statement') {
      // === INCOME STATEMENT ===
      excelData.push(['REVENUE', '', '']);
      excelData.push(['Category', 'Amount', '']);
      
      // Revenue items
      if (data.revenues && data.revenues.length > 0) {
        data.revenues.forEach(item => {
          excelData.push([item.category, parseFloat(item.amount), '']);
        });
      } else {
        excelData.push(['No revenue data available', '', '']);
      }
      
      // Total Revenue
      excelData.push(['Total Revenue', parseFloat(data.totalRevenue), '']);
      excelData.push(['', '', '']);  // Empty row
      
      // Expenses section
      excelData.push(['EXPENSES', '', '']);
      excelData.push(['Category', 'Amount', '']);
      
      // Expense items
      if (data.expenses && data.expenses.length > 0) {
        data.expenses.forEach(item => {
          excelData.push([item.category, parseFloat(item.amount), '']);
        });
      } else {
        excelData.push(['No expense data available', '', '']);
      }
      
      // Total Expenses
      excelData.push(['Total Expenses', parseFloat(data.totalExpenses), '']);
      excelData.push(['', '', '']);  // Empty row
      
      // Net Income
      excelData.push(['NET INCOME', parseFloat(data.netIncome), '']);
      
    } else if (type === 'balance_sheet') {
      // === BALANCE SHEET ===
      excelData.push(['ASSETS', '', '']);
      excelData.push(['Asset Type', 'Amount', '']);
      
      // Asset items
      let assetsRendered = false;
      if (data.assets) {
        Object.entries(data.assets).forEach(([key, value]) => {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          excelData.push([label, parseFloat(value), '']);
          assetsRendered = true;
        });
      }
      
      if (!assetsRendered) {
        excelData.push(['No asset data available', '', '']);
      }
      
      // Total Assets
      excelData.push(['Total Assets', parseFloat(data.totalAssets), '']);
      excelData.push(['', '', '']);  // Empty row
      
      // Liabilities section
      excelData.push(['LIABILITIES', '', '']);
      excelData.push(['Liability Type', 'Amount', '']);
      
      // Liabilities items
      let liabilitiesRendered = false;
      if (data.liabilities) {
        Object.entries(data.liabilities).forEach(([key, value]) => {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          excelData.push([label, parseFloat(value), '']);
          liabilitiesRendered = true;
        });
      }
      
      if (!liabilitiesRendered) {
        excelData.push(['No liability data available', '', '']);
      }
      
      // Total Liabilities
      excelData.push(['Total Liabilities', parseFloat(data.totalLiabilities), '']);
      excelData.push(['', '', '']);  // Empty row
      
      // Equity section
      excelData.push(['EQUITY', '', '']);
      excelData.push(['Equity Component', 'Amount', '']);
      
      // Equity items
      let equityRendered = false;
      if (data.equity) {
        Object.entries(data.equity).forEach(([key, value]) => {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          excelData.push([label, parseFloat(value), '']);
          equityRendered = true;
        });
      }
      
      if (!equityRendered) {
        excelData.push(['No equity data available', '', '']);
      }
      
      // Total Equity
      excelData.push(['Total Equity', parseFloat(data.totalEquity), '']);
      
    } else if (type === 'cash_flow') {
      // === CASH FLOW STATEMENT ===
      excelData.push(['OPERATING ACTIVITIES', '', '']);
      excelData.push(['Description', 'Amount', '']);
      
      // Operating activities items
      let operatingRendered = false;
      if (data.operatingActivities && data.operatingActivities.length > 0) {
        data.operatingActivities.forEach(item => {
          excelData.push([item.description, parseFloat(item.amount), '']);
          operatingRendered = true;
        });
      }
      
      if (!operatingRendered) {
        excelData.push(['No operating activities data available', '', '']);
      }
      
      // Net Operating Cash
      excelData.push(['Net Cash from Operating Activities', parseFloat(data.netOperatingCash), '']);
      excelData.push(['', '', '']);  // Empty row
      
      // Investing activities
      excelData.push(['INVESTING ACTIVITIES', '', '']);
      excelData.push(['Description', 'Amount', '']);
      
      // Investing activities items
      let investingRendered = false;
      if (data.investingActivities && data.investingActivities.length > 0) {
        data.investingActivities.forEach(item => {
          excelData.push([item.description, parseFloat(item.amount), '']);
          investingRendered = true;
        });
      }
      
      if (!investingRendered) {
        excelData.push(['No investing activities data available', '', '']);
      }
      
      // Net Investing Cash
      excelData.push(['Net Cash from Investing Activities', parseFloat(data.netInvestingCash), '']);
      excelData.push(['', '', '']);  // Empty row
      
      // Financing activities
      excelData.push(['FINANCING ACTIVITIES', '', '']);
      excelData.push(['Description', 'Amount', '']);
      
      // Financing activities items
      let financingRendered = false;
      if (data.financingActivities && data.financingActivities.length > 0) {
        data.financingActivities.forEach(item => {
          excelData.push([item.description, parseFloat(item.amount), '']);
          financingRendered = true;
        });
      }
      
      if (!financingRendered) {
        excelData.push(['No financing activities data available', '', '']);
      }
      
      // Net Financing Cash
      excelData.push(['Net Cash from Financing Activities', parseFloat(data.netFinancingCash), '']);
      excelData.push(['', '', '']);  // Empty row
      
      // Summary section
      excelData.push(['SUMMARY', '', '']);
      excelData.push(['Net Increase in Cash', parseFloat(data.netCashIncrease), '']);
      excelData.push(['Beginning Cash Balance', parseFloat(data.beginningCashBalance), '']);
      excelData.push(['Ending Cash Balance', parseFloat(data.endingCashBalance), '']);
      
    } else if (type === 'expense_by_category') {
      // === EXPENSES BY CATEGORY ===
      excelData.push(['EXPENSES BY CATEGORY', '', '']);
      excelData.push(['Category', 'Amount', '% of Total']);
      
      // Expense category items
      if (data.expensesByCategory && data.expensesByCategory.length > 0) {
        data.expensesByCategory.forEach(item => {
          const percentage = data.totalExpenses ? (item.amount / data.totalExpenses * 100).toFixed(1) : '0';
          excelData.push([
            item.category, 
            parseFloat(item.amount), 
            parseFloat(percentage)
          ]);
        });
      } else {
        excelData.push(['No expense data available', '', '']);
      }
      
      // Total
      excelData.push(['Total Expenses', parseFloat(data.totalExpenses), 100]);
      
    } else if (type === 'tax_summary') {
      // === TAX SUMMARY ===
      excelData.push(['TAXABLE INCOME', '', '']);
      excelData.push(['Gross Revenue', parseFloat(data.grossRevenue), '']);
      excelData.push(['Deductible Expenses', parseFloat(data.deductibleExpenses), '']);
      excelData.push(['Net Taxable Income', parseFloat(data.netTaxableIncome), '']);
      excelData.push(['', '', '']);  // Empty row
      
      // Tax calculations
      excelData.push(['TAX CALCULATIONS', '', '']);
      excelData.push(['Description', 'Amount', '']);
      
      // Tax calculation items
      let taxCalcRendered = false;
      if (data.taxCalculations && data.taxCalculations.length > 0) {
        data.taxCalculations.forEach(item => {
          excelData.push([item.description, parseFloat(item.amount), '']);
          taxCalcRendered = true;
        });
      }
      
      if (!taxCalcRendered) {
        excelData.push(['No tax calculation data available', '', '']);
      }
      
      // Total Tax
      excelData.push(['Total Estimated Tax', parseFloat(data.totalTax), '']);
      excelData.push(['', '', '']);  // Empty row
      
      // After-tax results
      excelData.push(['AFTER-TAX RESULTS', '', '']);
      excelData.push(['Net Income After Tax', parseFloat(data.netIncomeAfterTax), '']);
      excelData.push(['Effective Tax Rate', data.effectiveTaxRate ? parseFloat(data.effectiveTaxRate) : 0, '%']);
      
    } else {
      // Generic format for other report types
      excelData.push(['REPORT DATA', '', '']);
      excelData.push(['Item', 'Value', '']);
      
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'number' || typeof value === 'string') {
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
          excelData.push([label, typeof value === 'number' ? parseFloat(value) : value, '']);
        }
      });
    }
    
    // Add footer
    excelData.push(['']);
    excelData.push(['Generated by Finastra ERP Finance Module', '', '']);
    
    // Create worksheet with the data
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    
    // Set column widths
    const colWidths = [{ wch: 40 }, { wch: 15 }, { wch: 15 }];
    ws['!cols'] = colWidths;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, reportTitle);
    
    // Try the blob approach for better browser compatibility
    try {
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = url;
      a.download = safeFileName;
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error('Excel export error:', e);
      alert('Export failed. Please try again with a different format.');
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format date and time for display
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Currency formatter
  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Get report type label
  const getReportTypeLabel = (type) => {
    const reportTypes = {
      'income_statement': 'Income Statement',
      'balance_sheet': 'Balance Sheet',
      'cash_flow': 'Cash Flow Statement',
      'expense_by_category': 'Expenses by Category',
      'tax_summary': 'Tax Summary'
    };
    return reportTypes[type] || type;
  };
  
  // Render report history
  const renderReportHistory = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary" />
          <p className="mt-3 text-muted">Loading report history...</p>
        </div>
      );
    }
    
    if (reportHistory.length === 0) {
      return (
        <div className="text-center py-5">
          <i className="fas fa-history fa-4x text-muted mb-3"></i>
          <h5>No Reports Generated Yet</h5>
          <p className="text-muted">Generate a report to see it listed here</p>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setActiveTab('generator')}
          >
            <i className="fas fa-plus me-1"></i>
            Generate New Report
          </Button>
        </div>
      );
    }
    
    return (
      <div className="table-responsive">
        <Table hover className="align-middle">
          <thead className="table-light">
            <tr>
              <th>Report Type</th>
              <th>Date Range</th>
              <th>Generated</th>
              <th>Summary</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reportHistory.map((report, index) => (
              <tr key={`history-${index}`}>
                <td>
                  <div className="d-flex align-items-center">
                    {ReportTypeLogos[report.type] ? (
                      <span className="me-2">{ReportTypeLogos[report.type]}</span>
                    ) : (
                      <i className="fas fa-file-alt text-primary me-2"></i>
                    )}
                    <span>{getReportTypeLabel(report.type)}</span>
                  </div>
                </td>
                <td>
                  <small>
                    {formatDate(report.startDate)} - {formatDate(report.endDate)}
                  </small>
                </td>
                <td>
                  <small className="text-muted">
                    {report.timestamp ? formatDateTime(report.timestamp) : 'N/A'}
                  </small>
                </td>
                <td>
                  <small className="text-muted">
                    {report.reportSummary || 'No summary available'}
                  </small>
                </td>
                <td className="text-end">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleLoadReport(report)}
                    className="me-1"
                  >
                    <i className="fas fa-eye me-1"></i>
                    View
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => handleExportHistoryReport(report, 'pdf')}
                    className="me-1"
                  >
                    <i className="fas fa-file-pdf"></i>
                  </Button>
                  <Button 
                    variant="outline-success" 
                    size="sm"
                    onClick={() => handleExportHistoryReport(report, 'excel')}
                  >
                    <i className="fas fa-file-excel"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };
  
  // Helper to render the appropriate report view
  const renderReport = () => {
    if (!report) return (
      <div className="text-center py-5">
        <i className="fas fa-file-invoice fa-4x text-muted mb-3"></i>
        <h5>No Report Generated Yet</h5>
        <p className="text-muted">Use the Report Generator tab to create a financial report</p>
        <Button 
          variant="primary" 
          size="sm"
          onClick={() => setActiveTab('generator')}
        >
          <i className="fas fa-cog me-1"></i>
          Go to Report Generator
        </Button>
      </div>
    );
    
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary" />
          <p className="mt-3 text-muted">Generating report...</p>
        </div>
      );
    }
    
    const { type, data, period } = report;
    
    // Report title mapping
    const reportTitles = {
      income_statement: 'Income Statement',
      balance_sheet: 'Balance Sheet',
      cash_flow: 'Cash Flow Statement',
      tax_summary: 'Tax Summary',
      expense_by_category: 'Expenses by Category'
    };
    
    return (
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-primary text-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{reportTitles[type] || 'Financial Report'}</h5>
            <span className="bg-white text-dark px-3 py-1 rounded-pill">
              {formatDate(period.startDate)} - {formatDate(period.endDate)}
            </span>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Render different report types */}
          {type === 'income_statement' && (
            <div className="table-responsive">
              <Table bordered hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th colSpan="2" className="text-center">Income Statement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th colSpan="2" className="bg-light">Revenue</th>
                  </tr>
                  {data.revenues && data.revenues.map((item, index) => (
                    <tr key={`revenue-${index}`}>
                      <td className="ps-4">{item.category}</td>
                      <td className="text-end">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                  <tr className="table-info">
                    <th>Total Revenue</th>
                    <th className="text-end">{formatCurrency(data.totalRevenue)}</th>
                  </tr>
                  
                  <tr>
                    <th colSpan="2" className="bg-light">Expenses</th>
                  </tr>
                  {data.expenses && data.expenses.map((item, index) => (
                    <tr key={`expense-${index}`}>
                      <td className="ps-4">{item.category}</td>
                      <td className="text-end">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                  <tr className="table-danger">
                    <th>Total Expenses</th>
                    <th className="text-end">{formatCurrency(data.totalExpenses)}</th>
                  </tr>
                  
                  <tr className={data.netIncome >= 0 ? 'table-success' : 'table-danger'}>
                    <th>Net Income</th>
                    <th className="text-end">{formatCurrency(data.netIncome)}</th>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
          
          {type === 'balance_sheet' && (
            <BalanceSheetTable 
              balanceSheetData={data}
              asOfDate={period.endDate}
            />
          )}
          
          {type === 'cash_flow' && (
            <div className="table-responsive">
              <Table bordered hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th colSpan="2" className="text-center">Cash Flow Statement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th colSpan="2" className="bg-light">Operating Activities</th>
                  </tr>
                  {data.operatingActivities && data.operatingActivities.map((item, index) => (
                    <tr key={`operating-${index}`}>
                      <td className="ps-4">{item.description}</td>
                      <td className="text-end">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                  <tr className="table-info">
                    <th>Net Cash from Operating Activities</th>
                    <th className="text-end">{formatCurrency(data.netOperatingCash)}</th>
                  </tr>
                  
                  <tr>
                    <th colSpan="2" className="bg-light">Investing Activities</th>
                  </tr>
                  {data.investingActivities && data.investingActivities.map((item, index) => (
                    <tr key={`investing-${index}`}>
                      <td className="ps-4">{item.description}</td>
                      <td className="text-end">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                  <tr className="table-info">
                    <th>Net Cash from Investing Activities</th>
                    <th className="text-end">{formatCurrency(data.netInvestingCash)}</th>
                  </tr>
                  
                  <tr>
                    <th colSpan="2" className="bg-light">Financing Activities</th>
                  </tr>
                  {data.financingActivities && data.financingActivities.map((item, index) => (
                    <tr key={`financing-${index}`}>
                      <td className="ps-4">{item.description}</td>
                      <td className="text-end">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                  <tr className="table-info">
                    <th>Net Cash from Financing Activities</th>
                    <th className="text-end">{formatCurrency(data.netFinancingCash)}</th>
                  </tr>
                  
                  <tr className="table-primary">
                    <th>Net Increase in Cash</th>
                    <th className="text-end">{formatCurrency(data.netCashIncrease)}</th>
                  </tr>
                  <tr>
                    <th>Beginning Cash Balance</th>
                    <th className="text-end">{formatCurrency(data.beginningCashBalance)}</th>
                  </tr>
                  <tr className="table-success">
                    <th>Ending Cash Balance</th>
                    <th className="text-end">{formatCurrency(data.endingCashBalance)}</th>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
          
          {type === 'expense_by_category' && (
            <div className="table-responsive">
              <Table bordered hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="text-center">Category</th>
                    <th className="text-center">Amount</th>
                    <th className="text-center">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.expensesByCategory && data.expensesByCategory.map((item, index) => (
                    <tr key={`expense-cat-${index}`}>
                      <td className="ps-4">{item.category}</td>
                      <td className="text-end">{formatCurrency(item.amount)}</td>
                      <td className="text-end">
                        {data.totalExpenses ? (item.amount / data.totalExpenses * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  ))}
                  <tr className="table-danger">
                    <th>Total Expenses</th>
                    <th className="text-end">{formatCurrency(data.totalExpenses)}</th>
                    <th className="text-end">100%</th>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
          
          {type === 'tax_summary' && (
            <div className="table-responsive">
              <Table bordered hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th colSpan="2" className="text-center">Tax Summary</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th colSpan="2" className="bg-light">Taxable Income</th>
                  </tr>
                  <tr>
                    <td className="ps-4">Gross Revenue</td>
                    <td className="text-end">{formatCurrency(data.grossRevenue)}</td>
                  </tr>
                  <tr>
                    <td className="ps-4">Deductible Expenses</td>
                    <td className="text-end">{formatCurrency(data.deductibleExpenses)}</td>
                  </tr>
                  <tr className="table-info">
                    <th>Net Taxable Income</th>
                    <th className="text-end">{formatCurrency(data.netTaxableIncome)}</th>
                  </tr>
                  
                  <tr>
                    <th colSpan="2" className="bg-light">Tax Calculations</th>
                  </tr>
                  {data.taxCalculations && data.taxCalculations.map((item, index) => (
                    <tr key={`tax-calc-${index}`}>
                      <td className="ps-4">{item.description}</td>
                      <td className="text-end">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                  <tr className="table-danger">
                    <th>Total Estimated Tax</th>
                    <th className="text-end">{formatCurrency(data.totalTax)}</th>
                  </tr>
                  
                  <tr>
                    <th colSpan="2" className="bg-light">After-Tax Results</th>
                  </tr>
                  <tr className="table-success">
                    <th>Net Income After Tax</th>
                    <th className="text-end">{formatCurrency(data.netIncomeAfterTax)}</th>
                  </tr>
                  <tr>
                    <td>Effective Tax Rate</td>
                    <td className="text-end">
                      {data.effectiveTaxRate ? data.effectiveTaxRate.toFixed(1) : 0}%
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
          
          <div className="d-flex justify-content-end mt-3">
            <div className="btn-group me-2">
              <Button variant="outline-secondary" onClick={() => exportToPDF()}>
                <i className="fas fa-file-pdf me-1"></i>
                Export PDF
              </Button>
              <Button variant="outline-success" onClick={() => exportToExcel()}>
                <i className="fas fa-file-excel me-1"></i>
                Export Excel
              </Button>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setActiveTab('generator')}
            >
              <i className="fas fa-cog me-1"></i>
              Generate Another Report
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  };
  
  // Render balance sheet view
  const renderBalanceSheet = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary" />
          <p className="mt-3 text-muted">Loading balance sheet data...</p>
        </div>
      );
    }
    
    return (
      <BalanceSheetTable
        balanceSheetData={balanceSheet}
        asOfDate={new Date().toISOString().split('T')[0]}
      />
    );
  };
  
  return (
    <Container fluid className="py-4 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Financial Reports</h2>
          <p className="text-muted mb-0">Generate and view comprehensive financial reports</p>
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
      
      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'generator'} 
            onClick={() => setActiveTab('generator')}
          >
            <i className="fas fa-cog me-1"></i>
            Report Generator
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'report'} 
            onClick={() => setActiveTab('report')}
            disabled={!report}
          >
            <i className="fas fa-file-invoice me-1"></i>
            Generated Report
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'balance-sheet'} 
            onClick={() => setActiveTab('balance-sheet')}
          >
            <i className="fas fa-file-invoice-dollar me-1"></i>
            Balance Sheet
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
          >
            <i className="fas fa-history me-1"></i>
            Report History
          </Nav.Link>
        </Nav.Item>
      </Nav>
      
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          {activeTab === 'generator' && (
            <div className="p-4">
              <h5 className="mb-3">Generate Financial Report</h5>
              <Row>
                <Col lg={6}>
                  <ReportGenerator onSubmit={handleGenerateReport} />
                </Col>
                <Col lg={6} className="mt-4 mt-lg-0">
                  <div className="bg-light rounded p-4 h-100">
                    <h5 className="mb-3">Report Types</h5>
                    <div className="small">
                      <div className="d-flex align-items-center mb-3">
                        {ReportTypeLogos.income_statement}
                        <div className="ms-3">
                          <p className="mb-0"><strong>Income Statement</strong></p>
                          <p className="mb-0 text-muted">Shows revenue, expenses, and net income for the selected period.</p>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center mb-3">
                        {ReportTypeLogos.balance_sheet}
                        <div className="ms-3">
                          <p className="mb-0"><strong>Balance Sheet</strong></p>
                          <p className="mb-0 text-muted">Displays assets, liabilities, and equity as of a specific date.</p>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center mb-3">
                        {ReportTypeLogos.cash_flow}
                        <div className="ms-3">
                          <p className="mb-0"><strong>Cash Flow Statement</strong></p>
                          <p className="mb-0 text-muted">Tracks cash movement through operating, investing, and financing activities.</p>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center mb-3">
                        {ReportTypeLogos.expense_by_category}
                        <div className="ms-3">
                          <p className="mb-0"><strong>Expenses by Category</strong></p>
                          <p className="mb-0 text-muted">Breaks down expenses by category with percentage of total.</p>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center">
                        {ReportTypeLogos.tax_summary}
                        <div className="ms-3">
                          <p className="mb-0"><strong>Tax Summary</strong></p>
                          <p className="mb-0 text-muted">Provides estimated tax calculations based on income and expenses.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
          
          {activeTab === 'report' && renderReport()}
          
          {activeTab === 'balance-sheet' && (
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Current Balance Sheet</h5>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={fetchInitialData}
                  disabled={loading}
                >
                  <i className="fas fa-sync-alt me-1"></i>
                  Refresh Data
                </Button>
              </div>
              {renderBalanceSheet()}
            </div>
          )}
          
          {activeTab === 'history' && (
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Report History</h5>
                <div>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={fetchReportHistory}
                    disabled={loading}
                    className="me-2"
                  >
                    <i className="fas fa-sync-alt me-1"></i>
                    Refresh History
                  </Button>
                  {reportHistory.length > 0 && (
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => console.log("Report history data:", reportHistory)}
                    >
                      <i className="fas fa-info-circle me-1"></i>
                      Debug Info
                    </Button>
                  )}
                </div>
              </div>
              {error && (
                <Alert variant="warning" className="mb-3">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}
              {renderReportHistory()}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Reports;