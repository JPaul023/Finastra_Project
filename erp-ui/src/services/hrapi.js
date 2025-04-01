import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/hr/api';

const hrAPI = {
  getEmployees: () => axios.get(`${API_BASE_URL}/employees/`),
  createEmployee: (data) => axios.post(`${API_BASE_URL}/employees/`, data),
  updateEmployee: (id, data) => axios.put(`${API_BASE_URL}/employees/${id}/`, data),
  deleteEmployee: (id) => axios.delete(`${API_BASE_URL}/employees/${id}/`),

  getPayrolls: () => axios.get(`${API_BASE_URL}/payroll/`),
  createPayroll: (data) => axios.post(`${API_BASE_URL}/payroll/`, data),
  updatePayroll: (id, data) => axios.put(`${API_BASE_URL}/payroll/${id}/`, data),
  deletePayroll: (id) => axios.delete(`${API_BASE_URL}/payroll/${id}/`),

  getUnevaluatedEmployees: () => axios.get(`${API_BASE_URL}/unevaluated-employees/`),
  getEvaluatedEmployees: () => axios.get(`${API_BASE_URL}/evaluated-employees/`),
  evaluateEmployee: (id, performance_score) =>
      axios.post(`${API_BASE_URL}/evaluate-employee/${id}/`, { performance_score }),
  editPerformance: (id, performance_score) =>
    axios.put(`${API_BASE_URL}/edit-performance/${id}/`, { performance_score }),

  resetEvaluation: (id) =>
    axios.put(`${API_BASE_URL}/reset-evaluation/${id}/`),

  // Attendance API Endpoints
  getAttendanceRecords: () => axios.get(`${API_BASE_URL}/attendance/`),
  markAttendance: (data) => axios.post(`${API_BASE_URL}/attendance/`, data),
  updateAttendance: (id, data) => axios.put(`${API_BASE_URL}/attendance/${id}/`, data),
  deleteAttendance: (id) => axios.delete(`${API_BASE_URL}/attendance/${id}/`),
  editAttendance: (id, data) => axios.put(`${API_BASE_URL}/attendance/edit/${id}/`, data),  // ✅ Added this

  // Leave API Endpoints
  getLeaveRecords: () => axios.get(`${API_BASE_URL}/leave/`),
  addLeaveRecord: (data) => axios.post(`${API_BASE_URL}/leave/`, data),
  updateLeaveRecord: (id, data) => axios.put(`${API_BASE_URL}/leave/${id}/`, data),
  deleteLeaveRecord: (id) => axios.delete(`${API_BASE_URL}/leave/${id}/`),

  getCandidates: () => axios.get(`${API_BASE_URL}/candidates/`),

  addCandidate: (candidateData) => axios.post(`${API_BASE_URL}/candidates/`, candidateData, {
    headers: { "Content-Type": "multipart/form-data" }, // Required for file upload
  }),

  updateCandidate: (id, candidateData) => axios.put(`${API_BASE_URL}/candidates/${id}/`, candidateData),

  deleteCandidate: (id) => axios.delete(`${API_BASE_URL}/candidates/${id}/`),
};

// Debugging: Log the hrAPI object to confirm it has the expected functions
console.log("Loaded hrAPI:", hrAPI);

export default hrAPI;
