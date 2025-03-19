import React, { useState, useEffect } from "react";
import api from "../../services/inventoryAPI";
import Table from "../../components/Logistics/Table";
import Modal from "../../components/Logistics/Modal";
import SearchBar from "../../components/Logistics/SearchBar";

function ItemList() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [currentItem, setCurrentItem] = useState({
    item_no: "",
    name: "",
    category_name: "",
    price: 0,
    description: "",
    stock_quantity: "",
  });

  useEffect(() => {
    loadItems();
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

  useEffect(() => {
    // Filter items whenever searchTerm changes
    if (searchTerm) {
      const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchTerm, items]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await api.getItems();
      setItems(response.data);
      setFilteredItems(response.data); // Initialize with all items
      setError(null);
    } catch {
      setError("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.getCategories();
      const categoryOptions = response.data.map((category) => ({
        value: category.id,
        label: category.name,
      }));
      setCategories(categoryOptions);
    } catch {
      setError("Failed to load categories");
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSaveItem = async () => {
    try {
      if (currentItem.id) {
        await api.updateItem(currentItem.id, currentItem);
      } else {
        await api.createItem(currentItem);
      }
      setShowModal(false);
      setSuccess("Saved successfully");
      loadItems();
    } catch {
      setError("Failed to save item");
    }
  };

  const handleFilterChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    if (!category) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(
        (order) => String(order.category) === String(category)
      );
      setFilteredItems(filtered);
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.deleteItem(id);
        setSuccess("Item deleted successfully");
        loadItems();
      } catch {
        setError("Failed to delete item");
      }
    }
  };

  const handleInputChange = (e) => {
    setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setCurrentItem({
      item_no: "",
      name: "",
      category_name: "",
      price: 0.0,
      description: "",
      stock_quantity: 0,
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setCurrentItem(item);
    setShowModal(true);
  };

  const columns = [
    { key: "item_no", label: "Item No." },
    { key: "name", label: "Item Name" },
    { key: "category_name", label: "Category" },
    {
      key: "price",
      label: "Price",
      render: (val) => `$${Number(val).toFixed(2) || "0.00"}`,
    },
    { key: "description", label: "Description" },
    { key: "stock_quantity", label: "Quantity" },
  ];

  const fields = [
    { name: "name", label: "Item Name", type: "text" },
    { name: "price", label: "Price Per Stock", type: "number" },
    { name: "description", label: "Description", type: "text" },
    { name: "stock_quantity", label: "Quantity", type: "number" },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: categories,
    },
  ];

  return (
    <div className="container-fluid py-4">
      <h3 className="text-left mb-4">List of Items</h3>
      <div className="d-flex justify-content-between mb-3">
        <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
        <select
          className="form-select w-25 me-2"
          value={selectedCategory}
          onChange={handleFilterChange}
          style={{ height: "3rem" }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <button
          className="btn"
          style={{ backgroundColor: "#4e73df", color: "white" }}
          onClick={openCreateModal}
        >
          <i className="bi bi-plus-circle me-1"></i> New Item
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table
          data={filteredItems}
          columns={columns}
          onEdit={openEditModal}
          onDelete={handleDeleteItem}
        />
      )}
      <Modal
        showModal={showModal}
        title="Manage Item"
        fields={fields}
        data={currentItem}
        onClose={() => setShowModal(false)}
        onChange={handleInputChange}
        onSave={handleSaveItem}
      />
    </div>
  );
}

export default ItemList;
