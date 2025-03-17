import React, { useState, useEffect } from "react";
import api from "../../services/logisticsAPI";
import Table from "../../components/Logistics/Table";
import Modal from "../../components/Logistics/Modal";

function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentWarehouse, setCurrentWarehouse] = useState({
    name: "",
    address: "",
  });

  useEffect(() => {
    loadWarehouses();
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

  const loadWarehouses = async () => {
    setLoading(true);
    try {
      const response = await api.getWarehouses();
      setWarehouses(response.data);
      setError(null);
    } catch {
      setError("Failed to load warehouses");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWarehouses = async () => {
    try {
      if (currentWarehouse.id) {
        await api.updateWarehouse(currentWarehouse.id, currentWarehouse);
      } else {
        await api.createWarehouse(currentWarehouse);
      }
      setShowModal(false);
      setSuccess("Saved successfully");
      loadWarehouses();
    } catch {
      setError("Failed to save!");
    }
  };

  const handleDeleteWarehouse = async (id) => {
    if (window.confirm("Are you sure you want to delete this warehouse?")) {
      try {
        await api.deleteWarehouse(id);
        setSuccess("Warehouse deleted successfully");
        loadWarehouses();
      } catch {
        setError("Failed to delete warehouse");
      }
    }
  };

  const handleInputChange = (e) => {
    setCurrentWarehouse({ ...currentWarehouse, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setCurrentWarehouse({ id: "", name: "", address: "" });
    setShowModal(true);
  };

  const openEditModal = (warehouse) => {
    setCurrentWarehouse(warehouse);
    setShowModal(true);
  };

  const columns = [
    { key: "id", label: "Warehouse ID No." },
    { key: "name", label: "Name" },
    { key: "address", label: "Location" },
  ];

  const fields = [
    { name: "name", label: "Name", type: "text" },
    { name: "address", label: "Location", type: "textarea" }
  ];

  return (
    <div className="container-fluid py-4">
      {/* <button className="btn btn-primary" onClick={openCreateModal}>
        <i className="bi bi-plus-circle me-1"></i> New Warehouse
      </button> */}
      {loading ? <div>Loading...</div> : <Table data={warehouses} columns={columns} onEdit={openEditModal} onDelete={handleDeleteWarehouse} />}
      <Modal showModal={showModal} title="Manage Warehouses" fields={fields} data={currentWarehouse} onClose={() => setShowModal(false)} onChange={handleInputChange} onSave={handleSaveWarehouses} />
    </div>
  );
}

export default Warehouses;
