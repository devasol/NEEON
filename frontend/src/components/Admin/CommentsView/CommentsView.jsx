import React, { useState } from "react";
import styles from "./CommentsView.module.css";

const CommentsView = () => {
  const [selectedComment, setSelectedComment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const comments = [
    {
      id: 1,
      author: "Alice Johnson",
      excerpt: "Great post!",
      post: "How to get the best deals on flights",
      fullComment:
        "Great post! I've been using these tips for years and they've saved me hundreds of dollars on flights. The section about flexible dates is especially helpful. I'd also recommend checking airline websites directly for flash sales.",
      email: "alice.johnson@email.com",
      date: "March 15, 2025",
      status: "Pending",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 2,
      author: "Bob Smith",
      excerpt: "Nice tips",
      post: "Top 10 Hidden Gems in Southeast Asia",
      fullComment:
        "Nice tips! I've visited 3 of these places and they were absolutely incredible. The local culture and food were amazing. I would add that learning a few basic phrases in the local language goes a long way in these less touristy areas.",
      email: "bob.smith@email.com",
      date: "March 14, 2025",
      status: "Approved",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 3,
      author: "Carol Davis",
      excerpt: "Very informative",
      post: "The Rise of Plant-Based Cuisine in 2025",
      fullComment:
        "Very informative article! As a chef, I can confirm that plant-based cuisine is indeed evolving rapidly. We're seeing more creativity with ingredients like jackfruit, mushrooms, and legumes. The fermentation techniques mentioned are particularly interesting.",
      email: "carol.davis@email.com",
      date: "March 13, 2025",
      status: "Pending",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 4,
      author: "David Wilson",
      excerpt: "Could use more examples",
      post: "Traditional Cooking Techniques Making a Comeback",
      fullComment:
        "The article was good but could use more specific examples of traditional techniques. I've been practicing fermentation at home and would love to see step-by-step guides for some of these methods. Overall, great content though!",
      email: "david.wilson@email.com",
      date: "March 12, 2025",
      status: "Approved",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const handleCommentClick = (comment) => {
    setSelectedComment(comment);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedComment(null);
    document.body.style.overflow = "unset";
  };

  const handleApprove = (commentId, e) => {
    e.stopPropagation();
    alert(`Comment ${commentId} approved!`);
    // Add your approval logic here
  };

  const handleDelete = (commentId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this comment?")) {
      alert(`Comment ${commentId} deleted!`);
      // Add your deletion logic here
    }
  };

  const handleStatusChange = (commentId, newStatus, e) => {
    e.stopPropagation();
    alert(`Comment ${commentId} status changed to ${newStatus}`);
    // Add your status change logic here
  };

  return (
    <section className={styles.commentsView}>
      <h2>Comments Management</h2>
      <div className={styles.tableCard}>
        <div className={styles.commentsHeader}>
          <span>Comment Details</span>
          <span>Actions</span>
        </div>
        <ul className={styles.commentsList}>
          {comments.map((comment) => (
            <li
              key={comment.id}
              className={styles.commentItem}
              onClick={() => handleCommentClick(comment)}
            >
              <div className={styles.commentContent}>
                <div className={styles.commentAuthor}>
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className={styles.avatar}
                  />
                  <div>
                    <strong>{comment.author}</strong>
                    <span className={styles.commentEmail}>{comment.email}</span>
                  </div>
                </div>
                <div className={styles.commentPost}>
                  on <em>"{comment.post}"</em>
                </div>
                <div className={styles.commentText}>{comment.excerpt}</div>
                <div className={styles.commentMeta}>
                  <span className={styles.commentDate}>{comment.date}</span>
                  <span
                    className={`${styles.status} ${
                      styles[comment.status.toLowerCase()]
                    }`}
                  >
                    {comment.status}
                  </span>
                </div>
              </div>
              <div className={styles.commentActions}>
                <button
                  className={`${styles.smallBtn} ${styles.approveBtn}`}
                  onClick={(e) => handleApprove(comment.id, e)}
                >
                  Approve
                </button>
                <button
                  className={`${styles.smallBtn} ${styles.deleteBtn}`}
                  onClick={(e) => handleDelete(comment.id, e)}
                >
                  Delete
                </button>
                <button
                  className={styles.viewMoreBtn}
                  onClick={() => handleCommentClick(comment)}
                >
                  View More
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Comment Detail Modal */}
      {isModalOpen && selectedComment && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              ×
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalAuthor}>
                <img
                  src={selectedComment.avatar}
                  alt={selectedComment.author}
                  className={styles.modalAvatar}
                />
                <div>
                  <h3>{selectedComment.author}</h3>
                  <span className={styles.modalEmail}>
                    {selectedComment.email}
                  </span>
                </div>
              </div>
              <div className={styles.modalStatus}>
                <span
                  className={`${styles.status} ${
                    styles[selectedComment.status.toLowerCase()]
                  }`}
                >
                  {selectedComment.status}
                </span>
              </div>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.modalPost}>
                <strong>Comment on:</strong> "{selectedComment.post}"
              </div>

              <div className={styles.modalDate}>
                <strong>Posted:</strong> {selectedComment.date}
              </div>

              <div className={styles.modalComment}>
                <h4>Full Comment:</h4>
                <p>{selectedComment.fullComment}</p>
              </div>

              <div className={styles.modalActions}>
                <div className={styles.statusActions}>
                  <span>Change Status:</span>
                  <button
                    className={`${styles.statusBtn} ${
                      selectedComment.status === "Pending" ? styles.active : ""
                    }`}
                    onClick={(e) =>
                      handleStatusChange(selectedComment.id, "Pending", e)
                    }
                  >
                    Pending
                  </button>
                  <button
                    className={`${styles.statusBtn} ${
                      selectedComment.status === "Approved" ? styles.active : ""
                    }`}
                    onClick={(e) =>
                      handleStatusChange(selectedComment.id, "Approved", e)
                    }
                  >
                    Approved
                  </button>
                  <button
                    className={`${styles.statusBtn} ${
                      selectedComment.status === "Rejected" ? styles.active : ""
                    }`}
                    onClick={(e) =>
                      handleStatusChange(selectedComment.id, "Rejected", e)
                    }
                  >
                    Rejected
                  </button>
                </div>

                <div className={styles.actionButtons}>
                  <button
                    className={`${styles.modalBtn} ${styles.approveBtn}`}
                    onClick={(e) => handleApprove(selectedComment.id, e)}
                  >
                    Approve
                  </button>
                  <button
                    className={`${styles.modalBtn} ${styles.deleteBtn}`}
                    onClick={(e) => handleDelete(selectedComment.id, e)}
                  >
                    Delete Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CommentsView;
