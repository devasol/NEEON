import React from "react";
import styles from "./Sidebar.module.css";

// Icons for each section (you can replace with actual icon components)
const DashboardIcon = () => <i className="fas fa-chart-pie"></i>;
const PostsIcon = () => <i className="fas fa-file-alt"></i>;
const CommentsIcon = () => <i className="fas fa-comments"></i>;
const UsersIcon = () => <i className="fas fa-users"></i>;
const SettingsIcon = () => <i className="fas fa-cog"></i>;
const CategoriesIcon = () => <i className="fas fa-tag"></i>;

const Sidebar = ({ selectedView, setSelectedView }) => {
  const items = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <DashboardIcon />,
      description: "Overview of your blog's performance and statistics",
      details:
        "Monitor key metrics, recent activity, and quick insights about your blog's performance. Track visitor statistics, popular content, and engagement metrics.",
      stats: "1,234 visitors today • 45 new comments • 12 posts published",
    },
    {
      id: "posts",
      label: "Posts",
      icon: <PostsIcon />,
      description: "Manage and create blog posts",
      details:
        "Create new blog posts, edit existing content, manage categories, and schedule publications. Track post performance and engagement metrics.",
      stats: "156 total posts • 12 drafts • 45 published this month",
    },
    {
      id: "comments",
      label: "Comments",
      icon: <CommentsIcon />,
      description: "Manage user comments and interactions",
      details:
        "Moderate user comments, respond to feedback, and manage comment settings. Filter by status, user, or post to efficiently manage discussions.",
      stats: "23 pending approval • 156 approved • 8 flagged today",
    },
    {
      id: "users",
      label: "Users",
      icon: <UsersIcon />,
      description: "Manage user accounts and permissions",
      details:
        "View and manage user accounts, assign roles and permissions, track user activity, and manage registration settings for your blog community.",
      stats: "2,345 registered users • 12 new today • 45 authors",
    },
    {
      id: "categories",
      label: "Categories",
      icon: <CategoriesIcon />,
      description: "Manage blog categories",
      details:
        "Create, edit, and delete categories for your blog posts. Organize your content and help readers find what they are looking for.",
      stats: "25 total categories • 3 new this week",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <SettingsIcon />,
      description: "Configure blog settings and preferences",
      details:
        "Customize your blog's appearance, configure SEO settings, manage integrations, set up email notifications, and configure security options.",
      stats: "Last updated: Today • Backup: Enabled • SEO: Optimized",
    },
  ];

  const handleItemClick = (item) => {
    setSelectedView(item.id);
  };

  // quick actions removed — sidebar now directly changes views on click

  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>Blog Admin</div>
        <nav className={styles.nav} aria-label="Main">
          {items.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${
                selectedView === item.id ? styles.active : ""
              }`}
              onClick={() => handleItemClick(item)}
              aria-current={selectedView === item.id}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className={styles.footer}>Logged in as Admin</div>
      </aside>

      {/* Removed preview/quick-action modal per user request */}
    </>
  );
};

export default Sidebar;
