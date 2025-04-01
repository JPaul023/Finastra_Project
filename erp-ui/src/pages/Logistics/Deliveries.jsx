import React, { useState, useEffect } from "react";
import api from "../../services/logisticsAPI";
import Table from "../../components/Logistics/TableDelivery";
import Modal from "../../components/Logistics/ModalDelivery";

function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    setLoading(true);
    try {
      const response = await api.getDeliveries();
      setDeliveries(response.data);
      setError(null);
    } catch {
      setError("Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (delivery) => {
    try {
      const response = await api.getDelivery(delivery.id);
      const deliveryData = response.data;

      // Fetch related order details separately
      if (deliveryData.order_id) {
        const orderResponse = await api.getOrder(deliveryData.order_id);
        deliveryData.customer_name = orderResponse.data.customer_name;
        deliveryData.order_number = orderResponse.data.order_number;
        deliveryData.warehouse_name =
          orderResponse.data.warehouse?.name || "N/A";
        deliveryData.vehicle_plate =
          orderResponse.data.vehicle?.license_plate || "N/A";
      }

      setSelectedDelivery(deliveryData);
      setShowModal(true);
    } catch {
      setError("Failed to load delivery details");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "delivered_date", label: "Delivered Date" },
    { key: "delivery_status", label: "Status" },
  ];

  return (
    <div className="container-fluid py-4">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table columns={columns} data={deliveries || []} onView={handleView} />
      )}

      {/* Modal for viewing details */}
      {/* Modal for viewing details */}
      {showModal && selectedDelivery && (
        <Modal onClose={() => setShowModal(false)}>
          <h5>Delivery Details</h5>
          <hr />
          <div className="delivery-details">
            <p>
              <strong>Customer:</strong>{" "}
              {selectedDelivery.customer_name || "N/A"}
            </p>
            <p>
              <strong>Order Number:</strong>{" "}
              {selectedDelivery.order_number || "N/A"}
            </p>
            <p>
              <strong>Warehouse:</strong>{" "}
              {selectedDelivery.warehouse_name || "N/A"}
            </p>
            <p>
              <strong>Vehicle:</strong>{" "}
              {selectedDelivery.vehicle_plate || "N/A"}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Deliveries;
