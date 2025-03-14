import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Inventory Management
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/inventroy/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/inventroy/categories">Categories</Button>
          <Button color="inherit" component={Link} to="/inventroy/items">Items</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;