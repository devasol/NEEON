import React from "react";
import styles from "./RecentPosts.module.css";

const RecentPosts = () => {
  const posts = [
    {
      title: "How to get the best deals on flights",
      date: "2025-01-18",
      status: "Published",
    },
    {
      title: "Top 10 Hidden Gems in Southeast Asia",
      date: "2025-01-19",
      status: "Published",
    },
    {
      title: "Traditional Cooking Techniques Making a Comeback",
      date: "2025-01-16",
      status: "Draft",
    },
  ];

  return (
    <section className={styles.recentPosts}>
      <h3>Recent Posts</h3>
      <ul>
        {posts.map((p, i) => (
          <li key={i} className={styles.postItem}>
            <div>
              <div className={styles.postTitle}>{p.title}</div>
              <div className={styles.postMeta}>
                {p.date} • {p.status}
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
