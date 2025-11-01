const express = require('express');
const router = express.Router();
const analyticsController = require('./../controllers/analyticsController');
const authController = require('./../controllers/authController');


router.use(authController.protect);
router.use(authController.restrictTo('admin'));


router.get('/dashboard-stats', analyticsController.getDashboardStats);


router.get('/recent-posts', analyticsController.getRecentPosts);


router.get('/top-posts', analyticsController.getTopPosts);


router.get('/posts-by-category', analyticsController.getPostsByCategory);


router.get('/user-activity', analyticsController.getUserActivity);

module.exports = router;