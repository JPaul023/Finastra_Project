import React, { useState, useEffect } from "react";
import api from "../../services/logisticsAPI";
import Table from "../../components/Logistics/Table";
import Modal from "../../components/Logistics/Modal";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({
    order_number: "",
    customer_name: "",
    status: "pending",
    order_date: "",
    total_amount: 0,
    delivery_address: "",
  });

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await api.getOrders();
      setOrders(response.data);
      setError(null);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrder = async () => {
    try {
      if (currentOrder.id) {
        await api.updateOrder(currentOrder.id, currentOrder);
      } else {
        await api.createOrder(currentOrder);
      }
      setShowModal(false);
      setSuccess("Saved successfully");
      loadOrders();
    } catch {
      setError("Failed to save order");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await api.deleteOrder(id);
        setSuccess("Order deleted successfully");
        loadOrders();
      } catch {
        setError("Failed to delete order");
      }
    }
  };

  const handleInputChange = (e) => {
    setCurrentOrder({ ...currentOrder, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setCurrentOrder({ order_number: "", customer_name: "", status: "pending", order_date: "", total_amount: 0, delivery_address: "" });
    setShowModal(true);
  };

  const openEditModal = (order) => {
    setCurrentOrder(order);
    setShowModal(true);
  };

  const columns = [
    { key: "order_number", label: "Order Number" },
    { key: "customer_name", label: "Customer" },
    { key: "status", label: "Status" },
    { key: "order_date", label: "Date", render: (val) => new Date(val).toLocaleDateString() },
    { key: "total_amount", label: "Amount", render: (val) => `$${Number(val).toFixed(2) || "0.00"}` },
  ];

  const fields = [
    { name: "customer_name", label: "Customer Name", type: "text" },
    { name: "total_amount", label: "Total Amount ($)", type: "number" },
    { name: "delivery_address", label: "Delivery Address", type: "textarea" },
    { 
      name: "status", 
      label: "Order Status", 
      type: "select",
      options: [
        { value: "pending", label: "Pending" },
        { value: "shipped", label: "Shipped" },
        { value: "delivered", label: "Delivered" },
        { value: "cancelled", label: "Cancelled" },
      ]
    },
  ];

  return (
    <div className="container-fluid py-4">
      <button className="btn btn-primary" onClick={openCreateModal}>
        <i className="bi bi-plus-circle me-1"></i> New Order
      </button>
      {loading ? <div>Loading...</div> : <Table data={orders} columns={columns} onEdit={openEditModal} onDelete={handleDeleteOrder} />}
      <Modal showModal={showModal} title="Manage Order" fields={fields} data={currentOrder} onClose={() => setShowModal(false)} onChange={handleInputChange} onSave={handleSaveOrder} />
    </div>
  );
}

export default Orders;
