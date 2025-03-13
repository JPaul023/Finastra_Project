import React from "react";

const Attendance = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Attendance Tracking & Leave Management</h2>

      {/* Employee Attendance Records */}
      <section className="mb-4">
        <h4>Employee Attendance Records</h4>
        <p>Tracks daily attendance, including check-in and check-out times.</p>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>EMP001</td>
              <td>John Doe</td>
              <td>2025-03-12</td>
              <td>08:00 AM</td>
              <td>05:00 PM</td>
              <td><span className="badge bg-success">Present</span></td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Leave Requests & Approvals */}
      <section className="mb-4">
        <h4>Leave Requests & Approvals</h4>
        <p>Employees can request leaves, and managers can approve or reject them.</p>
        <button className="btn btn-primary">Request Leave</button>
      </section>

      {/* Absence Reports */}
      <section className="mb-4">
        <h4>Absence Reports</h4>
        <p>Monitor sick leaves, vacation days, and unexcused absences.</p>
      </section>

      {/* Monthly Attendance Summary */}
      <section className="mb-4">
        <h4>Monthly Attendance Summary</h4>
        <p>Displays attendance percentages and trends over time.</p>
      </section>

      {/* Leave Balance Management */}
      <section>
        <h4>Leave Balance Management</h4>
        <p>Track the number of leave days remaining for each employee.</p>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Total Leave Days</th>
              <th>Used</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>EMP001</td>
              <td>John Doe</td>
              <td>20</td>
              <td>5</td>
              <td>15</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Attendance;
