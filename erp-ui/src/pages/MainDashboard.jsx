import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaUsers, FaCoins, FaBoxes, FaTruck, FaHandshake } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4">Welcome to the ERP System</h2>

      <Row className="g-4">
        {/* Human Resources */}
        <Col md={4}>
          <Card className="shadow-sm border-0 text-center">
            <Card.Body>
              <FaUsers size={40} className="text-primary mb-3" />
              <h5>Human Resources</h5>
              <p>Manage employees, payroll, and attendance.</p>
            </Card.Body>
          </Card>
        </Col>

        {/* Finance & Accounting */}
        <Col md={4}>
          <Card className="shadow-sm border-0 text-center">
            <Card.Body>
              <FaCoins size={40} className="text-success mb-3" />
              <h5>Finance & Accounting</h5>
              <p>Track expenses, accounts, and financial reports.</p>
            </Card.Body>
          </Card>
        </Col>

        {/* Inventory */}
        <Col md={4}>
          <Card className="shadow-sm border-0 text-center">
            <Card.Body>
              <FaBoxes size={40} className="text-warning mb-3" />
              <h5>Inventory Management</h5>
              <p>Monitor stock, suppliers, and purchase orders.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-3">
        {/* Logistics */}
        <Col md={4}>
          <Card className="shadow-sm border-0 text-center">
            <Card.Body>
              <FaTruck size={40} className="text-danger mb-3" />
              <h5>Logistics</h5>
              <p>Manage shipments, orders, and fleet tracking.</p>
            </Card.Body>
          </Card>
        </Col>

        {/* CRM */}
        <Col md={4}>
          <Card className="shadow-sm border-0 text-center">
            <Card.Body>
              <FaHandshake size={40} className="text-info mb-3" />
              <h5>Customer Relationship Management</h5>
              <p>Handle customers, leads, and marketing campaigns.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
