import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/inventoryAPI';
import 'bootstrap/dist/css/bootstrap.min.css';
import StatCard from '../../components/inventory/StatCard';
import { Grid2 } from '@mui/material';

const InventoryDashboard = () => {
  const [categoryStats, setCategoryStats] = useState([]);
  const [stockStats, setStockStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        api.getCategories(),
        api.getItems()
      ]);

      const categories = categoriesRes.data;
      const items = itemsRes.data;

      const categoryCountMap = {};
      const stockData = [];
      
      items.forEach(item => {
        if (!categoryCountMap[item.category_name]) {
          categoryCountMap[item.category_name] = 0;
        }
        categoryCountMap[item.category_name]++;

        stockData.push({ name: item.name, stock: item.stock_quantity });
      });

      const categoryData = Object.keys(categoryCountMap).map(name => ({
        name,
        count: categoryCountMap[name]
      }));

      setCategoryStats(categoryData);
      setStockStats(stockData);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setError('Failed to load inventory data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <h3 className="text-left mb-4">Inventory</h3>
      <Grid2 container spacing={3} justifyContent="left">
        <StatCard title="Categories" value={categoryStats.length} color="#007bff" />
        <StatCard title="Total Items" value={stockStats.length} color="#28a745" />
      </Grid2>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-white" style={{ backgroundColor: "#4e73df" }}>
              <h5 className="mb-0">Items per Category</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryStats}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Items"  fill="#4e73df" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-white" style={{ backgroundColor: "#1cc88a" }}>
              <h5 className="mb-0">Stock Quantity per Item</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockStats}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="stock" name="Stock Level"  fill="#1cc88a"  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end mt-3">
        <button className="btn btn-outline-secondary me-2" onClick={fetchData}>
          <i className="bi bi-arrow-clockwise me-1"></i>
          Refresh Data
        </button>
        <button className="btn" style={{ backgroundColor: "#4e73df", color: "white" }}>
          <i className="bi bi-file-earmark-arrow-down me-1"></i>
          Export Report
        </button>
      </div>
    </div>
  );
};

export default InventoryDashboard;
