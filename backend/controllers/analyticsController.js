const BlogNewsModel = require('./../models/blogModel');
const UserModel = require('./../models/userModel');

exports.getDashboardStats = async (req, res) => {
  try {
    // Get total posts count
    const totalPosts = await BlogNewsModel.countDocuments();
    
    // Get published posts count
    const publishedPosts = await BlogNewsModel.countDocuments({ status: 'Published' });
    
    // Get draft posts count
    const draftPosts = await BlogNewsModel.countDocuments({ status: 'Draft' });
    
    // Get total users count
    const totalUsers = await UserModel.countDocuments();
    
    // Get total comments count
    const totalComments = await BlogNewsModel.aggregate([
      { $group: { _id: null, total: { $sum: "$comments" } } }
    ]);
    const totalCommentCount = totalComments.length > 0 ? totalComments[0].total : 0;
    
    // Get recent posts (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentPosts = await BlogNewsModel.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get recent users (last 30 days)
    const recentUsers = await UserModel.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get total views (assuming you have a views field in your blog model)
    const totalViews = await BlogNewsModel.aggregate([
      { $group: { _id: null, total: { $sum: "$views" } } }
    ]);
    const totalViewCount = totalViews.length > 0 ? totalViews[0].total : 0;
    
    // Get total categories (if you have a categories collection)
    const Category = require('./../models/categoryModel');
    const totalCategories = await Category.countDocuments();
    
    res.status(200).json({
      status: 'success',
      data: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalUsers,
        totalComments: totalCommentCount,
        totalViewCount,
        totalCategories,
        recentPosts,
        recentUsers
      }
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getRecentPosts = async (req, res) => {
  try {
    // Get the 5 most recent posts
    const recentPosts = await BlogNewsModel.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('newsTitle newsDescription status category createdAt views comments');
    
    res.status(200).json({
      status: 'success',
      data: {
        posts: recentPosts
      }
    });
  } catch (err) {
    console.error('Error fetching recent posts:', err);
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getTopPosts = async (req, res) => {
  try {
    // Get top 5 posts by views
    const topPosts = await BlogNewsModel.find({ status: 'Published' })
      .sort({ views: -1 })
      .limit(5)
      .select('newsTitle views comments likes createdAt');
    
    res.status(200).json({
      status: 'success',
      data: {
        posts: topPosts
      }
    });
  } catch (err) {
    console.error('Error fetching top posts:', err);
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getPostsByCategory = async (req, res) => {
  try {
    // Get post count by category
    const postsByCategory = await BlogNewsModel.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    res.status(200).json({
      status: 'success',
      data: {
        postsByCategory
      }
    });
  } catch (err) {
    console.error('Error fetching posts by category:', err);
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getUserActivity = async (req, res) => {
  try {
    // Get user registration trends for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const userActivity = await UserModel.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    res.status(200).json({
      status: 'success',
      data: {
        userActivity
      }
    });
  } catch (err) {
    console.error('Error fetching user activity:', err);
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};