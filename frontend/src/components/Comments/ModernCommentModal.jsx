import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./ModernCommentModal.module.css";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";


const CommentIcon = () => (
  <svg className={styles.inputIcon} viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ModernCommentModal = ({ postId, postTitle, isOpen, onClose, onCommentAdded = null }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [likedComments, setLikedComments] = useState(new Set());
  const [animate, setAnimate] = useState(false);
  const commentsEndRef = useRef(null);
  const { token, user } = useAuth();

  // Fetch comments when modal opens
  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
      // Trigger animation when modal opens
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [isOpen, postId]);

  // Scroll to bottom when new comments are added
  useEffect(() => {
    if (comments.length > 0 && userInteracted) {
      scrollToBottom();
    }
  }, [comments, userInteracted]);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
        
        const newCommentObj = {
          text: newComment.trim(),
          user: user?._id,
          username: user?.name || user?.email || "Anonymous",
          createdAt: new Date().toISOString()
        };
        
        setComments(prev => [newCommentObj, ...prev]);
        setNewComment("");
        setUserInteracted(true);
        
        // Optionally refresh the comments from the server
        await fetchComments();
        
        // Notify parent component that a comment was added
        if (onCommentAdded) {
          onCommentAdded();
        }
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays < 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleLikeComment = async (commentId) => {
    if (!token) {
      
      return;
    }

    
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });

    try {
      
      
    } catch (error) {
      console.error("Error liking comment:", error);
      
      setLikedComments(prev => {
        const newSet = new Set(prev);
        if (newSet.has(commentId)) {
          newSet.delete(commentId);
        } else {
          newSet.add(commentId);
        }
        return newSet;
      });
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} ${animate ? styles.animate : ''}`} onClick={(e) => e.stopPropagation()}>
        {}
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
          <div className={styles.headerContent}>
            <h2 className={styles.modalTitle}>
              Comments for: {postTitle || "Post"}
            </h2>
            <p className={styles.commentsCount}>
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </p>
          </div>
        </div>

        {}
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
              {comments.map((comment, index) => (
                <div 
                  key={comment._id || `${comment.createdAt}-${comment.username}-${index}`} 
                  className={`${styles.commentItem} ${styles.fadeInUp}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
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
                  <div className={styles.commentActions}>
                    <button 
                      className={`${styles.likeButton} ${likedComments.has(comment._id) ? styles.liked : ''}`}
                      onClick={() => comment._id && handleLikeComment(comment._id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={likedComments.has(comment._id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      Like
                    </button>
                  </div>
                </div>
              ))}
              <div ref={commentsEndRef} />
            </div>
          )}
        </div>

        {}
        {!token ? (
          <div className={styles.loginPrompt}>
            <p>Please <a href="/login">login</a> to add a comment</p>
          </div>
        ) : (
          <form className={styles.commentForm} onSubmit={handleAddComment}>
            <div className={styles.formContent}>
              <div className={styles.inputContainer}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <textarea
                  className={styles.commentInput}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment here..."
                  rows="3"
                  disabled={loading}
                  autoFocus
                />
              </div>
              <div className={styles.formActions}>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={!newComment.trim() || loading}
                >
                  {loading ? (
                    <>
                      <div className={styles.btnSpinner}></div>
                      Posting...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                      Post Comment
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ModernCommentModal;