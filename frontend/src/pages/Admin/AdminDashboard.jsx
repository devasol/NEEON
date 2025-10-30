import React, { useState, useEffect } from "react";
import styles from "./AdminDashboard.module.css";
import api from "../../utils/api";

// Import your admin components
import CategoriesView from "../../components/Admin/CategoriesView/CategoriesView.jsx";
import CommentsView from "../../components/Admin/CommentsView/CommentsView.jsx";
import PostsView from "../../components/Admin/PostsView/PostsView.jsx";
import SettingsView from "../../components/Admin/SettingsView/SettingsView.jsx";
import StatsCard from "../../components/Admin/StatsCard/StatsCard.jsx";
import UsersTable from "../../components/Admin/UsersTable/UsersTable.jsx";
import RecentPosts from "../../components/Admin/RecentPosts/RecentPosts.jsx";
import AnalyticsCharts from "../../components/Admin/AnalyticsCharts/AnalyticsCharts.jsx";

const AdminDashboard = ({ selectedView, setSelectedView }) => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    totalComments: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalViewCount: 0,
    recentPosts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard statistics from backend
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const statsResponse = await api.get('/api/v1/analytics/dashboard-stats', true);
        const recentResponse = await api.get('/api/v1/analytics/recent-posts', true);
        
        if (statsResponse.status === 'success' && recentResponse.status === 'success') {
          setStats({
            totalPosts: statsResponse.data.totalPosts,
            publishedPosts: statsResponse.data.publishedPosts,
            totalComments: statsResponse.data.totalComments,
            totalUsers: statsResponse.data.totalUsers,
            totalCategories: statsResponse.data.totalCategories,
            totalViewCount: statsResponse.data.totalViewCount,
            recentPosts: recentResponse.data.posts
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedView === 'dashboard') {
      fetchDashboardStats();
    }
  }, [selectedView]);

  const renderView = () => {
    if (selectedView === 'dashboard' && loading) {
      return (
        <div className={styles.content}>
          <div className={styles.statsGrid}>
            {[...Array(4)].map((_, index) => (
              <div key={index} className={`${styles.loadingCard} ${styles.loadingSkeleton}`}>
                <div style={{height: '1.2rem', width: '80px', marginBottom: '0.8rem', borderRadius: '4px'}}></div>
                <div style={{height: '2rem', width: '120px', marginBottom: '0.5rem', borderRadius: '4px'}}></div>
                <div style={{height: '1rem', width: '100px', borderRadius: '4px'}}></div>
              </div>
            ))}
          </div>
          
          <div style={{margin: '2rem 0', padding: '2rem', borderRadius: '16px', background: 'white', height: '400px'}} className={styles.loadingSkeleton}>
            <div style={{height: '1.5rem', width: '200px', marginBottom: '1.5rem', borderRadius: '4px'}} className={styles.loadingSkeleton}></div>
            <div style={{height: '300px'}} className={styles.loadingSkeleton}></div>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem'}}>
            <div style={{padding: '1.5rem', borderRadius: '16px', background: 'white', height: '200px'}} className={styles.loadingSkeleton}>
              <div style={{height: '1.5rem', width: '150px', marginBottom: '1rem', borderRadius: '4px'}} className={styles.loadingSkeleton}></div>
              <div style={{height: '120px'}} className={styles.loadingSkeleton}></div>
            </div>
            <div style={{padding: '1.5rem', borderRadius: '16px', background: 'white', height: '200px'}} className={styles.loadingSkeleton}>
              <div style={{height: '1.5rem', width: '150px', marginBottom: '1rem', borderRadius: '4px'}} className={styles.loadingSkeleton}></div>
              <div style={{height: '120px'}} className={styles.loadingSkeleton}></div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedView === 'dashboard' && error) {
      return <div className={styles.error}>Error: {error}</div>;
    }

    switch (selectedView) {
      case "dashboard":
        return (
          <>
            <div className={styles.statsGrid}>
              <StatsCard
                title="Total Posts"
                value={stats.totalPosts.toLocaleString()}
                change={stats.recentPosts.length > 0 ? `+${stats.recentPosts.length} this month` : ''}
                icon="file-alt"
              />
              <StatsCard
                title="Published Posts"
                value={stats.publishedPosts.toLocaleString()}
                change={stats.publishedPosts > 0 ? `${Math.round((stats.publishedPosts / stats.totalPosts) * 100)}% published` : ''}
                icon="file-alt"
              />
              <StatsCard
                title="Total Comments"
                value={stats.totalComments.toLocaleString()}
                change="+12%"
                icon="comments"
              />
              <StatsCard
                title="Total Users"
                value={stats.totalUsers.toLocaleString()}
                change={stats.recentPosts.length > 0 ? `+${stats.recentPosts.length} new this month` : ''}
                icon="users"
              />
              <StatsCard
                title="Total Views"
                value={stats.totalViewCount.toLocaleString()}
                change="+8%"
                icon="eye"
              />
              <StatsCard
                title="Total Categories"
                value={stats.totalCategories.toLocaleString()}
                change={stats.totalCategories > 0 ? `+${Math.floor(stats.totalCategories / 10)} avg per post` : ''}
                icon="tag"
              />
            </div>
            <RecentPosts data={stats.recentPosts} />
            <AnalyticsCharts />
          </>
        );
      case "posts":
        return <PostsView />;
      case "comments":
        return <CommentsView />;
      case "users":
        return <UsersTable />;
      case "categories":
        return <CategoriesView />;
      case "settings":
        return <SettingsView />;
      default:
        return <div>Select a view</div>;
    }
  };

  return (
    <>
      {renderView()}
    </>
  );
};

export default AdminDashboard;
