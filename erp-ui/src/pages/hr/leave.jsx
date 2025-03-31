import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import hrAPI from "../../services/hrapi";
import { Table, Form, Button, Spinner, Modal } from "react-bootstrap";

const Leave = () => {
  const [employees, setEmployees] = useState([]);
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [leaveDate, setLeaveDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const navigate = useNavigate();

  // Fetch Employees
  useEffect(() => {
    hrAPI.getEmployees()
      .then(response => setEmployees(response.data))
      .catch(error => console.error("Error fetching employees:", error));
  }, []);

  // Fetch Leave Records
  useEffect(() => {
    hrAPI.getLeaveRecords()
      .then(response => setLeaveRecords(response.data))
      .catch(error => console.error("Error fetching leave records:", error));
  }, []);

  // Handle Leave Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmployee || !leaveDate || !reason) return alert("Please fill all fields.");

    setLoading(true);
    hrAPI.addLeaveRecord({ employee: selectedEmployee, date: leaveDate, reason })
      .then(response => {
        setLeaveRecords([...leaveRecords, response.data]);
        alert("Leave recorded successfully!");
        setSelectedEmployee("");
        setLeaveDate("");
        setReason("");
      })
      .catch(error => console.error("Error submitting leave:", error))
      .finally(() => setLoading(false));
  };

  // Handle Delete
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this leave record?")) return;

    hrAPI.deleteLeaveRecord(id)
      .then(() => {
        setLeaveRecords(leaveRecords.filter(record => record.id !== id));
        alert("Leave record deleted.");
      })
      .catch(error => {
        console.error("Error deleting leave:", error);
        alert("Failed to delete leave. Check the console for details.");
      });
  };

  // Open Edit Modal
  const openEditModal = (record) => {
    setEditData({
      id: record.id,
      date: record.date,
      reason: record.reason,
      employee_id: record.employee_id || record.employee,
    });
    setShowEditModal(true);
  };

  // Handle Edit Submission
  const handleEditSubmit = () => {
    if (!editData || !editData.date || !editData.reason) {
      return alert("Please enter valid data.");
    }

    const payload = {
      date: editData.date,
      reason: editData.reason,
      employee: editData.employee_id,
    };

    hrAPI.updateLeaveRecord(editData.id, payload)
      .then(response => {
        setLeaveRecords(leaveRecords.map(item => (item.id === response.data.id ? response.data : item)));
        alert("Leave updated successfully!");
        setShowEditModal(false);
      })
      .catch(error => {
        console.error("Error updating leave:", error);
        alert("Failed to update leave. Check the console for details.");
      });
  };

  return (
    <div className="container mt-4">
      {/* Wrapper for content */}
      <div className="leave-page-wrapper">
        <h2 className="text-center mb-4">Leave Management</h2>

        {/* Leave Form */}
        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group>
            <Form.Label>Select Employee</Form.Label>
            <Form.Control as="select" value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} required>
              <option value="">Choose...</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Leave Date</Form.Label>
            <Form.Control type="date" value={leaveDate} onChange={(e) => setLeaveDate(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Reason</Form.Label>
            <Form.Control as="textarea" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} required />
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-3" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Submit Leave"}
          </Button>
        </Form>

        {/* Leave Records Table */}
        <h3 className="text-center mt-4">Leave Records</h3>
        <Table striped bordered hover responsive>
          <thead className="thead-dark">
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRecords.map(record => (
              <tr key={record.id}>
                <td>{record.employee_name}</td>
                <td>{record.date}</td>
                <td>{record.reason}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => openEditModal(record)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(record.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="back-btn"
        >
          ΓåÉ Attendance Management
        </button>

        {/* Edit Leave Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Leave</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Leave Date</Form.Label>
                <Form.Control 
                  type="date" 
                  value={editData?.date} 
                  onChange={(e) => setEditData({ ...editData, date: e.target.value })} 
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Reason</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  value={editData?.reason} 
                  onChange={(e) => setEditData({ ...editData, reason: e.target.value })} 
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      </div>
      
      {/* CSS for the button */}
      <style jsx>{`
        .leave-page-wrapper {
          position: relative;
        }

        .back-btn {
          position: absolute;
          top: 20px;
          left: 20px;
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
          transition: background 0.3s;
          z-index: 999; /* Ensures the button stays above other elements */
        }

        .back-btn:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default Leave;
