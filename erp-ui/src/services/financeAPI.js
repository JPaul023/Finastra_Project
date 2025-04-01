// Updated financeAPI.js

import axios from 'axios';

// Set the base URL for all API calls - keeping port 8002 as you requested
const API_BASE_URL = 'http://localhost:8002/api/finance';

// Enhanced event system to notify components when data changes
export const FinanceEvents = {
  listeners: {},
  
  // Add event listener
  subscribe: (event, callback) => {
    if (!FinanceEvents.listeners[event]) {
      FinanceEvents.listeners[event] = [];
    }
    console.log(`Component subscribed to ${event} event`);
    FinanceEvents.listeners[event].push(callback);
    return () => {
      console.log(`Component unsubscribed from ${event} event`);
      FinanceEvents.listeners[event] = FinanceEvents.listeners[event]
        .filter(cb => cb !== callback);
    };
  },
  
  // Trigger event
  emit: (event, data) => {
    console.log(`Emitting event: ${event}`, data);
    if (FinanceEvents.listeners[event]) {
      const listenerCount = FinanceEvents.listeners[event].length;
      console.log(`Notifying ${listenerCount} listeners for event: ${event}`);
      FinanceEvents.listeners[event].forEach(callback => {
        callback(data);
      });
    } else {
      console.log(`No listeners for event: ${event}`);
    }
  }
};

