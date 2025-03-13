import React from "react";

const Payroll = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Payroll Processing & Salary Slips</h2>

      {/* Employee Salary Details Section */}
      <section className="mb-4">
        <h4>Employee Salary Details</h4>
        <p>Displays salary information for employees including base salary, allowances, and bonuses.</p>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Base Salary</th>
              <th>Allowances</th>
              <th>Bonuses</th>
              <th>Gross Salary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>EMP001</td>
              <td>John Doe</td>
              <td>$3000</td>
              <td>$200</td>
              <td>$150</td>
              <td>$3350</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Payroll Calculation Section */}
      <section className="mb-4">
        <h4>Payroll Calculation</h4>
        <p>Automated payroll processing including tax deductions and net salary computation.</p>
      </section>

      {/* Salary Slip Generation Section */}
      <section className="mb-4">
        <h4>Salary Slip Generation</h4>
        <p>Downloadable salary slips for employees with details on earnings, deductions, and net salary.</p>
        <button className="btn btn-primary">Generate Salary Slip</button>
      </section>

      {/* Deductions & Taxes Section */}
      <section className="mb-4">
        <h4>Deductions & Taxes</h4>
        <p>Breakdown of deductions, including income tax, social security, and other withholdings.</p>
      </section>

      {/* Payment Status Section */}
      <section>
        <h4>Payment Status</h4>
        <p>Indicates whether the salary has been processed and deposited into the employee's account.</p>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>EMP001</td>
              <td>John Doe</td>
              <td><span className="badge bg-success">Paid</span></td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Payroll;
