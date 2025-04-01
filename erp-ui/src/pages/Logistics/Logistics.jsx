import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from "../../services/logisticsAPI";
import 'bootstrap/dist/css/bootstrap.min.css';
import StatCard from '../../components/inventory/StatCard';
import { Grid2 } from '@mui/material';

const Logistics = () => {
  const [orderStats, setOrderStats] = useState([]);
  const [shipmentStats, setShipmentStats] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalShipments, setTotalShipments] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, shipmentsRes, vehiclesRes] = await Promise.all([
        api.getOrders(),
        api.getShipments(),
        api.getVehicles(),
      ]);

      const orders = ordersRes.data;
      const shipments = shipmentsRes.data;
      const vehicles = vehiclesRes.data;

      // Orders per Warehouse
      const warehouseCountMap = {};
      orders.forEach(order => {
        const warehouseName = order.warehouse_name || 'Unknown';
        if (!warehouseCountMap[warehouseName]) {
          warehouseCountMap[warehouseName] = 0;
        }
        warehouseCountMap[warehouseName]++;
      });

      const orderData = Object.keys(warehouseCountMap).map(name => ({
        name,
        count: warehouseCountMap[name],
      }));

      // Shipments per Vehicle
      const vehicleCountMap = {};
      shipments.forEach(shipment => {
        const vehicleName = shipment.vehicle_name || 'Unknown';
        if (!vehicleCountMap[vehicleName]) {
          vehicleCountMap[vehicleName] = 0;
        }
        vehicleCountMap[vehicleName]++;
      });

      const shipmentData = Object.keys(vehicleCountMap).map(name => ({
        name,
        count: vehicleCountMap[name],
      }));

      setTotalOrders(orders.length);
      setTotalShipments(shipments.length);
      setTotalVehicles(vehicles.length);
      setOrderStats(orderData);
      setShipmentStats(shipmentData);
    } catch (error) {
      console.error('Error fetching logistics data:', error);
      setError('Failed to load logistics data. Please try again later.');
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
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container-fluid py-4">
      <h3 className="text-left mb-4">Logistics Dashboard</h3>
      <Grid2 container spacing={3} justifyContent="left">
        <StatCard title="Total Orders" value={totalOrders} color="#007bff" />
        <StatCard title="Total Shipments" value={totalShipments} color="#28a745" />
        <StatCard title="Total Vehicles" value={totalVehicles} color="#ffcc00" />
      </Grid2>

      

    </div>
  );
};

export default Logistics;
