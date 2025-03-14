import React, { useState, useEffect } from 'react';
import { 
  Typography, Button, Box, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, MenuItem, TextField
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { itemService, categoryService } from '../../services/inventoryAPI';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const fetchItems = async (categoryId = '') => {
    try {
      const res = categoryId 
        ? await itemService.getAllByCategory(categoryId)
        : await itemService.getAll();
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll();
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);
  
  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    fetchItems(categoryId);
  };
  
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await itemService.delete(itemToDelete.id);
      setDeleteDialogOpen(false);
      fetchItems(selectedCategory);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Inventory Items</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          component={Link}
          to="/items/new"
        >
          Add Item
        </Button>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          select
          label="Filter by Category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item No.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.item_no}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category_name}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>{item.stock_quantity}</TableCell>
                <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton 
                    component={Link} 
                    to={`/items/edit/${item.id}`}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(item)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the item "{itemToDelete?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ItemList;