import React, { useEffect, useState } from "react";
import hrAPI from "../../services/hrapi";
import "./animations.css"; // Corrected the import path

const HREmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    position: "",
    salary: "",
    department: "",
    date_hired: "",
  });

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const response = await hrAPI.getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  // Save Employee
  const saveEmployee = async () => {
    if (!newEmployee.first_name || !newEmployee.last_name || !newEmployee.email) {
      alert("Please fill out all required fields!");
      return;
    }

    try {
      if (editingEmployee) {
        await hrAPI.updateEmployee(editingEmployee.id, newEmployee);
      } else {
        await hrAPI.createEmployee(newEmployee);
      }

      fetchEmployees();
      setNewEmployee({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        position: "",
        salary: "",
        department: "",
        date_hired: "",
      });
      setEditingEmployee(null);
      alert("Employee saved successfully!");
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  // Edit Employee
  const editEmployee = (employee) => {
    setNewEmployee(employee);
    setEditingEmployee(employee);
  };

  // Delete Employee
  const deleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await hrAPI.deleteEmployee(id);
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  return (
    <div className="container-fluid py-4 fade-in-slide">
      <h1 className="mb-4 slide-in-left">Employee Records Management</h1>

      {/* Search & Add Employee */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Employee Table */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Position</th>
                <th>Department</th>
                <th>Date Hired</th>
                <th>Salary</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees
                  .filter((emp) =>
                    `${emp.first_name} ${emp.last_name}`
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((employee, index) => (
                    <tr key={employee.id} className={`slide-in-row delay-${index}`}>
                      <td>{employee.id}</td>
                      <td>{employee.first_name} {employee.last_name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.phone}</td>
                      <td>{employee.position}</td>
                      <td>{employee.department}</td>
                      <td>{employee.date_hired}</td>
                      <td>${employee.salary}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => editEmployee(employee)}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteEmployee(employee.id)}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-muted">No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Form */}
      <h3 className="mt-4 slide-in-right">
        {editingEmployee ? "Edit Employee" : "Add New Employee"}
      </h3>
      <div className="card p-3 scale-in">
        <div className="row">
          <div className="col-md-4">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              className="form-control mb-2"
              value={newEmployee.first_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              className="form-control mb-2"
              value={newEmployee.last_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control mb-2"
              value={newEmployee.email}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* New fields for Phone, Position, Department, Salary, Date Hired */}
        <div className="row mt-3">
          <div className="col-md-4">
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              className="form-control mb-2"
              value={newEmployee.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              name="position"
              placeholder="Position"
              className="form-control mb-2"
              value={newEmployee.position}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              name="department"
              placeholder="Department"
              className="form-control mb-2"
              value={newEmployee.department}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-4">
            <input
              type="number"
              name="salary"
              placeholder="Salary"
              className="form-control mb-2"
              value={newEmployee.salary}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <input
              type="date"
              name="date_hired"
              placeholder="Date Hired"
              className="form-control mb-2"
              value={newEmployee.date_hired}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <button className="btn btn-primary mt-3" onClick={saveEmployee}>
          {editingEmployee ? "Update Employee" : "Save Employee"}
        </button>
      </div>
    </div>
  );
};

export default HREmployees;
