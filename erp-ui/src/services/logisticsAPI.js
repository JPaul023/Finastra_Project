import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/logistics/api';

const api = {
  // Orders
  getOrders: () => axios.get(`${API_BASE_URL}/orders/`),
  getOrder: (id) => axios.get(`${API_BASE_URL}/orders/${id}/`),
  createOrder: (data) => axios.post(`${API_BASE_URL}/orders/`, data),
  updateOrder: (id, data) => axios.put(`${API_BASE_URL}/orders/${id}/`, data),
  deleteOrder: (id) => axios.delete(`${API_BASE_URL}/orders/${id}/`),

  shipOrder: (data) => axios.post(`${API_BASE_URL}/shipments/ship_order/`, data),
  updateShipment: (id, data) => axios.patch(`${API_BASE_URL}/shipments/${id}/`, data),
  
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
  getDeliveries: () => axios.get(`${API_BASE_URL}/proof-of-delivery/`),
  getDelivery: (id) => axios.get(`${API_BASE_URL}/proof-of-delivery/${id}/`),
  createDelivery: (data) => axios.post(`${API_BASE_URL}/proof-of-delivery/`, data),
  updateDelivery: (id, data) => axios.put(`${API_BASE_URL}/proof-of-delivery/${id}/`, data),
  deleteDelivery: (id) => axios.delete(`${API_BASE_URL}/proof-of-delivery/${id}/`),

  getDelivery: (id) => axios.get(`${API_BASE_URL}/proof-of-delivery/${id}/?expand=shipment.order,shipment.order.warehouse,shipment.order.vehicle,shipment.order.item`),


  submitProofOfDelivery: (formData) => 
    axios.post(`${API_BASE_URL}/proof-of-delivery/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),  
  
};

export default api;