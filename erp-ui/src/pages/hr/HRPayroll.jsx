import React, { useEffect, useState } from "react";
import hrAPI from "../../services/hrapi";
import jsPDF from "jspdf";
import "jspdf-autotable";

const HRPayroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newPayroll, setNewPayroll] = useState({
    employee: "",
    basic_salary: "",
    deductions: "",
    bonuses: "",
  });
  const [editingPayroll, setEditingPayroll] = useState(null); // ✅ Track if editing

  useEffect(() => {
    fetchPayrolls();
    fetchEmployees();
  }, []);

  const fetchPayrolls = async () => {
    try {
      const response = await hrAPI.getPayrolls();
      setPayrolls(response.data);
    } catch (error) {
      console.error("Error fetching payrolls:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await hrAPI.getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewPayroll({ ...newPayroll, [e.target.name]: e.target.value });
  };

  // ✅ Save or Update Payroll
  const savePayroll = async () => {
    try {
      if (editingPayroll) {
        await hrAPI.updatePayroll(editingPayroll.id, newPayroll); // ✅ Update existing record
      } else {
        await hrAPI.createPayroll(newPayroll); // ✅ Create new record
      }

      fetchPayrolls();
      setNewPayroll({ employee: "", basic_salary: "", deductions: "", bonuses: "" });
      setEditingPayroll(null); // ✅ Reset editing mode
      alert("Payroll saved successfully!");
    } catch (error) {
      console.error("Error saving payroll:", error);
    }
  };

  // ✅ Set payroll data for editing (Fix: Pre-select Employee)
  const editPayroll = (payroll) => {
    const matchedEmployee = employees.find((emp) => emp.first_name + " " + emp.last_name === payroll.employee_name);

    setNewPayroll({
      employee: matchedEmployee ? matchedEmployee.id : "",
      basic_salary: payroll.basic_salary,
      deductions: payroll.deductions,
      bonuses: payroll.bonuses,
    });
    setEditingPayroll(payroll); // ✅ Set editing mode
  };

  // ✅ Delete payroll record
  const deletePayroll = async (id) => {
    if (window.confirm("Are you sure you want to delete this payroll record?")) {
      try {
        await hrAPI.deletePayroll(id);
        fetchPayrolls();
        alert("Payroll record deleted successfully!");
      } catch (error) {
        console.error("Error deleting payroll:", error);
      }
    }
  };

  // ✅ Print payroll slip
  const printPayroll = (payroll) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Payroll Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`Employee: ${payroll.employee_name}`, 14, 35);
    doc.text(`Basic Salary: $${payroll.basic_salary}`, 14, 45);
    doc.text(`Deductions: $${payroll.deductions}`, 14, 55);
    doc.text(`Bonuses: $${payroll.bonuses}`, 14, 65);
    doc.text(`Net Salary: $${payroll.net_salary}`, 14, 75);

    doc.save(`Payroll_${payroll.employee_name}.pdf`);
  };

  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4">Payroll Processing & Salary Slips</h1>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Basic Salary</th>
            <th>Deductions</th>
            <th>Bonuses</th>
            <th>Net Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.map((payroll) => (
            <tr key={payroll.id}>
              <td>{payroll.employee_name}</td>
              <td>${payroll.basic_salary}</td>
              <td>${payroll.deductions}</td>
              <td>${payroll.bonuses}</td>
              <td>${payroll.net_salary}</td>
              <td>
                <button className="btn btn-sm btn-primary mx-1" onClick={() => editPayroll(payroll)}>Edit</button>
                <button className="btn btn-sm btn-danger mx-1" onClick={() => deletePayroll(payroll.id)}>Delete</button>
                <button className="btn btn-sm btn-success mx-1" onClick={() => printPayroll(payroll)}>Print</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>{editingPayroll ? "Edit Payroll" : "Add Payroll"}</h3>
      <div className="payroll-form p-4 border rounded bg-white">
        <div className="d-flex gap-3 mb-3">
          <select className="form-control" name="employee" value={newPayroll.employee} onChange={handleInputChange}>
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.first_name} {emp.last_name}
              </option>
            ))}
          </select>
          <input className="form-control" type="number" name="basic_salary" placeholder="Basic Salary" value={newPayroll.basic_salary} onChange={handleInputChange} />
          <input className="form-control" type="number" name="deductions" placeholder="Deductions" value={newPayroll.deductions} onChange={handleInputChange} />
          <input className="form-control" type="number" name="bonuses" placeholder="Bonuses" value={newPayroll.bonuses} onChange={handleInputChange} />
        </div>
        <button className="btn btn-primary w-100 py-2" onClick={savePayroll}>
          {editingPayroll ? "Update Payroll" : "Save Payroll"}
        </button>
      </div>
    </div>
  );
};

export default HRPayroll;
