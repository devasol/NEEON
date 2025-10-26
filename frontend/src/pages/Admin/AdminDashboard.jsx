import React from "react";
import styles from "./AdminDashboard.module.css";

// Import your admin components
import CategoriesView from "../../components/Admin/CategoriesView/CategoriesView";
import CommentsView from "../../components/Admin/CommentsView/CommentsView";
import PostsView from "../../components/Admin/PostsView/PostsView";
import SettingsView from "../../components/Admin/SettingsView/SettingsView";
import StatsCard from "../../components/Admin/StatsCard/StatsCard";
import UsersTable from "../../components/Admin/UsersTable/UsersTable";
import RecentPosts from "../../components/Admin/RecentPosts/RecentPosts";

const AdminDashboard = ({ selectedView, setSelectedView }) => {

  const renderView = () => {
    switch (selectedView) {
      case "dashboard":
        return (
          <>
            <div className={styles.statsGrid}>
              <StatsCard
                title="Total Posts"
                value="1,234"
                change="+5%"
                icon="file-alt"
              />
              <StatsCard
                title="Total Comments"
                value="5,678"
                change="+12%"
                icon="comments"
              />
              <StatsCard
                title="Total Users"
                value="345"
                change="+2%"
                icon="users"
              />
              <StatsCard
                title="Total Categories"
                value="12"
                change="+1"
                icon="tag"
              />
            </div>
            <RecentPosts />
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
