import React, { useState, useEffect, useRef } from "react";
import styles from "./Header.module.css";

// Icons (you can replace with actual icon components)
const SearchIcon = () => <span>🔍</span>;
const BellIcon = () => <span>🔔</span>;
const PlusIcon = () => <span>+</span>;
const UserIcon = () => <span>👤</span>;
const DownArrow = () => <span>⌄</span>;

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "comment",
      message: "New comment on your post",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      type: "user",
      message: "New user registered",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "post",
      message: "Post published successfully",
      time: "3 hours ago",
      read: true,
    },
  ]);

  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleNewPost = () => {
    // Dispatch a global event so PostsView (or others) can open the new post modal
    try {
      window.dispatchEvent(new CustomEvent("open-new-post"));
    } catch {
      // fallback for older browsers
      alert("Creating new post...");
    }
  };

  const searchSuggestions = [
    "Popular posts",
    "User management",
    "Recent comments",
    "Analytics dashboard",
    "Settings configuration",
  ];

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className={styles.title}>
          <span className={styles.titleMain}>Dashboard</span>
          <span className={styles.titleSub}>Welcome back, Admin! 👋</span>
        </h1>
      </div>

      <div className={styles.headerRight}>
        {/* Search Bar with Suggestions */}
        <div className={styles.searchContainer}>
          <div
            className={`${styles.searchWrapper} ${
              isSearchFocused ? styles.focused : ""
            }`}
          >
            <SearchIcon />
            <input
              ref={searchRef}
              className={styles.search}
              placeholder="Search posts, users, comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />
            {searchQuery && (
              <button
                className={styles.clearSearch}
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          {/* Search Suggestions */}
          {isSearchFocused && (
            <div className={styles.searchSuggestions}>
              {searchSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={styles.suggestionItem}
                  onClick={() => setSearchQuery(suggestion)}
                >
                  <SearchIcon />
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className={styles.notificationsContainer} ref={notificationsRef}>
          <button
            className={`${styles.iconBtn} ${styles.notificationsBtn} ${
              unreadNotifications > 0 ? styles.hasNotifications : ""
            }`}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <BellIcon />
            {unreadNotifications > 0 && (
              <span className={styles.notificationBadge}>
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className={styles.notificationsDropdown}>
              <div className={styles.notificationsHeader}>
                <h3>Notifications</h3>
                <span className={styles.notificationsCount}>
                  {unreadNotifications} unread
                </span>
              </div>

              <div className={styles.notificationsList}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`${styles.notificationItem} ${
                      notification.read ? styles.read : ""
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className={styles.notificationDot}></div>
                    <div className={styles.notificationContent}>
                      <p className={styles.notificationMessage}>
                        {notification.message}
                      </p>
                      <span className={styles.notificationTime}>
                        {notification.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.notificationsFooter}>
                <button className={styles.viewAllBtn}>
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* New Post Button */}
        <button className={styles.actionBtn} onClick={handleNewPost}>
          <PlusIcon />
          New Post
        </button>

        {/* User Menu */}
        <div className={styles.userMenuContainer} ref={userMenuRef}>
          <button
            className={styles.userBtn}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className={styles.userAvatar}>
              <UserIcon />
            </div>
            <span className={styles.userName}>Admin</span>
            <DownArrow />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className={styles.userDropdown}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatarLarge}>
                  <UserIcon />
                </div>
                <div>
                  <h4>Administrator</h4>
                  <span>admin@blog.com</span>
                </div>
              </div>

              <div className={styles.userMenuItems}>
                <button className={styles.menuItem}>
                  <span>👤</span> Profile
                </button>
                <button className={styles.menuItem}>
                  <span>⚙️</span> Settings
                </button>
                <button className={styles.menuItem}>
                  <span>🔒</span> Privacy
                </button>
                <div className={styles.menuDivider}></div>
                <button className={styles.menuItem}>
                  <span>🚪</span> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
