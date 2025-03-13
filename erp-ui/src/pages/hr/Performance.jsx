import React from "react";

const Performance = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Performance Evaluation System</h2>

      {/* Employee Performance Reviews */}
      <section className="mb-4">
        <h4>Employee Performance Reviews</h4>
        <p>Track periodic performance evaluations conducted by managers.</p>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Review Date</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>EMP001</td>
              <td>John Doe</td>
              <td>2025-03-10</td>
              <td>4.5/5</td>
              <td>Completed</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Goals & Objectives Management */}
      <section className="mb-4">
        <h4>Goals & Objectives Management</h4>
        <p>Set and track employee goals and objectives for performance growth.</p>
      </section>

      {/* Feedback & Ratings System */}
      <section className="mb-4">
        <h4>Feedback & Ratings System</h4>
        <p>Provide structured feedback, ratings, and comments on employee performance.</p>
      </section>

      {/* Performance Reports & Analytics */}
      <section className="mb-4">
        <h4>Performance Reports & Analytics</h4>
        <p>Generate detailed reports and analytics on employee performance over time.</p>
      </section>

      {/* Promotion & Salary Increment Recommendations */}
      <section>
        <h4>Promotion & Salary Increment Recommendations</h4>
        <p>Track promotions, bonuses, and salary increments based on performance reviews.</p>
      </section>
    </div>
  );
};

export default Performance;
