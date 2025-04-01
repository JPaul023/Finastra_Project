import React from 'react';
import { Table, Card } from 'react-bootstrap';

const BalanceSheetTable = ({ balanceSheetData, asOfDate }) => {
  const {
    assets = {},
    liabilities = {},
    equity = {}
  } = balanceSheetData || {};
  
  // Format currency values
  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Calculate totals
  const totalAssets = Object.values(assets).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  const totalLiabilities = Object.values(liabilities).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  const totalEquity = Object.values(equity).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  
  // Format the date for display
  const formattedDate = asOfDate ? new Date(asOfDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <Card className="shadow-sm h-100">
      <Card.Header className="bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Balance Sheet</h5>
          <span className="text-muted">As of {formattedDate}</span>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table className="mb-0">
            <thead>
              <tr className="table-light">
                <th colSpan="2" className="border-bottom-0">ASSETS</th>
              </tr>
            </thead>
            <tbody>
              {/* Assets Section */}
              {Object.entries(assets).map(([key, value]) => (
                <tr key={`asset-${key}`}>
                  <td>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</td>
                  <td className="text-end">{formatCurrency(value)}</td>
                </tr>
              ))}
              <tr className="border-top">
                <th>Total Assets</th>
                <th className="text-end">{formatCurrency(totalAssets)}</th>
              </tr>
              
              {/* Liabilities Section */}
              <tr className="table-light">
                <th colSpan="2" className="border-bottom-0">LIABILITIES</th>
              </tr>
              {Object.entries(liabilities).map(([key, value]) => (
                <tr key={`liability-${key}`}>
                  <td>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</td>
                  <td className="text-end">{formatCurrency(value)}</td>
                </tr>
              ))}
              <tr className="border-top">
                <th>Total Liabilities</th>
                <th className="text-end">{formatCurrency(totalLiabilities)}</th>
              </tr>
              
              {/* Equity Section */}
              <tr className="table-light">
                <th colSpan="2" className="border-bottom-0">EQUITY</th>
              </tr>
              {Object.entries(equity).map(([key, value]) => (
                <tr key={`equity-${key}`}>
                  <td>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</td>
                  <td className="text-end">{formatCurrency(value)}</td>
                </tr>
              ))}
              <tr className="border-top">
                <th>Total Equity</th>
                <th className="text-end">{formatCurrency(totalEquity)}</th>
              </tr>
              
              {/* Final Balance Check */}
              <tr className="table-light">
                <th>Total Liabilities & Equity</th>
                <th className="text-end">{formatCurrency(totalLiabilities + totalEquity)}</th>
              </tr>
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BalanceSheetTable;