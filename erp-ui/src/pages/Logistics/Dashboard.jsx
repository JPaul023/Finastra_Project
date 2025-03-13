import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../../services/logisticsAPI';


const Dashboard = () => {
  const [stats, setStats] = useState({
    orderCount: 0,
    shipmentCount: 0,
    warehouseCount: 0,
    vehicleCount: 0,
    deliveryCount: 0,
    pendingOrdersCount: 0
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // In a real application, you might have an endpoint that returns all stats at once
        // For this example, we'll make separate calls
        const [orders, shipments, warehouses, vehicles, deliveries] = await Promise.all([
          api.getOrders(),
          api.getShipments(),
          api.getWarehouses(),
          api.getVehicles(),
          api.getDeliveries()
        ]);
        
        const pendingOrders = orders.data.filter(order => order.status === 'pending');
        
        setStats({
          orderCount: orders.data.length,
          shipmentCount: shipments.data.length,
          warehouseCount: warehouses.data.length,
          vehicleCount: vehicles.data.length,
          deliveryCount: deliveries.data.length,
          pendingOrdersCount: pendingOrders.length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Sample data for charts
  const statusData = [
    { name: 'Pending', value: 5 },
    { name: 'Processing', value: 10 },
    { name: 'Shipped', value: 15 },
    { name: 'Delivered', value: 20 },
  ];
  
  const monthlyData = [
    { name: 'Jan', orders: 40, shipments: 24 },
    { name: 'Feb', orders: 30, shipments: 13 },
    { name: 'Mar', orders: 20, shipments: 18 },
    { name: 'Apr', orders: 27, shipments: 23 },
    { name: 'May', orders: 18, shipments: 15 },
    { name: 'Jun', orders: 23, shipments: 19 },
  ];
  
  const deliveryPerformanceData = [
    { name: 'Mon', onTime: 20, delayed: 3 },
    { name: 'Tue', onTime: 15, delayed: 5 },
    { name: 'Wed', onTime: 18, delayed: 2 },
    { name: 'Thu', onTime: 22, delayed: 1 },
    { name: 'Fri', onTime: 25, delayed: 4 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  if (loading) {
    return <div className="p-8">Loading dashboard data...</div>;
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Logistics Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Link to="/orders" className="bg-blue-100 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-blue-800">Orders</h3>
          <p className="text-3xl font-bold">{stats.orderCount}</p>
          <p className="text-sm text-gray-600">{stats.pendingOrdersCount} pending orders</p>
        </Link>
        
        <Link to="/shipments" className="bg-green-100 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-green-800">Shipments</h3>
          <p className="text-3xl font-bold">{stats.shipmentCount}</p>
          <p className="text-sm text-gray-600">In transit</p>
        </Link>
        
        <Link to="/warehouses" className="bg-yellow-100 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-yellow-800">Warehouses</h3>
          <p className="text-3xl font-bold">{stats.warehouseCount}</p>
          <p className="text-sm text-gray-600">Active locations</p>
        </Link>
        
        <Link to="/vehicles" className="bg-purple-100 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-purple-800">Vehicles</h3>
          <p className="text-3xl font-bold">{stats.vehicleCount}</p>
          <p className="text-sm text-gray-600">Fleet status</p>
        </Link>
        
        <Link to="/deliveries" className="bg-red-100 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-red-800">Deliveries</h3>
          <p className="text-3xl font-bold">{stats.deliveryCount}</p>
          <p className="text-sm text-gray-600">To be completed</p>
        </Link>
      </div>
      
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#8884d8" name="Orders" />
              <Bar dataKey="shipments" fill="#82ca9d" name="Shipments" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Delivery Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={deliveryPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="onTime" stroke="#82ca9d" name="On Time" />
              <Line type="monotone" dataKey="delayed" stroke="#ff8042" name="Delayed" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex justify-between p-2 border-b">
              <span>Order #45678 placed</span>
              <span className="text-gray-500">3 mins ago</span>
            </div>
            <div className="flex justify-between p-2 border-b">
              <span>Shipment #S-89012 dispatched</span>
              <span className="text-gray-500">15 mins ago</span>
            </div>
            <div className="flex justify-between p-2 border-b">
              <span>Vehicle #V-421 maintenance completed</span>
              <span className="text-gray-500">2 hours ago</span>
            </div>
            <div className="flex justify-between p-2 border-b">
              <span>Delivery #D-512 successfully completed</span>
              <span className="text-gray-500">3 hours ago</span>
            </div>
            <div className="flex justify-between p-2">
              <span>Warehouse #W-3 inventory updated</span>
              <span className="text-gray-500">5 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;