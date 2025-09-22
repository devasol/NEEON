import React, { useState } from "react";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Header from "../../components/Admin/Header/Header";
import StatsCard from "../../components/Admin/StatsCard/StatsCard";
import RecentPosts from "../../components/Admin/RecentPosts/RecentPosts";
import UsersTable from "../../components/Admin/UsersTable/UsersTable";
import PostsView from "../../components/Admin/PostsView/PostsView";
import CommentsView from "../../components/Admin/CommentsView/CommentsView";
import SettingsView from "../../components/Admin/SettingsView/SettingsView";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [selectedView, setSelectedView] = useState("dashboard");

  return (
    <div className={styles.page}>
      <Sidebar selectedView={selectedView} setSelectedView={setSelectedView} />
      <div className={styles.main}>
        <Header />

        {selectedView === "dashboard" && (
          <>
            <div className={styles.statsRow}>
              <StatsCard title="Total Posts" value="128" delta="+8%" />
              <StatsCard title="Drafts" value="12" delta="-2%" />
              <StatsCard title="Subscribers" value="9.3K" delta="+4.2%" />
              <StatsCard title="Active Users" value="1.2K" delta="+6%" />
            </div>

            <div className={styles.gridRow}>
              <RecentPosts />
              <UsersTable />
            </div>
          </>
        )}

        {selectedView === "posts" && <PostsView />}
        {selectedView === "comments" && <CommentsView />}
        {selectedView === "users" && <UsersTable />}
        {selectedView === "settings" && <SettingsView />}
      </div>
    </div>
  );
};

export default AdminDashboard;
