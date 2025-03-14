import React from "react";
import { Box, Typography, Grid2 } from '@mui/material';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Grid2 item xs={12} md={6} lg={3}>
      <Box sx={{ width: 300, borderLeft: `4px solid ${color}`, boxShadow: 2, borderRadius: 2, p: 2, bgcolor: 'background.paper' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="body2" fontWeight="bold" color={color} textTransform="uppercase">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              {value}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Grid2>
  );
};

export default StatCard;
