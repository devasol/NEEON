import React, { useState, useEffect } from "react";
import styles from "./UsersTable.module.css";

const UsersTable = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      role: "Editor",
      status: "active",
    },
    {
      id: 2,
      name: "Bob",
      email: "bob@example.com",
      role: "Author",
      status: "active",
    },
    {
      id: 3,
      name: "Charlie",
      email: "charlie@example.com",
      role: "Subscriber",
      status: "inactive",
    },
    {
      id: 4,
      name: "Diana",
      email: "diana@example.com",
      role: "Admin",
      status: "active",
    },
    {
      id: 5,
      name: "Ethan",
      email: "ethan@example.com",
      role: "Subscriber",
      status: "pending",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort users
  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => filterRole === "all" || user.role === filterRole)
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleRemoveUser = (userId) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setTimeout(() => setSelectedUser(null), 3000); // Auto-close after 3 seconds
  };

  const getRoleColor = (role) => {
    const colors = {
      Admin: "#ef4444",
      Editor: "#3b82f6",
      Author: "#8b5cf6",
      Subscriber: "#10b981",
    };
    return colors[role] || "#6b7280";
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: "Active", color: "#10b981" },
      inactive: { label: "Inactive", color: "#6b7280" },
      pending: { label: "Pending", color: "#f59e0b" },
    };
    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span
        className={styles.statusBadge}
        style={{ backgroundColor: `${config.color}15`, color: config.color }}
      >
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <section className={styles.usersTable}>
        <div className={styles.skeletonLoader}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.skeletonRow}></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.usersTable}>
      <div className={styles.tableHeader}>
        <h3>User Management</h3>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className={styles.roleFilter}
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Author">Author</option>
            <option value="Subscriber">Subscriber</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th
                onClick={() => handleSort("name")}
                className={styles.sortable}
              >
                Name{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("email")}
                className={styles.sortable}
              >
                Email{" "}
                {sortConfig.key === "email" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("role")}
                className={styles.sortable}
              >
                Role{" "}
                {sortConfig.key === "role" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className={`${styles.tableRow} ${
                  selectedUser?.id === user.id ? styles.selected : ""
                }`}
              >
                <td>
                  <div className={styles.userInfo}>
                    <div
                      className={styles.avatar}
                      style={{ backgroundColor: getRoleColor(user.role) }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    {user.name}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={styles.roleBadge}
                    style={{
                      backgroundColor: `${getRoleColor(user.role)}15`,
                      color: getRoleColor(user.role),
                    }}
                  >
                    {user.role}
                  </span>
                </td>
                <td>{getStatusBadge(user.status)}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={`${styles.smallBtn} ${styles.viewBtn}`}
                      onClick={() => handleViewUser(user)}
                    >
                      👁️ View
                    </button>
                    <button
                      className={`${styles.smallBtn} ${styles.removeBtn}`}
                      onClick={() => handleRemoveUser(user.id)}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👥</div>
            <p>No users found</p>
            <small>Try adjusting your search or filters</small>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedUser(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setSelectedUser(null)}
            >
              ×
            </button>
            <h4>User Details</h4>
            <div className={styles.modalContent}>
              <div className={styles.userAvatar}>
                <div
                  className={styles.largeAvatar}
                  style={{ backgroundColor: getRoleColor(selectedUser.role) }}
                >
                  {selectedUser.name.charAt(0)}
                </div>
              </div>
              <div className={styles.userDetails}>
                <p>
                  <strong>Name:</strong> {selectedUser.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Role:</strong> {selectedUser.role}
                </p>
                <p>
                  <strong>Status:</strong> {getStatusBadge(selectedUser.status)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UsersTable;
