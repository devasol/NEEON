import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../../../utils/api';
import styles from './AnalyticsCharts.module.css';

const AnalyticsCharts = () => {
  const [chartData, setChartData] = useState({
    viewsData: [],
    postsByCategory: [],
    userActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Fetch all analytics data in parallel
        const [viewsResponse, categoryResponse, userResponse] = await Promise.allSettled([
          api.get('/api/v1/analytics/top-posts', true),
          api.get('/api/v1/analytics/posts-by-category', true),
          api.get('/api/v1/analytics/user-activity', true)
        ]);
        
        const newChartData = {
          viewsData: [],
          postsByCategory: [],
          userActivity: []
        };
        
        if (viewsResponse.status === 'fulfilled' && viewsResponse.value.status === 'success') {
          newChartData.viewsData = viewsResponse.value.data.posts.map(post => ({
            name: post.newsTitle.substring(0, 20) + (post.newsTitle.length > 20 ? '...' : ''),
            views: post.views,
            comments: post.comments,
            likes: post.likes
          }));
        }
        
        if (categoryResponse.status === 'fulfilled' && categoryResponse.value.status === 'success') {
          newChartData.postsByCategory = categoryResponse.value.data.postsByCategory.map(cat => ({
            name: cat._id || 'Uncategorized',
            value: cat.count
          }));
        }
        
        if (userResponse.status === 'fulfilled' && userResponse.value.status === 'success') {
          newChartData.userActivity = userResponse.value.data.userActivity.map(activity => ({
            date: activity._id,
            users: activity.count
          }));
        }
        
        setChartData(newChartData);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Define colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  if (loading) {
    return <div className={styles.loading}>Loading analytics...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error loading analytics: {error}</div>;
  }

  return (
    <div className={styles.analyticsCharts}>
      <h3>Analytics Overview</h3>
      
      <div className={styles.chartGrid}>
        {/* Top Posts by Views */}
        <div className={styles.chartContainer}>
          <h4>Top Posts by Views</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.viewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#8884d8" name="Views" />
              <Bar dataKey="comments" fill="#82ca9d" name="Comments" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Posts by Category */}
        <div className={styles.chartContainer}>
          <h4>Posts by Category</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.postsByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.postsByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* User Registration Trends */}
        <div className={styles.chartContainer}>
          <h4>User Registration Trends (Last 30 Days)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.userActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} name="New Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;