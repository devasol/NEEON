import React, { useState } from "react";
import styles from "./Sidebar.module.css";

// Icons for each section (you can replace with actual icon components)
const DashboardIcon = () => <span>📊</span>;
const PostsIcon = () => <span>📝</span>;
const CommentsIcon = () => <span>💬</span>;
const UsersIcon = () => <span>👥</span>;
const SettingsIcon = () => <span>⚙️</span>;

const Sidebar = ({ selectedView, setSelectedView }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setSelectedItem(item);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    document.body.style.overflow = "unset";
  };

  const handleQuickAction = (action, item) => {
    alert(`Performing ${action} for ${item.label}`);
    // Add your action logic here
  };

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

      {/* Section Detail Modal */}
      {isModalOpen && selectedItem && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              ×
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalIcon}>{selectedItem.icon}</div>
              <div className={styles.modalTitle}>
                <h2>{selectedItem.label}</h2>
                <p className={styles.modalDescription}>
                  {selectedItem.description}
                </p>
              </div>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.sectionStats}>
                <span className={styles.statsLabel}>Current Status</span>
                <span className={styles.statsValue}>{selectedItem.stats}</span>
              </div>

              <div className={styles.sectionDetails}>
                <h3>About this Section</h3>
                <p>{selectedItem.details}</p>
              </div>

              <div className={styles.quickActions}>
                <h3>Quick Actions</h3>
                <div className={styles.actionButtons}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => handleQuickAction("view", selectedItem)}
                  >
                    View All
                  </button>
                  <button
                    className={styles.actionBtn}
                    onClick={() => handleQuickAction("create", selectedItem)}
                  >
                    Create New
                  </button>
                  <button
                    className={styles.actionBtn}
                    onClick={() => handleQuickAction("manage", selectedItem)}
                  >
                    Manage
                  </button>
                </div>
              </div>

              <div className={styles.recentActivity}>
                <h3>Recent Activity</h3>
                <div className={styles.activityList}>
                  <div className={styles.activityItem}>
                    <span className={styles.activityTime}>2 hours ago</span>
                    <span className={styles.activityText}>
                      New user registered
                    </span>
                  </div>
                  <div className={styles.activityItem}>
                    <span className={styles.activityTime}>5 hours ago</span>
                    <span className={styles.activityText}>
                      Post published successfully
                    </span>
                  </div>
                  <div className={styles.activityItem}>
                    <span className={styles.activityTime}>Yesterday</span>
                    <span className={styles.activityText}>
                      Settings updated
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.primaryBtn}
                onClick={() => setSelectedView(selectedItem.id)}
              >
                Open {selectedItem.label}
              </button>
              <button className={styles.secondaryBtn} onClick={closeModal}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
