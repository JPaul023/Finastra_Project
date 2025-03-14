import axios from 'axios';

const API_URL = 'http://localhost:8000/inventory/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const categoryService = {
  getAll: () => apiClient.get('/categories/'),
  get: (id) => apiClient.get(`/categories/${id}/`),
  create: (data) => apiClient.post('/categories/', data),
  update: (id, data) => apiClient.put(`/categories/${id}/`, data),
  delete: (id) => apiClient.delete(`/categories/${id}/`),
  getItems: (id) => apiClient.get(`/categories/${id}/items/`),
};

export const itemService = {
  getAll: () => apiClient.get('/items/'),
  getAllByCategory: (categoryId) => apiClient.get(`/items/?category=${categoryId}`),
  get: (id) => apiClient.get(`/items/${id}/`),
  create: (data) => apiClient.post('/items/', data),
  update: (id, data) => apiClient.put(`/items/${id}/`, data),
  delete: (id) => apiClient.delete(`/items/${id}/`),
};