const financeAPI = {
  // Dashboard and summary
  getSummary: async (params = {}) => {
    try {
      console.log('Fetching financial summary with params:', params);
      const response = await axios.get(`${API_BASE_URL}/summary/`, { params });
      console.log('Financial summary data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching financial summary:', error);
      // Return empty data structure to prevent UI crashes
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netIncome: 0,
        incomeByCategory: [],
        expensesByCategory: [],
        comparisonToPreviousPeriod: {
          income: 0,
          expenses: 0,
          profit: 0
        }
      };
    }
  },
  
  // Income-related endpoints
  getIncomes: async (params = {}) => {
    try {
      console.log('Fetching incomes with params:', params);
      const response = await axios.get(`${API_BASE_URL}/incomes/`, { params });
      console.log(`Received ${response.data.length} income records`);
      return response.data;
    } catch (error) {
      console.error('Error fetching incomes:', error);
      // Return empty array on error to prevent UI crashes
      return [];
    }
  },
  
  addIncome: async (incomeData) => {
    try {
      // Format the data properly to match Django model fields
      const formattedData = {
        source: incomeData.source || incomeData.description || '',
        amount: parseFloat(incomeData.amount),
        date: incomeData.date,
        description: incomeData.description || '',
        category: incomeData.category || 'other_income',
        reference_number: incomeData.reference_number || '' // Add reference number
      };
      
      console.log('Adding new income:', formattedData);
      const response = await axios.post(`${API_BASE_URL}/incomes/`, formattedData);
      console.log('Income added successfully:', response.data);
      
      // Emit data change events
      FinanceEvents.emit('income-changed', response.data);
      FinanceEvents.emit('financial-data-changed', { 
        type: 'income', 
        action: 'add',
        data: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('Error adding income:', error);
      throw error;
    }
  },
  
  updateIncome: async (id, incomeData) => {
    try {
      // Format the data properly to match Django model fields
      const formattedData = {
        source: incomeData.source || incomeData.description || '',
        amount: parseFloat(incomeData.amount),
        date: incomeData.date,
        description: incomeData.description || '',
        category: incomeData.category || 'other_income',
        reference_number: incomeData.reference_number || '' // Add reference number
      };
      
      console.log(`Updating income ID ${id}:`, formattedData);
      const response = await axios.put(`${API_BASE_URL}/incomes/${id}/`, formattedData);
      console.log('Income updated successfully:', response.data);
      
      // Emit data change events
      FinanceEvents.emit('income-changed', response.data);
      FinanceEvents.emit('financial-data-changed', { 
        type: 'income', 
        action: 'update',
        data: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error updating income ID ${id}:`, error);
      throw error;
    }
  },
  
  deleteIncome: async (id) => {
    try {
      console.log(`Deleting income ID ${id}`);
      const response = await axios.delete(`${API_BASE_URL}/incomes/${id}/`);
      console.log(`Income ID ${id} deleted successfully`);
      
      // Emit data change events
      FinanceEvents.emit('income-changed', { id });
      FinanceEvents.emit('financial-data-changed', { 
        type: 'income', 
        action: 'delete',
        id: id
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error deleting income ID ${id}:`, error);
      throw error;
    }
  },
  
  // Expense-related endpoints
  getExpenses: async (params = {}) => {
    try {
      console.log('Fetching expenses with params:', params);
      const response = await axios.get(`${API_BASE_URL}/expenses/`, { params });
      console.log(`Received ${response.data.length} expense records`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      // Return empty array on error to prevent UI crashes
      return [];
    }
  },
  
  addExpense: async (expenseData) => {
    try {
      // Format the data properly to match Django model fields
      const formattedData = {
        payee: expenseData.payee || expenseData.vendor || expenseData.description || '',
        amount: parseFloat(expenseData.amount),
        date: expenseData.date,
        description: expenseData.description || '',
        category: expenseData.category || 'operational_expenses',
        payment_method: expenseData.payment_method || '', // Add payment method
        expense_type: expenseData.expense_type || '' // Add expense type
      };
      
      console.log('Adding new expense:', formattedData);
      const response = await axios.post(`${API_BASE_URL}/expenses/`, formattedData);
      console.log('Expense added successfully:', response.data);
      
      // Emit data change events
      FinanceEvents.emit('expense-changed', response.data);
      FinanceEvents.emit('financial-data-changed', { 
        type: 'expense', 
        action: 'add',
        data: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  },
  
  updateExpense: async (id, expenseData) => {
    try {
      // Format the data properly to match Django model fields
      const formattedData = {
        payee: expenseData.payee || expenseData.vendor || expenseData.description || '',
        amount: parseFloat(expenseData.amount),
        date: expenseData.date,
        description: expenseData.description || '',
        category: expenseData.category || 'operational_expenses',
        payment_method: expenseData.payment_method || '', // Add payment method
        expense_type: expenseData.expense_type || '' // Add expense type
      };
      
      console.log(`Updating expense ID ${id}:`, formattedData);
      const response = await axios.put(`${API_BASE_URL}/expenses/${id}/`, formattedData);
      console.log('Expense updated successfully:', response.data);
      
      // Emit data change events
      FinanceEvents.emit('expense-changed', response.data);
      FinanceEvents.emit('financial-data-changed', { 
        type: 'expense', 
        action: 'update',
        data: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error updating expense ID ${id}:`, error);
      throw error;
    }
  },
  
  deleteExpense: async (id) => {
    try {
      console.log(`Deleting expense ID ${id}`);
      const response = await axios.delete(`${API_BASE_URL}/expenses/${id}/`);
      console.log(`Expense ID ${id} deleted successfully`);
      
      // Emit data change events
      FinanceEvents.emit('expense-changed', { id });
      FinanceEvents.emit('financial-data-changed', { 
        type: 'expense', 
        action: 'delete',
        id: id
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error deleting expense ID ${id}:`, error);
      throw error;
    }
  },
  
  // Cash Flow
  getCashFlow: async (period = 'monthly', params = {}) => {
    try {
      const queryParams = { period, ...params };
      console.log('Fetching cash flow data with params:', queryParams);
      const response = await axios.get(`${API_BASE_URL}/cash-flow/`, { params: queryParams });
      console.log('Cash flow data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching cash flow data:', error);
      // Return empty data structure to prevent UI crashes
      return {
        labels: [],
        incomeData: [],
        expensesData: [],
        netData: [],
        period: period,
        timeRange: params.timeRange || '3months'
      };
    }
  },
  
  // Balance Sheet
  getBalanceSheet: async () => {
    try {
      console.log('Fetching balance sheet data');
      const response = await axios.get(`${API_BASE_URL}/balance-sheet/`);
      console.log('Balance sheet data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching balance sheet:', error);
      // Return empty data structure to prevent UI crashes
      return {
        assets: {},
        liabilities: {},
        equity: {},
        asOfDate: new Date().toISOString().split('T')[0]
      };
    }
  },
  
  // Financial Reports
  getFinancialReports: async (reportType, startDate, endDate) => {
    try {
      const params = {
        type: reportType,
        start_date: startDate,
        end_date: endDate
      };
      console.log(`Fetching ${reportType} report from ${startDate} to ${endDate}`);
      const response = await axios.get(`${API_BASE_URL}/reports/`, { params });
      console.log(`${reportType} report data received:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${reportType} report:`, error);
      // Return empty data structure to prevent UI crashes
      return {
        revenues: [],
        expenses: [],
        totalRevenue: 0,
        totalExpenses: 0,
        netIncome: 0
      };
    }
  },

  // Get report history
  getReportHistory: async () => {
    try {
      console.log('Fetching report history from API');
      const response = await axios.get(`${API_BASE_URL}/report-history/`);
      console.log('Report history received, count:', Array.isArray(response.data) ? response.data.length : 'N/A');
      return response.data;
    } catch (error) {
      console.error('Error fetching report history:', error);
      return [];
    }
  },
  
  // Get a specific report from history
  getReportHistoryDetail: async (id) => {
    try {
      console.log(`Fetching report history detail for ID ${id}`);
      const response = await axios.get(`${API_BASE_URL}/report-history/${id}/`);
      console.log('Report history detail received:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching report history detail for ID ${id}:`, error);
      return null;
    }
  },
  
  // Delete a specific report from history
  deleteReportHistory: async (id) => {
    try {
      console.log(`Deleting report history ID ${id}`);
      await axios.delete(`${API_BASE_URL}/report-history/${id}/`);
      console.log(`Report history ID ${id} deleted successfully`);
      
      // Emit report deleted event
      FinanceEvents.emit('report-deleted', { id });
      // Also emit general financial data change event
      FinanceEvents.emit('financial-data-changed', { 
        type: 'report', 
        action: 'delete',
        id: id
      });
      
      return true;
    } catch (error) {
      console.error(`Error deleting report history ID ${id}:`, error);
      throw error;
    }
  },
  
  // Save report to history
  saveReportToHistory: async (reportData) => {
    try {
      // Format data to match the Django model
      const formattedData = {
        report_name: reportData.reportName || `${reportData.type} Report`,
        report_type: reportData.type || 'income_statement',
        start_date: reportData.startDate || new Date().toISOString().split('T')[0],
        end_date: reportData.endDate || new Date().toISOString().split('T')[0],
        report_summary: reportData.summary || '',
        report_data: reportData.data || {},
      };
      
      console.log('Saving report to history API:', formattedData);
      const response = await axios.post(`${API_BASE_URL}/report-history/`, formattedData);
      console.log('Report saved to history successfully:', response.data);
      
      // Emit report created event
      FinanceEvents.emit('report-created', response.data);
      // Also emit general financial data change event
      FinanceEvents.emit('financial-data-changed', { 
        type: 'report', 
        action: 'create',
        data: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('Error saving report to history:', error);
      throw error;
    }
  },
  
  // Test API endpoint
  testAPI: async () => {
    try {
      console.log('Testing API connection');
      const response = await axios.get(`${API_BASE_URL}/test/`);
      console.log('API connection successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('API connection test failed:', error);
      throw error;
    }
  },
  
  // Utility method to refresh all data (can be called manually)
  refreshAllData: async () => {
    console.log('Manually refreshing all financial data');
    FinanceEvents.emit('financial-data-changed', { 
      type: 'manual', 
      action: 'refresh',
      timestamp: new Date().toISOString()
    });
    return { success: true, message: 'Refresh event emitted' };
  }
};

export default financeAPI;