import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../../services/logisticsAPI';

function Logistics() {
  return(
    <h1>Logistics</h1>
  );
}

export default Logistics;