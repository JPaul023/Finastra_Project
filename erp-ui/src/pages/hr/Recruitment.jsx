import React from "react";

const Recruitment = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Recruitment & Onboarding System</h2>

      {/* Job Postings & Applications */}
      <section className="mb-4">
        <h4>Job Postings & Applications</h4>
        <p>List of open positions and application submission forms.</p>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Position</th>
              <th>Department</th>
              <th>Posted Date</th>
              <th>Apply</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>J001</td>
              <td>Software Engineer</td>
              <td>IT</td>
              <td>2025-03-10</td>
              <td><button className="btn btn-primary">Apply</button></td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Candidate Screening & Interviews */}
      <section className="mb-4">
        <h4>Candidate Screening & Interviews</h4>
        <p>Tracks application progress, interview schedules, and evaluations.</p>
      </section>

      {/* Hiring Decisions & Offer Letters */}
      <section className="mb-4">
        <h4>Hiring Decisions & Offer Letters</h4>
        <p>Manage approvals and send offer letters to selected candidates.</p>
      </section>

      {/* Employee Onboarding Process */}
      <section className="mb-4">
        <h4>Employee Onboarding Process</h4>
        <p>Checklist for onboarding tasks, document submissions, and orientation.</p>
      </section>

      {/* Probation & Evaluation */}
      <section>
        <h4>Probation & Evaluation</h4>
        <p>Track new hire performance evaluations during the probation period.</p>
      </section>
    </div>
  );
};

export default Recruitment;
