import { useState, useEffect } from "react";
import styles from "./CommentModal.module.css";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";

const CommentModal = ({ postId, postTitle, isOpen, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const { token, user } = useAuth();

  // Fetch comments when modal opens
  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const fetchComments = async () => {
    if (!postId) return;
    
    try {
      setLoadingComments(true);
      const response = await api.get(`/api/v1/blogs/${postId}/comments`, false);
      if (response && response.comments) {
        setComments(response.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !token || !postId) return;

    try {
      setLoading(true);
      
      const response = await api.post(`/api/v1/blogs/${postId}/comment`, {
        text: newComment.trim()
      }, true);

      if (response && response.blog) {
        // Add the new comment to the list
        const newCommentObj = {
          text: newComment.trim(),
          user: user?._id,
          username: user?.name || user?.email || "Anonymous",
          createdAt: new Date().toISOString()
        };
        
        setComments(prev => [newCommentObj, ...prev]);
        setNewComment("");
        
        // Optionally refresh the comments from the server
        await fetchComments();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            Comments for: {postTitle || "Post"}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Comments List */}
        <div className={styles.commentsSection}>
          {loadingComments ? (
            <div className={styles.loadingComments}>
              <div className={styles.spinner}></div>
              <p>Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className={styles.noComments}>
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className={styles.commentsList}>
              {comments.map((comment) => (
                <div key={comment._id || `${comment.createdAt}-${comment.username}`} className={styles.commentItem}>
                  <div className={styles.commentHeader}>
                    <div className={styles.userAvatar}>
                      {comment.username?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                    <div className={styles.userInfo}>
                      <span className={styles.userName}>{comment.username}</span>
                      <span className={styles.commentDate}>{formatDate(comment.createdAt)}</span>
                    </div>
                  </div>
                  <div className={styles.commentText}>
                    {comment.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Comment Form */}
        {!token ? (
          <div className={styles.loginPrompt}>
            <p>Please login to add a comment</p>
          </div>
        ) : (
          <form className={styles.commentForm} onSubmit={handleAddComment}>
            <textarea
              className={styles.commentInput}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here..."
              rows="3"
              disabled={loading}
            />
            <div className={styles.formActions}>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={!newComment.trim() || loading}
              >
                {loading ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CommentModal;