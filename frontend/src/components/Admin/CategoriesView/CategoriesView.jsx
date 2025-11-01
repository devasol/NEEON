import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import styles from './CategoriesView.module.css';

const CategoriesView = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/categories', true); 
      
      if (response.data && response.data.data && response.data.data.categories) {
        setCategories(response.data.data.categories);
      } else if (response.data && response.data.categories) {
        setCategories(response.data.categories);
      } else if (Array.isArray(response)) {
        setCategories(response);
      } else {
        console.warn('Unexpected response format:', response);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error.message);
      
      const errorEvent = new CustomEvent("showToast", {
        detail: { message: "Error fetching categories: " + error.message, type: "error" },
      });
      window.dispatchEvent(errorEvent);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      
      const errorEvent = new CustomEvent("showToast", {
        detail: { message: "Please enter a category name", type: "error" },
      });
      window.dispatchEvent(errorEvent);
      return;
    }

    try {
      const response = await api.post('/api/categories', { name: newCategory }, true);
      
      let newCategoryObj;
      if (response.data && response.data.data && response.data.data.category) {
        newCategoryObj = response.data.data.category;
      } else if (response.data && response.data.category) {
        newCategoryObj = response.data.category;
      } else {
        newCategoryObj = response.data;
      }
      
      setCategories([...categories, newCategoryObj]);
      setNewCategory('');
      // Show success toast
      const successEvent = new CustomEvent("showToast", {
        detail: { message: `Category "${newCategory}" created successfully`, type: "success" },
      });
      window.dispatchEvent(successEvent);
    } catch (error) {
      console.error('Error creating category:', error);
      // Show error toast
      const errorEvent = new CustomEvent("showToast", {
        detail: { message: "Error creating category: " + error.message, type: "error" },
      });
      window.dispatchEvent(errorEvent);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory.name.trim()) {
      // Show warning toast
      const errorEvent = new CustomEvent("showToast", {
        detail: { message: "Please enter a category name", type: "error" },
      });
      window.dispatchEvent(errorEvent);
      return;
    }

    try {
      const response = await api.patch(`/api/categories/${editingCategory._id}`, { name: editingCategory.name }, true);
      // Handle different response structures for updated category
      let updatedCategory;
      if (response.data && response.data.data && response.data.data.category) {
        updatedCategory = response.data.data.category;
      } else if (response.data && response.data.category) {
        updatedCategory = response.data.category;
      } else {
        updatedCategory = response.data;
      }
      
      setCategories(categories.map(cat => cat._id === editingCategory._id ? updatedCategory : cat));
      setEditingCategory(null);
      // Show success toast
      const successEvent = new CustomEvent("showToast", {
        detail: { message: `Category updated successfully`, type: "success" },
      });
      window.dispatchEvent(successEvent);
    } catch (error) {
      console.error('Error updating category:', error);
      // Show error toast
      const errorEvent = new CustomEvent("showToast", {
        detail: { message: "Error updating category: " + error.message, type: "error" },
      });
      window.dispatchEvent(errorEvent);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      return;
    }

    try {
      await api.delete(`/api/categories/${id}`, true);
      setCategories(categories.filter(cat => cat._id !== id));
      // Show success toast
      const successEvent = new CustomEvent("showToast", {
        detail: { message: `Category "${name}" deleted successfully`, type: "success" },
      });
      window.dispatchEvent(successEvent);
    } catch (error) {
      console.error('Error deleting category:', error);
      
      const errorEvent = new CustomEvent("showToast", {
        detail: { message: "Error deleting category: " + error.message, type: "error" },
      });
      window.dispatchEvent(errorEvent);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h2>Categories</h2>
        <div className={styles.loading}>Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h2>Categories</h2>
        <div className={styles.error}>Error: {error}</div>
        <button onClick={fetchCategories}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Categories</h2>
      <div className={styles.card}>
        <h3>Add New Category</h3>
        <form onSubmit={handleCreateCategory}>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category name"
          />
          <button type="submit">Add Category</button>
        </form>
      </div>
      <div className={styles.card}>
        <h3>Existing Categories</h3>
        {categories.length === 0 ? (
          <p className={styles.noData}>No categories found. Create your first category.</p>
        ) : (
          <ul>
            {categories.map(category => (
              <li key={category._id} className={styles.categoryItem}>
                {editingCategory && editingCategory._id === category._id ? (
                  <form onSubmit={handleUpdateCategory} className={styles.editForm}>
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      placeholder="Category name"
                      className={styles.editInput}
                    />
                    <div className={styles.editActions}>
                      <button type="submit" className={styles.saveBtn}>Save</button>
                      <button type="button" className={styles.cancelBtn} onClick={() => setEditingCategory(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className={styles.categoryInfo}>
                    <span className={styles.categoryName}>{category.name}</span>
                    <div className={styles.categoryActions}>
                      <button 
                        onClick={() => setEditingCategory(category)} 
                        className={styles.editBtn}
                        title="Edit category"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(category._id, category.name)} 
                        className={styles.deleteBtn}
                        title="Delete category"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoriesView;