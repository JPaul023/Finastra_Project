import React, { useState, useEffect } from "react";
import inventoryAPi from "../../services/inventoryAPI";
import api from "../../services/logisticsAPI";
import Table from "../../components/Logistics/Table";
import Modal from "../../components/Logistics/Modal";
import SearchBar from "../../components/Logistics/SearchBar";

function Orders() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [currentOrder, setCurrentOrder] = useState({
    order_number: "",
    customer_name: "",
    status: "pending",
    order_date: "",
    total_amount: 0,
    delivery_address: "",
    category: "",
    item: "",
    quantity: 1,
    warehouse: "",
    price: 0,
    vehicle: "",
  });

  useEffect(() => {
    loadItems();
    loadCategories();
    loadWarehouses();
    loadVehicles();
    loadOrders();
  }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, orders]);

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

  // New effect to filter items when category changes
  useEffect(() => {
    if (currentOrder.category) {
      loadItemsByCategory(currentOrder.category);
    } else {
      setFilteredItems([]);
    }
  }, [currentOrder.category]);

  // Add this effect to calculate total_amount whenever price or quantity changes
  useEffect(() => {
    // Convert values to numbers and calculate total
    const price = parseFloat(currentOrder.price) || 0;
    const quantity = parseFloat(currentOrder.quantity) || 0;
    const total = price * quantity;

    setCurrentOrder((prevOrder) => ({
      ...prevOrder,
      total_amount: total,
    }));
  }, [currentOrder.price, currentOrder.quantity]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await inventoryAPi.getItems();
      setItems(response.data);
      setError(null);
    } catch {
      setError("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  // New function to load items by category
  const loadItemsByCategory = async (categoryId) => {
    try {
      const response = await inventoryAPi.getItemsByCategory(categoryId);
      const itemOptions = response.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setFilteredItems(itemOptions);
    } catch {
      setError("Failed to load items for this category");
    }
  };

  const loadCategories = async () => {
    try {
      const response = await inventoryAPi.getCategories();
      const categoryOptions = response.data.map((category) => ({
        value: category.id,
        label: category.name,
      }));
      setCategories(categoryOptions);
    } catch {
      setError("Failed to load categories");
    }
  };

  const loadWarehouses = async () => {
    try {
      const response = await api.getWarehouses();
      const warehouseOptions = response.data.map((warehouse) => ({
        value: warehouse.id,
        label: warehouse.name,
      }));
      setWarehouses(warehouseOptions);
    } catch {
      setError("Failed to load warehouses");
    }
  };

  const loadVehicles = async () => {
    try {
      const response = await api.getVehicles();
      const vehicleOptions = response.data.map((vehicle) => ({
        value: vehicle.id,
        label: vehicle.license_plate,
      }));
      setVehicles(vehicleOptions);
    } catch {
      setError("Failed to load vehicles");
    }
  };

  const loadOrders = async () => {
    try {
      const response = await api.getOrders();
      const pendingOrders = response.data.filter(
        (order) => order.status.toLowerCase() === "pending"
      );
      setOrders(pendingOrders);
      setFilteredOrders(pendingOrders);
    } catch {
      console.error("Failed to load orders");
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredOrders(orders);
      return;
    }

    const lowerCaseTerm = term.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.order_number.toLowerCase().includes(lowerCaseTerm) ||
        order.customer_name.toLowerCase().includes(lowerCaseTerm) ||
        (order.category && order.category.toLowerCase().includes(lowerCaseTerm))
    );
    setFilteredOrders(filtered);
  };

  const handleFilterChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    if (!category) {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        (order) => String(order.category) === String(category)
      );
      setFilteredOrders(filtered);
    }
  };

  const handleSaveOrder = async () => {
    try {
      const orderData = {
        ...currentOrder,
        // Make sure to include these fields
        category: currentOrder.category,
        item: currentOrder.item,
      };

      if (currentOrder.id) {
        await api.updateOrder(currentOrder.id, orderData);
      } else {
        await api.createOrder(orderData);
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
    const { name, value } = e.target;

    if (name === "category") {
      setCurrentOrder({
        ...currentOrder,
        category: value,
        item: "",
        price: 0,
      });

      loadItemsByCategory(value);
    } else if (name === "item") {
      const selectedItem = items.find(
        (item) => String(item.id) === String(value)
      );
      setCurrentOrder({
        ...currentOrder,
        item: value,
        price: selectedItem ? selectedItem.price : 0,
      });
    } else if (name === "quantity") {
      // Ensure quantity is a number
      const numValue = parseFloat(value) || 0;
      setCurrentOrder({ ...currentOrder, quantity: numValue });
    } else {
      setCurrentOrder({ ...currentOrder, [name]: value });
    }
  };

  const openCreateModal = () => {
    setCurrentOrder({
      order_number: "",
      customer_name: "",
      status: "pending",
      order_date: "",
      total_amount: 0,
      delivery_address: "",
      category: "",
      item: "",
      quantity: 1,
      warehouse: "",
      price: 0,
      vehicle: "",
    });
    setShowModal(true);
  };

  const openEditModal = async (order) => {
    let updatedOrder = { ...order };

    const category = categories.find(
      (cat) => String(cat.value) === String(order.category)
    );
    if (category) {
      updatedOrder.category = category.value;
    }

    if (order.category) {
      await loadItemsByCategory(order.category);
    }

    const item = items.find((item) => String(item.id) === String(order.item));
    if (item) {
      updatedOrder.item = item.id;
      updatedOrder.price = item.price;
    }

    setCurrentOrder(updatedOrder);
    setShowModal(true);
  };

  const handleShipOrder = async () => {
    if (!currentOrder.id) {
      alert("Invalid Order");
      return;
    }

    const confirmShip = window.confirm(
      "Are you sure you want to ship this order?"
    );
    if (!confirmShip) return;

    try {
      const shipmentData = {
        order: currentOrder.id,
        vehicle: currentOrder.vehicle || null,
      };

      await api.shipOrder(shipmentData); // Calls the new API endpoint

      setSuccess("Order shipped successfully");
      setShowModal(false);
      loadOrders(); // Reloads the order list
    } catch (error) {
      setError("Failed to ship order");
    }
  };

  const shipButton = (
    <button className="btn btn-warning" onClick={handleShipOrder}>
      Ship Order
    </button>
  );

  const columns = [
    { key: "order_number", label: "Order Number" },
    { key: "customer_name", label: "Customer" },
    {
      key: "category",
      label: "Category",
      render: (val) => {
        const category = categories.find(
          (cat) => String(cat.value) === String(val)
        );
        return category ? category.label : "Unknown";
      },
    },
    {
      key: "order_date",
      label: "Date",
      render: (val) => new Date(val).toLocaleDateString(),
    },
    {
      key: "total_amount",
      label: "Total Amount",
      render: (val) => `$${Number(val).toFixed(2) || "0.00"}`,
    },
  ];

  const fields = [
    { name: "customer_name", label: "Customer Name", type: "text" },
    { name: "delivery_address", label: "Delivery Address", type: "textarea" },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: categories,
    },
    {
      name: "item",
      label: "Item",
      type: "select",
      options: filteredItems,
      disabled: !currentOrder.category,
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      value: currentOrder.price,
      disabled: true,
    },
    { name: "quantity", label: "Quantity", type: "number" },
    {
      name: "total_amount",
      label: "Total Amount",
      type: "number",
      value: parseFloat(currentOrder.total_amount) || 0,
      disabled: true,
    },
    {
      name: "warehouse",
      label: "Warehouse",
      type: "select",
      options: warehouses,
    },
    {
      name: "vehicle",
      label: "Vehicle",
      type: "select",
      options: vehicles,
    },
  ];

  return (
    <div className="container-fluid py-4">
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <h3 className="text-left mb-4">Orders</h3>

      {/* Button aligned to the left */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />

        <select
          className="form-select w-25 me-2"
          value={selectedCategory}
          onChange={handleFilterChange}
          style={{ height: "3rem" }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <button
          className="btn px-4"
          style={{ backgroundColor: "#4e73df", color: "white", height: "3rem" }}
          onClick={openCreateModal}
        >
          <i className="bi bi-plus-circle me-1"></i> New Order
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div>No matching orders found.</div>
      ) : (
        <Table
          data={filteredOrders}
          columns={columns}
          onEdit={openEditModal}
          onDelete={handleDeleteOrder}
        />
      )}

      <Modal
        showModal={showModal}
        title="Manage Order"
        fields={fields}
        data={currentOrder}
        onClose={() => setShowModal(false)}
        onChange={handleInputChange}
        onSave={handleSaveOrder}
        actionButton={shipButton}
      />
    </div>
  );
}

export default Orders;
