import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/hr/api';

const hrAPI = {
  getEmployees: () => axios.get(`${API_BASE_URL}/employees/`),
  createEmployee: (data) => axios.post(`${API_BASE_URL}/employees/`, data),
  updateEmployee: (id, data) => axios.put(`${API_BASE_URL}/employees/${id}/`, data),
  deleteEmployee: (id) => axios.delete(`${API_BASE_URL}/employees/${id}/`),
  getPayrolls: () => axios.get(`${API_BASE_URL}/payroll/`),
  createPayroll: (data) => axios.post(`${API_BASE_URL}/payroll/`, data),
  updatePayroll: (id, data) => axios.put(`${API_BASE_URL}/payroll/${id}/`, data),
  deletePayroll: (id) => axios.delete(`${API_BASE_URL}/payroll/${id}/`),
};

export default hrAPI;
