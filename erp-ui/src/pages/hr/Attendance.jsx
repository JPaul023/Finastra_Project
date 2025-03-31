import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import hrAPI from "../../services/hrapi";
import { Table, Form, Button, Spinner, Modal } from "react-bootstrap";
import './attendance.css';  // Ensure you import the CSS file

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [status, setStatus] = useState("Present");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    hrAPI.getEmployees()
      .then(response => setEmployees(response.data))
      .catch(error => console.error("Error fetching employees:", error));

    hrAPI.getAttendanceRecords()
      .then(response => setAttendance(response.data))
      .catch(error => console.error("Error fetching attendance:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmployee || !time) return alert("Please select an employee and enter a time.");

    setLoading(true);
    hrAPI.markAttendance({ employee: selectedEmployee, status, time })
      .then(response => {
        setAttendance([...attendance, response.data]);
        alert("Attendance marked successfully!");
        setSelectedEmployee("");
        setStatus("Present");
        setTime("");
      })
      .catch(error => console.error("Error submitting attendance:", error))
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) return;
    
    hrAPI.deleteAttendance(id)
      .then(() => {
        setAttendance(attendance.filter(record => record.id !== id));
        alert("Attendance record deleted.");
      })
      .catch(error => console.error("Error deleting attendance:", error));
  };

  const openEditModal = (record) => {
    setEditData({
      id: record.id,
      status: record.status,
      time: record.time,
      employee_id: record.employee_id || record.employee,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = () => {
    if (!editData || !editData.status || !editData.time) return alert("Please enter valid data.");

    const payload = {
      status: editData.status,
      time: editData.time,
      employee: editData.employee_id,
    };

    hrAPI.updateAttendance(editData.id, payload)
      .then(response => {
        setAttendance(attendance.map(item => (item.id === response.data.id ? response.data : item)));
        alert("Attendance updated successfully!");
        setShowEditModal(false);
      })
      .catch(error => console.error("Error updating attendance:", error));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mt-4 fade-in">
      {/* Header and Leave Tracking Button */}
      <div className="attendance-header">
        <h2 className="text-center slide-up">Attendance Management</h2>
        <Button onClick={() => navigate("/leave")} className="leave-tracking-button">
          Leave Tracking
        </Button>
      </div>

      <Form onSubmit={handleSubmit} className="mb-4 form-fade">
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
          <Form.Label>Status</Form.Label>
          <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Time</Form.Label>
          <Form.Control type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3 hover-button" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Mark Attendance"}
        </Button>
      </Form>

      <h3 className="text-center mt-4">Attendance Records</h3>
      <Button variant="info" className="mb-3 print-button" onClick={handlePrint}>Print to PDF</Button>
      <Table striped bordered hover responsive>
        <thead className="thead-dark">
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map(record => (
            <tr key={record.id}>
              <td>{record.employee_name}</td>
              <td>{record.date}</td>
              <td>{record.time}</td>
              <td>{record.status}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2 hover-button" onClick={() => openEditModal(record)}>Edit</Button>
                <Button variant="danger" size="sm" className="hover-button" onClick={() => handleDelete(record.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Attendance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" value={editData?.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })}>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Time</Form.Label>
              <Form.Control type="time" value={editData?.time} onChange={(e) => setEditData({ ...editData, time: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Attendance;
