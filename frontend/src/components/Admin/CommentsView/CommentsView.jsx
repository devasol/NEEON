import React, { useState, useEffect } from "react";
import styles from "./CommentsView.module.css";
import api from "../../../utils/api";

const CommentsView = () => {
  const [selectedComment, setSelectedComment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch comments from the backend
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        console.log("Fetching comments from API...");
        const response = await api.get("/api/v1/blogs/all-comments", true); // true to include auth token
        console.log("API response:", response);
        if (response && response.status === "success" && response.comments !== undefined) {
          // Transform the data to match the format expected by the component
          const transformedComments = Array.isArray(response.comments) ? response.comments.map((comment, index) => ({
            id: index + 1, // Use index as ID for frontend purposes
            _id: comment._id, // Keep the original MongoDB _id for API operations
            text: comment.text || "No comment text",
            excerpt: comment.text?.substring(0, 30) + (comment.text?.length > 30 ? "..." : "") || "No comment text",
            post: comment.post || "Unknown Post",
            fullComment: comment.text || "No comment text",
            username: comment.username || "Anonymous User",
            author: comment.username || "Anonymous User",
            email: "", // Backend doesn't provide email in this response
            date: new Date(comment.createdAt).toLocaleString() || "Unknown Date",
            status: "Pending", // Backend doesn't provide status, defaulting to Pending
            avatar: "https://via.placeholder.com/50", // Default avatar since we don't have user avatars in the backend response
            postId: comment.postId || null
          })) : [];
          setComments(transformedComments);
          console.log("Transformed comments:", transformedComments);
        } else {
          setError(response?.message || "Failed to load comments - invalid response format");
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
        console.error("Error details:", err.message, err.stack);
        setError(`Failed to load comments: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

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

  // Update handleApprove to work with backend
  const handleApprove = async (commentId, e) => {
    e.stopPropagation();
    // Get the actual comment object by its id
    const comment = comments.find(c => c.id === commentId);
    if (!comment || !comment.postId || !comment._id) return;

    try {
      // In a real implementation, you might have a separate approval system
      // For now, just update the status locally and show confirmation
      setComments(prevComments => prevComments.map(c => 
        c.id === commentId ? { ...c, status: "Approved" } : c
      ));
      
      // Show success toast
      const successEvent = new CustomEvent("showToast", {
        detail: { message: `Comment on "${comment.post}" approved!`, type: "success" },
      });
      window.dispatchEvent(successEvent);
    } catch (error) {
      console.error("Error approving comment:", error);
      // Show error toast
      const errorEvent = new CustomEvent("showToast", {
        detail: { message: "Failed to approve comment", type: "error" },
      });
      window.dispatchEvent(errorEvent);
    }
  };

  // Update handleDelete to work with backend
  const handleDelete = async (commentId, e) => {
    e.stopPropagation();
    const comment = comments.find(c => c.id === commentId);
    if (!comment || !comment.postId || !comment._id) return;
    
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      // Delete the comment using the stored MongoDB _id
      await api.delete(`/api/v1/blogs/${comment.postId}/comments/${comment._id}`, true);
      
      // Update local state to remove the comment
      setComments(prevComments => prevComments.filter(c => c.id !== commentId));
      
      // Show success toast
      const successEvent = new CustomEvent("showToast", {
        detail: { message: `Comment on "${comment.post}" deleted!`, type: "success" },
      });
      window.dispatchEvent(successEvent);
    } catch (error) {
      console.error("Error deleting comment:", error);
      // Show error toast
      const errorEvent = new CustomEvent("showToast", {
        detail: { message: "Failed to delete comment", type: "error" },
      });
      window.dispatchEvent(errorEvent);
    }
  };

  const handleStatusChange = (commentId, newStatus, e) => {
    e.stopPropagation();
    setComments(prevComments => prevComments.map(c => 
      c.id === commentId ? { ...c, status: newStatus } : c
    ));
    
    // Show status change toast
    const statusChangeEvent = new CustomEvent("showToast", {
      detail: { message: `Comment status changed to ${newStatus}`, type: "info" },
    });
    window.dispatchEvent(statusChangeEvent);
  };

  if (loading) {
    return (
      <section className={styles.commentsView}>
        <h2>Comments Management</h2>
        <div className={styles.loading}>Loading comments...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.commentsView}>
        <h2>Comments Management</h2>
        <div className={styles.error}>Error: {error}</div>
      </section>
    );
  }

  return (
    <section className={styles.commentsView}>
      <h2>Comments Management</h2>
      <div className={styles.tableCard}>
        <div className={styles.commentsHeader}>
          <span>Comment Details</span>
          <span>Actions</span>
        </div>
        <ul className={styles.commentsList}>
          {comments.length > 0 ? (
            comments.map((comment) => (
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
            ))
          ) : (
            <li className={styles.noComments}>
              <p>No comments found. Comments will appear here once users start commenting on blog posts.</p>
            </li>
          )}
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
