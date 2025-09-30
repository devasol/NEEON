import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./UsersTable.module.css";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:9000/api/v1/users")
      .then((res) => {
        setUsers(res.data.users.allUsers);
        // console.log(res.data.users.allUsers);
      })
      .catch((err) => {
        console.log("Error fetching users:", err);
      });
  }, []);

  useEffect(() => {
    // removed stray patch effect
  });

  //   const [users, setUsers] = useState([
  //     {
  //       id: 1,
  //       name: "Alice",
  //       email: "alice@example.com",
  //       role: "Editor",
  //       status: "active",
  //     },
  //     {
  //       id: 2,
  //       name: "Bob",
  //       email: "bob@example.com",
  //       role: "Author",
  //       status: "active",
  //     },
  //     {
  //       id: 3,
  //       name: "Charlie",
  //       email: "charlie@example.com",
  //       role: "Subscriber",
  //       status: "inactive",
  //     },
  //     {
  //       id: 4,
  //       name: "Diana",
  //       email: "diana@example.com",
  //       role: "Admin",
  //       status: "active",
  //     },
  //     {
  //       id: 5,
  //       name: "Ethan",
  //       email: "ethan@example.com",
  //       role: "Subscriber",
  //       status: "pending",
  //     },
  //   ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort users
  const filteredUsers = users
    .filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleRemoveUser = async (userId) => {
    // Optimistic UI: keep current users in case of rollback
    const previous = users;
    setDeletingId(userId);
    try {
      // remove optimistically (match either _id or id)
      console.debug("Attempting to delete userId:", userId);
      setUsers((prev) =>
        prev.filter((user) => (user._id || user.id) !== userId)
      );

      const res = await axios.delete(
        `http://localhost:9000/api/v1/users/${userId}`
      );
      console.debug("Delete response:", res.status, res.data);

      // accept any 2xx response as success
      if (!(res.status >= 200 && res.status < 300)) {
        // rollback on non-OK
        setUsers(previous);
        console.error("Failed to delete user", res.data);
        alert("Failed to delete user");
      }
      setDeletingId(null);
    } catch (err) {
      // rollback and show error
      setUsers(previous);
      console.error("Error deleting user:", err);
      // give clearer message when CORS or network error occurs
      const msg =
        err.response?.data?.message || err.message || "Network or CORS error";
      alert("Error deleting user: " + msg);
      setDeletingId(null);
    }
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
                key={user._id || user.id}
                className={`${styles.tableRow} ${
                  (selectedUser?._id || selectedUser?.id) ===
                  (user._id || user.id)
                    ? styles.selected
                    : ""
                }`}
              >
                <td>
                  <div className={styles.userInfo}>
                    <div
                      className={styles.avatar}
                      style={{ backgroundColor: getRoleColor(user.role) }}
                    >
                      {user.fullName.charAt(0)}
                    </div>
                    {user.fullName}
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
                      onClick={() => {
                        setPendingDelete(user._id || user.id);
                        setConfirmOpen(true);
                      }}
                      disabled={
                        deletingId === (user._id || user.id) || confirmOpen
                      }
                    >
                      {deletingId === (user._id || user.id)
                        ? "Deleting..."
                        : "🗑️ Remove"}
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
                  {(selectedUser.fullName || selectedUser.name || "").charAt(0)}
                </div>
              </div>
              <div className={styles.userDetails}>
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedUser.fullName || selectedUser.name}
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

      {/* Delete Confirmation Modal */}
      {confirmOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setConfirmOpen(false);
            setPendingDelete(null);
          }}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h4>Confirm delete</h4>
            <p>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "flex-end",
                marginTop: "1rem",
              }}
            >
              <button
                className={`${styles.smallBtn} ${styles.viewBtn}`}
                onClick={() => {
                  setConfirmOpen(false);
                  setPendingDelete(null);
                }}
                disabled={deletingId !== null}
              >
                Cancel
              </button>
              <button
                className={`${styles.smallBtn} ${styles.removeBtn}`}
                onClick={() => {
                  setConfirmOpen(false);
                  // call delete handler
                  if (pendingDelete) handleRemoveUser(pendingDelete);
                  setPendingDelete(null);
                }}
                disabled={deletingId !== null}
              >
                {deletingId && deletingId === pendingDelete
                  ? "Deleting..."
                  : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UsersTable;
