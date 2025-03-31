import React, { useEffect, useState } from "react";
import hrAPI from "../../services/hrapi";
import { Container, Table, Button, Form, Modal } from "react-bootstrap";
import "./recruitment.css"; // Import the CSS file for animations

const Recruitment = () => {
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    position_applied: "",
    resume: null,
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Fetch all candidates
  const fetchCandidates = async () => {
    try {
      const response = await hrAPI.getCandidates();
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setNewCandidate({ ...newCandidate, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setNewCandidate({ ...newCandidate, resume: e.target.files[0] });
  };

  // Add a new candidate
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newCandidate).forEach((key) => {
        formData.append(key, newCandidate[key]);
      });

      await hrAPI.addCandidate(formData);
      fetchCandidates();
      setShowModal(false);
      setNewCandidate({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        position_applied: "",
        resume: null,
      });
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  };

  // Update candidate status
  const handleStatusChange = async (id, status) => {
    try {
      await hrAPI.updateCandidate(id, { status });
      fetchCandidates();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Delete candidate
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await hrAPI.deleteCandidate(id);
        fetchCandidates();
      } catch (error) {
        console.error("Error deleting candidate:", error);
      }
    }
  };

  return (
    <Container className="recruitment-container fade-in">
      <h2 className="my-4 slide-up">Recruitment & Onboarding</h2>

      {/* Add Candidate Button */}
      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        className="mb-3 hover-button"
      >
        Add Candidate
      </Button>

      {/* Candidates Table */}
      <Table striped bordered hover responsive className="animated-table">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Position</th>
            <th>Status</th>
            <th>Resume</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id} className="fade-in-row">
              <td>{candidate.first_name} {candidate.last_name}</td>
              <td>{candidate.email}</td>
              <td>{candidate.phone}</td>
              <td>{candidate.position_applied}</td>
              <td>
                <Form.Select value={candidate.status} onChange={(e) => handleStatusChange(candidate.id, e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </Form.Select>
              </td>
              <td>
                {candidate.resume ? (
                  <a href={candidate.resume} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                    View Resume
                  </a>
                ) : "No Resume"}
              </td>
              <td>
                <Button variant="danger" size="sm" className="hover-button" onClick={() => handleDelete(candidate.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Candidate Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} className="fade-in-modal">
        <Modal.Header closeButton>
          <Modal.Title>Add Candidate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="first_name" value={newCandidate.first_name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="last_name" value={newCandidate.last_name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={newCandidate.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" name="phone" value={newCandidate.phone} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Position Applied</Form.Label>
              <Form.Control type="text" name="position_applied" value={newCandidate.position_applied} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Resume</Form.Label>
              <Form.Control type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
            </Form.Group>
            <Button variant="success" type="submit">
              Add Candidate
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Recruitment;
