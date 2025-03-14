import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/inventory/api';

const api = {
  // Categories
  getCategories: () => axios.get(`${API_BASE_URL}/categories/`),
  getCategory: (id) => axios.get(`${API_BASE_URL}/categories/${id}/`),
  createCategory: (data) => axios.post(`${API_BASE_URL}/categories/`, data),
  updateCategory: (id, data) => axios.put(`${API_BASE_URL}/categories/${id}/`, data),
  deleteCategory: (id) => axios.delete(`${API_BASE_URL}/categories/${id}/`),
  getCategoryItems: (id) => axios.get(`${API_BASE_URL}/categories/${id}/items/`),
  
  // Items
  getItems: () => axios.get(`${API_BASE_URL}/items/`),
  getItem: (id) => axios.get(`${API_BASE_URL}/items/${id}/`),
  getItemsByCategory: (categoryId) => axios.get(`${API_BASE_URL}/items/?category=${categoryId}`),
  createItem: (data) => axios.post(`${API_BASE_URL}/items/`, data),
  updateItem: (id, data) => axios.put(`${API_BASE_URL}/items/${id}/`, data),
  deleteItem: (id) => axios.delete(`${API_BASE_URL}/items/${id}/`),
};

export default api;
