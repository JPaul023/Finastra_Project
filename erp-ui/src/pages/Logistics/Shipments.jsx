import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Card,
  Spinner,
  Alert,
  Form,
} from "react-bootstrap";
import api from "../../services/logisticsAPI";
import inventoryapi from "../../services/inventoryAPI";

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [itemName, setItemName] = useState("N/A");

  const [proofPhoto, setProofPhoto] = useState(null);
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [failedReason, setFailedReason] = useState("");
  const [isFailed, setIsFailed] = useState(false);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await api.getShipments();
      console.log("API Response:", response); // Log the full response

      // Filter shipments to only include those with status "shipped"
      const shippedShipments = response.data.filter(
        (shipment) => shipment.status === "shipped"
      );

      setShipments(shippedShipments);
      setError(null);
    } catch (err) {
      console.error(
        "Error fetching shipments:",
        err.response ? err.response.data : err.message
      );
      setError("Failed to load shipments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (shipment) => {
    try {
      setLoadingDetails(true);
      const response = await api.getShipment(shipment.id);
      setSelectedShipment(response.data);
    } catch (err) {
      console.error("Error fetching shipment details:", err);
      setSelectedShipment(shipment);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (selectedShipment && selectedShipment.order?.item) {
      inventoryapi
        .getItem(selectedShipment.order.item)
        .then((response) => {
          setItemName(response.data.name);
        })
        .catch((error) => {
          console.error("Error fetching item details:", error);
        });
    }
  }, [selectedShipment]);

  const handleProofSubmit = async (failed = false) => {
    if (!proofPhoto) {
      alert("Proof photo is required.");
      return;
    }

    if (failed && !failedReason) {
      alert("Please provide a reason for failed delivery.");
      return;
    }

    const formData = new FormData();
    formData.append("shipment", selectedShipment.id);
    if (!failed) {
      formData.append("amount_paid", amountPaid);
      formData.append("payment_mode", paymentMode.toLowerCase());
    }
    formData.append("proof_photo", proofPhoto);

    if (failed) {
      formData.append("failed_reason", failedReason);
      formData.append("delivery_status", "failed"); // Mark explicitly as failed
    } else {
      formData.append("delivery_status", "delivered"); // Mark explicitly as delivered
    }

    console.log("FormData being sent:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      // Submit proof of delivery
      await api.submitProofOfDelivery(formData);

      // Update shipment status
      await api.updateShipment(selectedShipment.id, {
        status: failed ? "failed" : "delivered",
      });

      alert(
        `Shipment marked as ${failed ? "failed" : "delivered"} successfully.`
      );
      setSelectedShipment(null);
      fetchShipments();
    } catch (error) {
      console.error("Error submitting proof of delivery:", error);
    }
  };

  return (
    <>
      <div className="p-3">
        <h2 className="mb-4">Shipments</h2>
        <div className="d-flex justify-content-end">
          <Button
            variant="light"
            size="sm"
            className="px-4 mb-2"
            style={{
              backgroundColor: "#4e73df",
              color: "white",
              height: "3rem",
            }}
            onClick={fetchShipments}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" animation="border" /> : "Refresh"}
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <div
          style={{
            width: selectedShipment ? "calc(100% - 350px)" : "100%",
            transition: "width 0.3s",
          }}
        >
          <Card>
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Tracking Number</th>
                      <th>Customer Name</th>
                      <th>Delivery Address</th>
                      <th>Total Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No shipments found
                        </td>
                      </tr>
                    ) : (
                      shipments.map((shipment) => (
                        <tr key={shipment.id}>
                          <td>{shipment.tracking_number || "N/A"}</td>
                          <td>{shipment.order?.customer_name || "N/A"}</td>
                          <td>{shipment.order?.delivery_address || "N/A"}</td>
                          <td>{shipment.order?.total_amount || "N/A"}</td>
                          <td>
                            <Button
                              className="btn btn-sm btn-outline-primary rounded-pill px-3"
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleViewDetails(shipment)}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      {selectedShipment && (
        <div
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            width: "400px",
            height: "auto",
            padding: "10px",
            backgroundColor: "#f8f9fa",
            boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
            overflowY: "auto",
            zIndex: 100,
            transition: "right 0.3s",
          }}
        >
          <Card className="h-100">
            <Card.Header className="bg-info text-white d-flex justify-content-between align-items-center sticky-top">
              <h5 className="mb-0">Shipment Details</h5>
              <Button
                variant="light"
                size="sm"
                onClick={() => setSelectedShipment(null)}
              >
                Close
              </Button>
            </Card.Header>
            <Card.Body>
              {loadingDetails ? (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading details...</span>
                  </Spinner>
                </div>
              ) : (
                <>
                  <Row className="mb-3">
                    <Col md={5}>
                      <strong>Date Shipped:</strong>
                    </Col>
                    <Col md={7}>{selectedShipment.shipped_date || "N/A"}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={5}>
                      <strong>Tracking No.:</strong>
                    </Col>
                    <Col md={7}>
                      {selectedShipment.tracking_number || "N/A"}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={5}>
                      <strong>Customer Name:</strong>
                    </Col>
                    <Col md={7}>
                      {selectedShipment.order?.customer_name || "N/A"}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={5}>
                      <strong>Address:</strong>
                    </Col>
                    <Col md={7}>
                      {selectedShipment.order?.delivery_address || "N/A"}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={5}>
                      <strong>Item Name:</strong>
                    </Col>
                    <Col md={7}>{itemName}</Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={5}>
                      <strong>Quantity:</strong>
                    </Col>
                    <Col md={7}>
                      {selectedShipment.order?.quantity || "N/A"}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={5}>
                      <strong>Total Amount:</strong>
                    </Col>
                    <Col md={7} className="text-danger">
                      <strong>
                        {selectedShipment.order?.total_amount || "N/A"}
                      </strong>
                    </Col>
                  </Row>
                </>
              )}

              <h6 className="mt-4 mb-3 border-bottom pb-2">
                Proof of Delivery
              </h6>
              <Form>
                <Form.Group>
                  <Form.Label>Upload Proof Photo</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setProofPhoto(e.target.files[0])}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Amount Paid</Form.Label>
                  <Form.Control
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Mode of Payment</Form.Label>
                  <Form.Select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                  >
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                  </Form.Select>
                </Form.Group>

                {isFailed && (
                  <Form.Group>
                    <Form.Label>Reason for Failed Delivery</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={failedReason}
                      onChange={(e) => setFailedReason(e.target.value)}
                      required
                    />
                  </Form.Group>
                )}

                <div className="text-end">
                  <Button
                    variant="danger"
                    className="mt-3"
                    onClick={() => {
                      setIsFailed(true); // First, update state to show reason input

                      setTimeout(() => {
                        if (!proofPhoto) {
                          alert("Proof photo is required.");
                          return;
                        }
                        if (!failedReason) {
                          alert("Reason for failed delivery is required.");
                          return;
                        }
                        handleProofSubmit(true); // Call function with failed=true
                      }, 100); // Small delay to allow UI update
                    }}
                  >
                    Failed
                  </Button>

                  <Button
                    variant="success"
                    className="mt-3 ms-4"
                    onClick={() => {
                      if (!proofPhoto) {
                        alert("Proof photo is required.");
                        return;
                      }
                      if (!amountPaid) {
                        alert("Amount paid is required.");
                        return;
                      }
                      if (!paymentMode) {
                        alert("Mode of payment is required.");
                        return;
                      }
                      setIsFailed(false); // Mark as delivered
                      handleProofSubmit(false); // Call function with failed=false
                    }}
                  >
                    Delivered
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      )}
    </>
  );
};

export default Shipments;
