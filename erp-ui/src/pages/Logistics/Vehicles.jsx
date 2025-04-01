import React, { useState, useEffect } from "react";
import api from "../../services/logisticsAPI";
import Table from "../../components/Logistics/Table";
import Modal from "../../components/Logistics/Modal";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState({
    name: "",
    address: "",
  });

  useEffect(() => {
    loadVehicles();
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

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const response = await api.getVehicles();
      setVehicles(response.data);
      setError(null);
    } catch {
      setError("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVehicles = async () => {
    try {
      if (currentVehicle.id) {
        await api.updateVehicle(currentVehicle.id, currentVehicle);
      } else {
        await api.createVehicle(currentVehicle);
      }
      setShowModal(false);
      setSuccess("Saved successfully");
      loadVehicles();
    } catch {
      setError("Failed to save!");
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await api.deleteVehicle(id);
        setSuccess("Vehicle deleted successfully");
        loadVehicles();
      } catch {
        setError("Failed to delete vehicle");
      }
    }
  };

  const handleInputChange = (e) => {
    setCurrentVehicle({ ...currentVehicle, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setCurrentVehicle({ id: "", name: "", address: "" });
    setShowModal(true);
  };

  const openEditModal = (vehicle) => {
    setCurrentVehicle(vehicle);
    setShowModal(true);
  };

  const columns = [
    { key: "license_plate", label: "License Plate No." },
    { key: "capacity", label: "Capacity" },
    { key: "current_location", label: "Location" },
  ];

  const fields = [
    { name: "license_plate", label: "License Plate No.", type: "text" },
    { name: "capacity", label: "Capacity", type: "number" },
    { name: "current_location", label: "Location", type: "text" }
  ];

  return (
    <div className="container-fluid py-4">
      <h3 className="text-left mb-4">Vehicles</h3>
      <div className="d-flex justify-content-end mb-2">
        <button
          className="btn px-4"
          style={{ backgroundColor: "#4e73df", color: "white", height: "3rem" }}
          onClick={openCreateModal}
        >
          <i className="bi bi-plus-circle me-1"></i> Add Vehicle
        </button>
      </div>
      {loading ? <div>Loading...</div> : <Table data={vehicles} columns={columns} onEdit={openEditModal} onDelete={handleDeleteVehicle} />}
      <Modal showModal={showModal} title="Manage Vehicles" fields={fields} data={currentVehicle} onClose={() => setShowModal(false)} onChange={handleInputChange} onSave={handleSaveVehicles} />
    </div>
  );
}

export default Vehicles;
