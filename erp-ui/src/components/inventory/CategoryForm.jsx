import React, { useState, useEffect } from 'react';
import { 
  Typography, Button, Box, TextField, Paper, 
  Grid, CircularProgress 
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { categoryService } from '../../services/inventoryAPI';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
});

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(isEditMode);
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
  });
  
  useEffect(() => {
    if (isEditMode) {
      const fetchCategory = async () => {
        try {
          const res = await categoryService.get(id);
          setInitialValues({
            name: res.data.name,
            description: res.data.description || '',
          });
          setLoading(false);
        } catch (error) {
          console.error('Error fetching category:', error);
          navigate('/categories');
        }
      };
      
      fetchCategory();
    }
  }, [id, isEditMode, navigate]);
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditMode) {
        await categoryService.update(id, values);
      } else {
        await categoryService.create(values);
      }
      navigate('/categories');
    } catch (error) {
      console.error('Error saving category:', error);
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
        {isEditMode ? 'Edit Category' : 'Add Category'}
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
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="name"
                    label="Category Name"
                    fullWidth
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
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
                      onClick={() => navigate('/categories')}
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

export default CategoryForm;