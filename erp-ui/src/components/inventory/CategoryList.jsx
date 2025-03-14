import React, { useState, useEffect } from 'react';
import { 
  Typography, Button, Box, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/inventoryAPI';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
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
  }, []);
  
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await categoryService.delete(categoryToDelete.id);
      setDeleteDialogOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Categories</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          component={Link}
          to="/categories/new"
        >
          Add Category
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map(category => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description || 'N/A'}</TableCell>
                <TableCell>{new Date(category.created_at).toLocaleString()}</TableCell>
                <TableCell>{new Date(category.updated_at).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton 
                    component={Link} 
                    to={`/categories/edit/${category.id}`}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(category)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the category "{categoryToDelete?.name}"?
          This will also delete all items in this category.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryList;