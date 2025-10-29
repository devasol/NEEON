import React from "react";
import styles from "./RecentPosts.module.css";

const RecentPosts = ({ data }) => {
  // If data is provided, use it; otherwise use fallback data
  const posts = data && data.length > 0 ? data : [
    {
      newsTitle: "How to get the best deals on flights",
      createdAt: "2025-01-18T10:00:00.000Z",
      status: "Published",
    },
    {
      newsTitle: "Top 10 Hidden Gems in Southeast Asia",
      createdAt: "2025-01-19T14:30:00.000Z",
      status: "Published",
    },
    {
      newsTitle: "Traditional Cooking Techniques Making a Comeback",
      createdAt: "2025-01-16T09:15:00.000Z",
      status: "Draft",
    },
  ];

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <section className={styles.recentPosts}>
      <h3>Recent Posts</h3>
      <ul>
        {posts.map((p, i) => (
          <li key={i} className={styles.postItem}>
            <div>
              <div className={styles.postTitle}>{p.newsTitle || p.title}</div>
              <div className={styles.postMeta}>
                {formatDate(p.createdAt || p.date)} • {p.status || p.status}
              </div>
            </div>
            <div className={styles.postActions}>
              <button className={styles.smallBtn}>Edit</button>
              <button className={styles.smallBtn}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RecentPosts;
