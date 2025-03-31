import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Sidebar from './components/Sidebar';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Maindashboard from "./pages/MainDashboard";
import { ThemeProvider } from "react-bootstrap"; 


// Import pages from the new directory
import Dashboard from './pages/Logistics/Dashboard';
import Orders from './pages/Logistics/Orders';

// import Shipments from './pages/Logistics/Shipments';
// import Warehouses from './pages/Logistics/Warehouses';
// import Vehicles from './pages/Logistics/Vehicles';
// import Deliveries from './pages/Logistics/Deliveries';

// Import HR Pages
import HREmployees from './pages/hr/HREmployees';  // ✅ Fixed naming
import Payroll from './pages/hr/Payroll'; 
import Attendance from './pages/hr/Attendance'; // Import Attendance Page
import Recruitment from './pages/hr/Recruitment';
import Performance from './pages/hr/Performance';
import HRPayroll from "./pages/hr/HRPayroll"; 
import Leave from "./pages/hr/leave";


function App() {
  return (
    <ThemeProvider>  {/* ✅ Wrap everything */}
      <Router>
        <div className="app">
          <Sidebar />
          <div className="bg-light text-dark p-5 w-100">
            <Routes>
              <Route path="/" element={<Maindashboard />} />
              <Route path="/logistics/" element={<Dashboard />} />
              <Route path="/logistics/orders" element={<Orders />} />
              <Route path="/hr/employees" element={<HREmployees />} />
              <Route path="/hr/payroll" element={<Payroll />} />
              <Route path="/hr/attendance" element={<Attendance />} />
              <Route path="/hr/recruitment" element={<Recruitment />} />
              <Route path="/hr/performance" element={<Performance />} />
              <Route path="/hr/hrpayroll" element={<HRPayroll />} />
              <Route path="/leave" element={<Leave />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>  
  );
}

export default App;