import React, { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { categoryService, itemService } from '../../services/inventoryAPI';

const Inventory = () => {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalItems: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, itemsRes] = await Promise.all([
          categoryService.getAll(),
          itemService.getAll(),
        ]);
        
        setStats({
          totalCategories: categoriesRes.data.length,
          totalItems: itemsRes.data.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Categories</Typography>
              <Typography variant="h3">{stats.totalCategories}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Items</Typography>
              <Typography variant="h3">{stats.totalItems}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Inventory;