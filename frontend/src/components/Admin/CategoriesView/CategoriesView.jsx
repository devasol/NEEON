import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import styles from './CategoriesView.module.css';

const CategoriesView = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/categories', { name: newCategory });
      setCategories([...categories, response.data.data.category]);
      setNewCategory('');
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await api.patch(`/api/categories/${editingCategory._id}`, { name: editingCategory.name });
      setCategories(categories.map(cat => cat._id === editingCategory._id ? response.data.data.category : cat));
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await api.delete(`/api/categories/${id}`);
      setCategories(categories.filter(cat => cat._id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Categories</h2>
      <div className={styles.card}>
        <form onSubmit={handleCreateCategory}>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
          />
          <button type="submit">Add Category</button>
        </form>
      </div>
      <div className={styles.card}>
        <h3>Existing Categories</h3>
        <ul>
          {categories.map(category => (
            <li key={category._id}>
              {editingCategory && editingCategory._id === category._id ? (
                <form onSubmit={handleUpdateCategory}>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  />
                  <button type="submit">Save</button>
                  <button onClick={() => setEditingCategory(null)}>Cancel</button>
                </form>
              ) : (
                <div>
                  <span>{category.name}</span>
                  <div>
                    <button onClick={() => setEditingCategory(category)}>Edit</button>
                    <button onClick={() => handleDeleteCategory(category._id)}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoriesView;
