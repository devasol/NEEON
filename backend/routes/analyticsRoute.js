const express = require('express');
const router = express.Router();
const analyticsController = require('./../controllers/analyticsController');
const authController = require('./../controllers/authController');

// All routes require admin authentication
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

// Get dashboard statistics
router.get('/dashboard-stats', analyticsController.getDashboardStats);

// Get recent posts
router.get('/recent-posts', analyticsController.getRecentPosts);

// Get top posts by views
router.get('/top-posts', analyticsController.getTopPosts);

// Get posts by category
router.get('/posts-by-category', analyticsController.getPostsByCategory);

// Get user activity trends
router.get('/user-activity', analyticsController.getUserActivity);

module.exports = router;