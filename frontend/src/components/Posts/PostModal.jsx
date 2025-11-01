import React from 'react';
import styles from './PostModal.module.css';

const PostModal = ({ post, isOpen, onClose }) => {
  if (!isOpen || !post) return null;

  const handleClose = () => {
    onClose();
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const calculateReadTime = (description) => {
    if (!description) return "5 min read";
    
    const wordsPerMinute = 200;
    const wordCount = description.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.postImage}>
            <img 
              src={post.staticImage} 
              alt={post.newsTitle} 
              style={{ 
                width: '100%', 
                height: '300px', 
                objectFit: 'cover',
                borderRadius: '10px'
              }}
            />
          </div>
          <div className={styles.postHeader}>
            <div className={styles.postMeta}>
              <span className={styles.category}>{post.category}</span>
              <span className={styles.dot}>•</span>
              <span className={styles.date}>
                {formatDate(post.datePosted || post.createdAt)}
              </span>
            </div>
            <h1 className={styles.postTitle}>
              {post.newsTitle || post.title || "Untitled Post"}
            </h1>
          </div>
          <div className={styles.postContent}>
            <div className={styles.authorInfo}>
              <span className={styles.author}>
                By {post.postedBy || "Unknown Author"}
              </span>
              <span className={styles.readTime}>
                {calculateReadTime(post.newsDescription)}
              </span>
            </div>
            <div className={styles.fullDescription}>
              <p>{post.newsDescription || post.description || "No description available"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;