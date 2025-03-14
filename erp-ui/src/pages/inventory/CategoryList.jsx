import React, { useState, useEffect } from "react";
import api from "../../services/inventoryAPI";
import Table from "../../components/Logistics/Table";
import Modal from "../../components/Logistics/Modal";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await api.getCategories();
      setCategories(response.data);
      setError(null);
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async () => {
    try {
      if (currentCategory.id) {
        await api.updateCategory(currentCategory.id, currentCategory);
      } else {
        await api.createCategory(currentCategory);
      }
      setShowModal(false);
      setSuccess("Saved successfully");
      loadCategories();
    } catch {
      setError("Failed to save category.");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.deleteCategory(id);
        setSuccess("Category deleted successfully");
        loadCategories();
      } catch {
        setError("Failed to delete category");
      }
    }
  };

  const handleInputChange = (e) => {
    setCurrentCategory({ ...currentCategory, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setCurrentCategory({ name: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setCurrentCategory(category);
    setShowModal(true);
  };

  const columns = [
    { key: "name", label: "Category Title" },
    { key: "description", label: "Description" },
  ];

  const fields = [
    { name: "name", label: "Category Title", type: "text" },
    { name: "description", label: "Description", type: "text" },
  ];

  return (
    <div className="container-fluid py-4">
      <button className="btn" style={{ backgroundColor: "#4e73df", color: "white" }} onClick={openCreateModal}>
        <i className="bi bi-plus-circle me-1"></i> Add Category
      </button>
      {loading ? <div>Loading...</div> : <Table data={categories} columns={columns} onEdit={openEditModal} onDelete={handleDeleteCategory} />}
      <Modal showModal={showModal} title="Manage Category" fields={fields} data={currentCategory} onClose={() => setShowModal(false)} onChange={handleInputChange} onSave={handleSaveCategory} />
    </div>
  );
}

export default CategoryList;
