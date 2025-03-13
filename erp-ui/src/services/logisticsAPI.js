import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/logistics/api';

const api = {
  // Orders
  getOrders: () => axios.get(`${API_BASE_URL}/orders/`),
  getOrder: (id) => axios.get(`${API_BASE_URL}/orders/${id}/`),
  createOrder: (data) => axios.post(`${API_BASE_URL}/orders/`, data),
  updateOrder: (id, data) => axios.put(`${API_BASE_URL}/orders/${id}/`, data),
  deleteOrder: (id) => axios.delete(`${API_BASE_URL}/orders/${id}/`),
  
  // Shipments
  getShipments: () => axios.get(`${API_BASE_URL}/shipments/`),
  getShipment: (id) => axios.get(`${API_BASE_URL}/shipments/${id}/`),
  createShipment: (data) => axios.post(`${API_BASE_URL}/shipments/`, data),
  updateShipment: (id, data) => axios.put(`${API_BASE_URL}/shipments/${id}/`, data),
  deleteShipment: (id) => axios.delete(`${API_BASE_URL}/shipments/${id}/`),
  
  // Warehouses
  getWarehouses: () => axios.get(`${API_BASE_URL}/warehouses/`),
  getWarehouse: (id) => axios.get(`${API_BASE_URL}/warehouses/${id}/`),
  createWarehouse: (data) => axios.post(`${API_BASE_URL}/warehouses/`, data),
  updateWarehouse: (id, data) => axios.put(`${API_BASE_URL}/warehouses/${id}/`, data),
  deleteWarehouse: (id) => axios.delete(`${API_BASE_URL}/warehouses/${id}/`),
  
  // Vehicles
  getVehicles: () => axios.get(`${API_BASE_URL}/vehicles/`),
  getVehicle: (id) => axios.get(`${API_BASE_URL}/vehicles/${id}/`),
  createVehicle: (data) => axios.post(`${API_BASE_URL}/vehicles/`, data),
  updateVehicle: (id, data) => axios.put(`${API_BASE_URL}/vehicles/${id}/`, data),
  deleteVehicle: (id) => axios.delete(`${API_BASE_URL}/vehicles/${id}/`),
  
  // Deliveries
  getDeliveries: () => axios.get(`${API_BASE_URL}/deliveries/`),
  getDelivery: (id) => axios.get(`${API_BASE_URL}/deliveries/${id}/`),
  createDelivery: (data) => axios.post(`${API_BASE_URL}/deliveries/`, data),
  updateDelivery: (id, data) => axios.put(`${API_BASE_URL}/deliveries/${id}/`, data),
  deleteDelivery: (id) => axios.delete(`${API_BASE_URL}/deliveries/${id}/`),
};

export default api;