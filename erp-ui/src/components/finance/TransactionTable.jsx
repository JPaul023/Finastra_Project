import React from 'react';
import { Table, Button, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';

const TransactionTable = ({ transactions, type, onEdit, onDelete }) => {
  // Format transaction data for consistent display
  const formatTransactionData = (transaction, type) => {
    if (type === 'income') {
      return {
        id: transaction.id,
        date: transaction.date,
        description: transaction.description || '',
        category: transaction.category || 'other_income',
        subcategory: transaction.subcategory || '',
        amount: transaction.amount,
        source: transaction.source || 'N/A',
        reference: transaction.reference_number || '-',  // Updated to use reference_number
        notes: transaction.notes || ''
      };
    } else {
      return {
        id: transaction.id,
        date: transaction.date,
        description: transaction.description || '',
        category: transaction.category || 'operational_expenses',
        subcategory: transaction.subcategory || '',
        amount: transaction.amount,
        vendor: transaction.payee || 'N/A',
        paymentMethod: transaction.payment_method || 'other',  // Updated to use payment_method
        expenseType: transaction.expense_type || 'N/A',  // Added expense_type
        notes: transaction.notes || ''
      };
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format currency for display
  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Income categories and subcategories for Finastra ERP
  const incomeCategories = {
    'sales_revenue': 'Sales Revenue',
    'interest_income': 'Interest Income',
    'investment_return': 'Investment Return',
    'other_income': 'Other Income'
  };
  
  const incomeSubcategories = {
    'subscription_fees': 'Subscription Fees (ERP plans)',
    'custom_software': 'Custom Software Solutions',
    'sales': 'Sales',
    'system_setup': 'System Setup & Deployment Fees',
    'training_services': 'Training Services Fees',
    'loan_interest': 'Loan Interest Revenue',
    'wealth_management': 'Investment & Wealth Management Fees',
    'forex_revenue': 'Foreign Exchange (Forex) Revenue',
    'interbank_lending': 'Interbank Lending & Liquidity Management',
    'payment_processing': 'Payment Processing Fees',
    'card_services': 'ATM & Card Service Fees',
    'insurance_products': 'Insurance & Financial Products',
    'api_monetization': 'Data & API Monetization'
  };
  
  // Expense categories and subcategories for Finastra ERP
  const expenseCategories = {
    'operational_expenses': 'Operational Expenses',
    'marketing_advertising': 'Marketing & Advertising',
    'supplies_office': 'Supplies & Office Expenses',
    'technology_infrastructure': 'Technology & Infrastructure',
    'employee_hr': 'Employee & HR Expenses',
    'compliance_legal': 'Compliance & Legal'
  };
  
  const expenseSubcategories = {
    'rent': 'Rent',
    'utilities': 'Utilities',
    'maintenance': 'Maintenance',
    'marketing': 'Marketing',
    'supplies': 'Supplies',
    'software_licenses': 'Software Licenses',
    'it_equipment': 'IT Equipment',
    'cloud_services': 'Cloud Services',
    'salaries': 'Salaries & Benefits',
    'training': 'Training & Development',
    'regulatory_fees': 'Regulatory Fees',
    'legal_consulting': 'Legal & Consulting Fees'
  };
  
  const paymentMethodMap = {
    'credit_card': 'Credit Card',
    'bank_transfer': 'Bank Transfer',
    'check': 'Check',
    'cash': 'Cash',
    'online': 'Online Payment',
    'other': 'Other'
  };
  
  // Get category display name
  const getCategoryDisplay = (transaction) => {
    if (type === 'income') {
      return incomeCategories[transaction.category] || transaction.category;
    } else {
      return expenseCategories[transaction.category] || transaction.category;
    }
  };
  
  // Get subcategory display name
  const getSubcategoryDisplay = (transaction) => {
    if (type === 'income') {
      return incomeSubcategories[transaction.subcategory] || transaction.subcategory;
    } else {
      return expenseSubcategories[transaction.subcategory] || transaction.subcategory;
    }
  };
  
  // Get payment method display text
  const getPaymentMethodDisplay = (transaction) => {
    if (!transaction.paymentMethod) return 'Not specified';
    return paymentMethodMap[transaction.paymentMethod] || transaction.paymentMethod;
  };
  
  // Get expense type display text
  const getExpenseTypeDisplay = (transaction) => {
    return transaction.expenseType || 'Not specified';
  };
  
  // Get category badge color based on category
  const getCategoryBadgeVariant = (category) => {
    if (type === 'income') {
      const colorMap = {
        'sales_revenue': 'primary',
        'interest_income': 'info',
        'investment_return': 'success',
        'other_income': 'warning'
      };
      return colorMap[category] || 'primary';
    } else {
      const colorMap = {
        'operational_expenses': 'danger',
        'marketing_advertising': 'purple',
        'supplies_office': 'info',
        'technology_infrastructure': 'primary',
        'employee_hr': 'warning',
        'compliance_legal': 'secondary'
      };
      return colorMap[category] || 'danger';
    }
  };
  
  // Get subcategory badge color
  const getSubcategoryBadgeVariant = (subcategory) => {
    if (type === 'income') {
      return 'light';
    } else {
      return 'light';
    }
  };
  
  return (
    <div className="table-responsive">
      <Table hover className="mb-0">
        <thead className="table-light">
          <tr>
            <th width="120">Date</th>
            <th>Description</th>
            {type === 'expense' && <th>Vendor/Payee</th>}
            {type === 'income' && <th>Reference</th>}
            <th>Category</th>
            {type === 'expense' && (
              <>
                <th>Type</th>
                <th>Payment Method</th>
              </>
            )}
            <th className="text-end">Amount</th>
            <th className="text-end" width="120">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={type === 'income' ? 6 : 8} className="text-center py-4 text-muted">
                No {type} transactions found.
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => {
              // Use the formatter to ensure consistent data structure
              const formattedTransaction = formatTransactionData(transaction, type);
              
              return (
                <tr key={formattedTransaction.id}>
                  <td>{formatDate(formattedTransaction.date)}</td>
                  <td>
                    <div>{formattedTransaction.description}</div>
                    {formattedTransaction.notes && (
                      <small className="text-muted d-block">{formattedTransaction.notes}</small>
                    )}
                  </td>
                  {type === 'expense' && <td>{formattedTransaction.vendor || '-'}</td>}
                  {type === 'income' && <td>{formattedTransaction.reference || '-'}</td>}
                  <td>
                    <div className="d-flex flex-column gap-1">
                      <Badge 
                        bg={getCategoryBadgeVariant(formattedTransaction.category)}
                        className="px-2 py-1 w-fit"
                      >
                        {getCategoryDisplay(formattedTransaction)}
                      </Badge>
                      {formattedTransaction.subcategory && (
                        <OverlayTrigger
                          placement="right"
                          overlay={
                            <Tooltip>
                              {getSubcategoryDisplay(formattedTransaction)}
                            </Tooltip>
                          }
                        >
                          <Badge 
                            bg={getSubcategoryBadgeVariant(formattedTransaction.subcategory)}
                            text="dark"
                            className="px-2 py-1 w-fit"
                          >
                            {getSubcategoryDisplay(formattedTransaction)}
                          </Badge>
                        </OverlayTrigger>
                      )}
                    </div>
                  </td>
                  {type === 'expense' && (
                    <>
                      <td>{getExpenseTypeDisplay(formattedTransaction)}</td>
                      <td>
                        <small className="text-muted">
                          {getPaymentMethodDisplay(formattedTransaction)}
                        </small>
                      </td>
                    </>
                  )}
                  <td className="text-end fw-bold">
                    {formatCurrency(formattedTransaction.amount)}
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-1">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        className="btn-icon"
                        onClick={() => onEdit(transaction)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        className="btn-icon"
                        onClick={() => onDelete(formattedTransaction.id)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TransactionTable;