import React from "react";
import styles from "./UsersTable.module.css";

const UsersTable = () => {
  const users = [
    { name: "Alice", email: "alice@example.com", role: "Editor" },
    { name: "Bob", email: "bob@example.com", role: "Author" },
    { name: "Charlie", email: "charlie@example.com", role: "Subscriber" },
  ];

  return (
    <section className={styles.usersTable}>
      <h3>Recent Users</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button className={styles.smallBtn}>View</button>
                <button className={styles.smallBtn}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default UsersTable;
