import React, { useState, useEffect } from 'react';
import { 
  Typography, Button, Box, TextField, Paper, 
  Grid, CircularProgress, MenuItem 
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { itemService, categoryService } from '../../services/inventoryAPI';

const validationSchema = Yup.object({
  item_no: Yup.string().required('Item number is required'),
  name: Yup.string().required('Name is required'),
  category: Yup.string().required('Category is required'),
  price: Yup.number()
    .required('Price is required')
    .positive('Price must be positive'),
  stock_quantity: Yup.number()
    .required('Stock quantity is required')
    .integer('Stock must be an integer')
    .min(0, 'Stock cannot be negative'),
  description: Yup.string(),
});

const ItemForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(isEditMode);
  const [categories, setCategories] = useState([]);
  const [initialValues, setInitialValues] = useState({
    item_no: '',
    name: '',
    category: '',
    price: '',
    stock_quantity: 0,
    description: '',
  });
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAll();
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
    
    if (isEditMode) {
      const fetchItem = async () => {
        try {
          const res = await itemService.get(id);
          setInitialValues({
            item_no: res.data.item_no,
            name: res.data.name,
            category: res.data.category,
            price: res.data.price,
            stock_quantity: res.data.stock_quantity,
            description: res.data.description || '',
          });
          setLoading(false);
        } catch (error) {
          console.error('Error fetching item:', error);
          navigate('/items');
        }
      };
      
      fetchItem();
    }
  }, [id, isEditMode, navigate]);
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditMode) {
        await itemService.update(id, values);
      } else {
        await itemService.create(values);
      }
      navigate('/items');
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <CircularProgress />;
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? 'Edit Item' : 'Add Item'}
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, touched, errors }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="item_no"
                    label="Item Number"
                    fullWidth
                    error={touched.item_no && Boolean(errors.item_no)}
                    helperText={touched.item_no && errors.item_no}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="name"
                    label="Item Name"
                    fullWidth
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    select
                    name="category"
                    label="Category"
                    fullWidth
                    error={touched.category && Boolean(errors.category)}
                    helperText={touched.category && errors.category}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="price"
                    label="Price"
                    type="number"
                    inputProps={{ step: '0.01' }}
                    fullWidth
                    error={touched.price && Boolean(errors.price)}
                    helperText={touched.price && errors.price}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="stock_quantity"
                    label="Stock Quantity"
                    type="number"
                    fullWidth
                    error={touched.stock_quantity && Boolean(errors.stock_quantity)}
                    helperText={touched.stock_quantity && errors.stock_quantity}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="description"
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button 
                      variant="outlined" 
                      onClick={() => navigate('/items')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <CircularProgress size={24} /> : 'Save'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default ItemForm;