import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Sidebar from './components/Sidebar';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Maindashboard from "./pages/MainDashboard";
import { ThemeProvider } from "react-bootstrap"; 


// Import pages from the new directory
import Logistics from './pages/Logistics/Logistics';
import Orders from './pages/Logistics/Orders';
import Warehouses from './pages/Logistics/Warehouses';
import Shipments from './pages/Logistics/Shipments';
import Vehicles from './pages/Logistics/Vehicles';
import Deliveries from './pages/Logistics/Deliveries';

import Inventory from './pages/inventory/Inventory';
import CategoryList from './pages/inventory/CategoryList';
import ItemList from './pages/inventory/ItemList';

// Import HR Pages
import HREmployees from './pages/hr/HREmployees';  // ✅ Fixed naming
import Payroll from './pages/hr/Payroll'; 
import Attendance from './pages/hr/Attendance'; // Import Attendance Page
import Recruitment from './pages/hr/Recruitment';
import Performance from './pages/hr/Performance';
import HRPayroll from "./pages/hr/HRPayroll"; 
import Leave from "./pages/hr/leave";

import FinanceDashboard from './pages/finance/Dashboard';
import Income from './pages/finance/Income';
import Expenses from './pages/finance/Expenses';
import Reports from './pages/finance/Reports';


//Import CRM pages
import CustomerSupport from "./pages/crm/CustomerSupport";
import CustomerTable from "./pages/crm/CustomerTable";
import EmailSmsAutomation from "./pages/crm/Email&SMSAutomation";


function App() {
  return (
    <ThemeProvider>  {/* ✅ Wrap everything */}
      <Router>
        <div className="app">
          <Sidebar />
          <div className="bg-light text-dark p-5 w-100">
            <Routes>
              <Route path="/" element={<Maindashboard />} />
              <Route path="/logistics/" element={<Logistics />} />
              <Route path="/logistics/orders" element={<Orders />} />
              <Route path="/logistics/warehouses" element={<Warehouses />} />
              <Route path="/logistics/shipments" element={<Shipments />} />
              <Route path="/logistics/vehicles" element={<Vehicles />} />
              <Route path="/logistics/deliveries" element={<Deliveries />} />

              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inventory/categories" element={<CategoryList />} />
              <Route path="/inventory/items" element={<ItemList />} />

              <Route path="/hr/employees" element={<HREmployees />} />
              <Route path="/hr/payroll" element={<Payroll />} />
              <Route path="/hr/attendance" element={<Attendance />} />
              <Route path="/hr/recruitment" element={<Recruitment />} />
              <Route path="/hr/performance" element={<Performance />} />
              <Route path="/hr/hrpayroll" element={<HRPayroll />} />
              <Route path="/leave" element={<Leave />} />
              <Route path="/finance/dashboard" element={<FinanceDashboard />} />
              <Route path="/finance/income" element={<Income />} />
              <Route path="/finance/expenses" element={<Expenses />} />
              <Route path="/finance/reports" element={<Reports />} />

              <Route path="/crm/CustomerSupport" element={<CustomerSupport />} />
              <Route path="/crm/ClientDatabase&InteractionTracking" element={<CustomerTable />} />
              <Route path="/crm/Email&SMS" element={<EmailSmsAutomation />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>  
  );
}

export default App;