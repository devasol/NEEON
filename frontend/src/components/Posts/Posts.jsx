import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Posts.module.css";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [showingLimited, setShowingLimited] = useState(false);
  const [limit, setLimit] = useState(12); // Default limit
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [totalPosts, setTotalPosts] = useState(0); // Total number of posts
  const sectionRef = useRef(null);
  const { token } = useAuth();
  const navigate = useNavigate();
  
  // Function to trigger login modal
  const triggerLogin = () => {
    // Try to trigger the login modal by dispatching a custom event
    const loginEvent = new CustomEvent('triggerLoginModal', { bubbles: true, cancelable: true });
    document.dispatchEvent(loginEvent);
  };

  // State to hold all posts for pagination
  const [allPosts, setAllPosts] = useState([]);
  const [postInteractions, setPostInteractions] = useState({}); // Store likes, comments, etc. for each post
  const [commentInputs, setCommentInputs] = useState({}); // Store comment input values for each post
  const [showComments, setShowComments] = useState({}); // Track which post's comments are visible
  const [postComments, setPostComments] = useState({}); // Store comments for each post
  const [showLoginModal, setShowLoginModal] = useState(false); // For login modal when non-logged in users try to interact

  // Update posts when pagination changes for logged-in users
  useEffect(() => {
    if (token && allPosts.length > 0) {
      const startIndex = (currentPage - 1) * limit;
      const endIndex = startIndex + limit;
      setPosts(allPosts.slice(startIndex, endIndex));
    }
  }, [currentPage, token, allPosts, limit]);

  // Initialize post interactions when posts change
  useEffect(() => {
    const initialInteractions = {};
    const initialCommentInputs = {};
    const initialShowComments = {};
    const initialPostComments = {};

    posts.forEach(post => {
      initialInteractions[post._id] = {
        liked: post.likedBy?.includes(token) || false, // Assuming token is user ID
        likes: post.likes || 0,
        comments: post.comments || 0,
      };
      initialCommentInputs[post._id] = '';
      initialShowComments[post._id] = false;
      initialPostComments[post._id] = [];
    });

    setPostInteractions(initialInteractions);
    setCommentInputs(initialCommentInputs);
    setShowComments(initialShowComments);
    setPostComments(initialPostComments);
  }, [posts]);

  // Reset current page when authentication status changes
  useEffect(() => {
    setCurrentPage(1);
  }, [token]);

  // Show login modal when non-logged in users try to interact
  const showLoginPrompt = () => {
    setShowLoginModal(true);
  };

  // Close login modal
  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  // Like a post
  const handleLike = async (postId) => {
    if (!token) {
      showLoginPrompt();
      return;
    }

    try {
      const response = await api.post(`/api/v1/blogs/${postId}/like`, {}, true);
      if (response && response.liked !== undefined) {
        setPostInteractions(prev => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            liked: response.liked,
            likes: response.liked ? prev[postId].likes + 1 : prev[postId].likes - 1
          }
        }));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Handle comment input change
  const handleCommentChange = (postId, value) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  // Submit a comment
  const submitComment = async (postId) => {
    if (!token) {
      showLoginPrompt();
      return;
    }

    const commentText = commentInputs[postId];
    if (!commentText.trim()) return;

    try {
      const response = await api.post(`/api/v1/blogs/${postId}/comment`, {
        text: commentText
      }, true);

      if (response && response.blog) {
        // Update comment count in interactions
        setPostInteractions(prev => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            comments: prev[postId].comments + 1
          }
        }));

        // Update the comment input
        setCommentInputs(prev => ({
          ...prev,
          [postId]: ''
        }));

        // Refresh comments for this post
        fetchPostComments(postId);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Fetch comments for a post
  const fetchPostComments = async (postId) => {
    try {
      const response = await api.get(`/api/v1/blogs/${postId}/comments`, false);
      if (response && response.comments) {
        setPostComments(prev => ({
          ...prev,
          [postId]: response.comments
        }));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Toggle comments visibility
  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));

    // Fetch comments if not already fetched and comments area is being shown
    if (!showComments[postId]) {
      fetchPostComments(postId);
    }
  };

  // Share functionality
  const handleShare = (postId, postTitle) => {
    if (navigator.share) {
      // Web Share API is supported
      navigator.share({
        title: postTitle,
        text: `Check out this post: ${postTitle}`,
        url: window.location.origin + `/posts#${postId}`
      }).catch(console.error);
    } else {
      // Fallback: copy link to clipboard
      const postUrl = `${window.location.origin}/posts#${postId}`;
      navigator.clipboard.writeText(postUrl)
        .then(() => {
          alert('Post link copied to clipboard!');
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        let endpoint = `/api/v1/blogs/public`;
        if (token) {
          endpoint = `/api/v1/blogs`;
        }
        
        // For non-logged-in users, fetch only 3 posts
        // For logged-in users, fetch all posts for pagination
        const params = new URLSearchParams();
        if (!token) {
          params.append('limit', '3');
        } else {
          // For logged-in users, don't specify a limit to get all posts
          // Note: This might need a backend update for actual pagination
          // For now, we'll fetch with a high limit and handle pagination in frontend
          params.append('limit', '100'); // Fetch more than we'll likely have
        }
        
        const url = params.toString() ? `${endpoint}?${params}` : endpoint;
        
        const response = await api.get(url, !!token);
        
        if (response && response.blogs && response.blogs.allBlogs) {
          // Define static images from the public postsImg folder
          const staticImages = [
            "/postsImg/photo-1421789665209-c9b2a435e3dc.avif",
            "/postsImg/photo-1445307806294-bff7f67ff225.avif",
            "/postsImg/photo-1445633743309-b60418bedbf2.avif",
            "/postsImg/photo-1470071459604-3b5ec3a7fe05.avif",
            "/postsImg/photo-1474511320723-9a56873867b5.avif",
            "/postsImg/photo-1486312338219-ce68d2c6f44d.avif",
            "/postsImg/photo-1497206365907-f5e630693df0.avif",
            "/postsImg/photo-1500622944204-b135684e99fd.avif",
            "/postsImg/photo-1506744038136-46273834b3fb.avif",
            "/postsImg/photo-1518770660439-4636190af475.avif",
            "/postsImg/photo-1528154291023-a6525fabe5b4.avif",
            "/postsImg/photo-1529333166437-7750a6dd5a70.avif",
            "/postsImg/photo-1572705824045-3dd0c9a47945.avif",
            "/postsImg/photo-1649972904349-6e44c42644a7.avif"
          ];
          
          if (!token) {
            // Non-logged-in user: just set the posts directly
            // Add imageIndex to each post for static image selection
            const postsWithImages = response.blogs.allBlogs.map((post, index) => ({
              ...post,
              staticImage: staticImages[index % staticImages.length]
            }));
            setPosts(postsWithImages);
            setShowingLimited(true);
          } else {
            // Logged-in user: store all posts and set the first page
            // Add imageIndex to each post for static image selection
            const allPostsWithImages = response.blogs.allBlogs.map((post, index) => ({
              ...post,
              staticImage: staticImages[index % staticImages.length]
            }));
            setAllPosts(allPostsWithImages);
            setTotalPosts(allPostsWithImages.length);
            const postsWithImages = allPostsWithImages.slice(0, limit); // Default first page
            setPosts(postsWithImages);
            setShowingLimited(false); // Logged-in users see full content
          }
        } else {
          setPosts([]);
          setAllPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Fallback to empty array
        setPosts([]);
        setAllPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          console.log("Section is now visible");
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
    // Average reading speed is about 200 words per minute
    const wordsPerMinute = 200;
    const wordCount = description.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  console.log("Rendering - loading:", loading, "posts count:", posts.length);

  // Debug: Check if styles are loading
  console.log("Styles object:", styles);

  if (loading) {
    return (
      <section className={styles.posts} ref={sectionRef}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Latest Posts</h1>
            <p className={styles.subtitle}>
              Discover amazing content curated just for you
            </p>
          </div>
          <div className={styles.loadingGrid}>
            {[...Array(6)].map((_, index) => (
              <div key={index} className={`${styles.loadingCard} ${styles.shimmer}`}>
                <div className={`${styles.loadingImage} ${styles.shimmer}`}></div>
                <div className={styles.loadingContent}>
                  <div className={`${styles.loadingTitle} ${styles.shimmer}`}></div>
                  <div className={`${styles.loadingExcerpt} ${styles.shimmer}`}></div>
                  <div className={`${styles.loadingMeta} ${styles.shimmer}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className={styles.posts}>
      <div className={`${styles.container} ${isVisible ? styles.visible : ""}`}>
        {/* Login Modal for non-logged in users */}
        {showLoginModal && (
          <div className={styles.loginModalOverlay}>
            <div className={styles.loginModal}>
              <div className={styles.loginModalHeader}>
                <h3>Login Required</h3>
                <button className={styles.closeButton} onClick={closeLoginModal}>×</button>
              </div>
              <div className={styles.loginModalBody}>
                <p>You need to be logged in to like or comment on posts.</p>
              </div>
              <div className={styles.loginModalFooter}>
                <button 
                  className={styles.loginModalBtn}
                  onClick={() => {
                    // Trigger the login modal using the custom event system
                    const loginEvent = new CustomEvent('openLoginModal');
                    document.dispatchEvent(loginEvent);
                    closeLoginModal(); // Close this modal after opening the login modal
                  }}
                >
                  Login
                </button>
                <button 
                  className={styles.cancelModalBtn}
                  onClick={closeLoginModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <div className={styles.header}>
          <h1 className={styles.title}>Latest Posts</h1>
          <p className={styles.subtitle}>
            Discover amazing content curated just for you
          </p>
        </div>

        {posts.length === 0 ? (
          <div className={styles.noPosts}>
            <h3>No posts available</h3>
            <p>Check back later for new content!</p>
          </div>
        ) : (
          <>
            <div className={styles.postsGrid}>
              {posts.map((post, index) => {
                const interactions = postInteractions[post._id] || { 
                  liked: false, 
                  likes: post.likes || 0, 
                  comments: post.comments || 0 
                };
                const commentsVisible = showComments[post._id] || false;
                const comments = postComments[post._id] || [];
                const commentText = commentInputs[post._id] || '';

                return (
                <article
                  key={post._id}
                  className={`${styles.postCard} ${
                    post.views > 150 ? styles.featured : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {post.views > 150 && (
                    <div className={styles.featuredBadge}>Popular</div>
                  )}

                  <div className={styles.postImage}>
                    <div className={styles.imageSkeleton}>
                      <div className={styles.skeletonLoader}></div>
                    </div>
                    <img 
                      src={post.staticImage} // Use static image from postsImg folder
                      alt={post.newsTitle} 
                      onLoad={(e) => {
                        // Hide skeleton when image loads successfully
                        const skeleton = e.target.previousElementSibling;
                        if (skeleton) skeleton.style.opacity = '0';
                        
                        e.target.style.objectFit = 'cover';
                        e.target.style.opacity = '1';
                      }}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'block',
                        opacity: '0',
                        transition: 'opacity 0.3s ease-in-out',
                        position: 'relative',
                        zIndex: 2
                      }}
                    />
                  </div>

                  <div className={styles.postContent}>
                    <div className={styles.postMeta}>
                      <span className={styles.category}>{post.category}</span>
                      <span className={styles.dot}>•</span>
                      <span className={styles.date}>
                        {formatDate(post.datePosted || post.createdAt)}
                      </span>
                    </div>

                    <h2 className={styles.postTitle}>
                      {post.newsTitle || post.title || "Untitled Post"}
                    </h2>
                    <p className={styles.postExcerpt}>
                      {post.newsDescription ||
                        post.excerpt ||
                        "No description available"}
                    </p>

                    <div className={styles.postFooter}>
                      <div className={styles.authorInfo}>
                        <span className={styles.author}>
                          By {post.postedBy || "Unknown Author"}
                        </span>
                      </div>
                      <div className={styles.readTime}>
                        {calculateReadTime(post.newsDescription) || "5 min read"}
                      </div>
                    </div>

                    {/* Post Interaction Buttons - Likes, Comments, Shares */}
                    <div className={styles.postInteractions}>
                      <button 
                        className={`${styles.interactionButton} ${interactions.liked ? styles.liked : ''}`}
                        onClick={() => handleLike(post._id)}
                        title={interactions.liked ? "Unlike" : "Like"}
                      >
                        {interactions.liked ? '❤️' : '🤍'} 
                        <span>{interactions.likes}</span>
                      </button>
                      <button 
                        className={styles.interactionButton}
                        onClick={() => toggleComments(post._id)}
                        title="Comment"
                      >
                        💬 <span>{interactions.comments}</span>
                      </button>
                      <button 
                        className={styles.interactionButton}
                        onClick={() => handleShare(post._id, post.newsTitle)}
                        title="Share"
                      >
                        📤
                      </button>
                    </div>

                    {/* Comment Input and Display */}
                    {commentsVisible && (
                      <div className={styles.commentsSection}>
                        <div className={styles.commentInputArea}>
                          <input
                            type="text"
                            value={commentText}
                            onChange={(e) => handleCommentChange(post._id, e.target.value)}
                            placeholder="Add a comment..."
                            className={styles.commentInput}
                          />
                          <button 
                            onClick={() => submitComment(post._id)}
                            className={styles.commentSubmitBtn}
                            disabled={!commentText.trim()}
                          >
                            Post
                          </button>
                        </div>

                        {/* Display comments */}
                        {comments.length > 0 && (
                          <div className={styles.commentsList}>
                            {comments.map((comment, commentIndex) => (
                              <div key={commentIndex} className={styles.commentItem}>
                                <div className={styles.commentAuthor}>
                                  {comment.username || comment.user?.username || 'Anonymous'}
                                </div>
                                <div className={styles.commentText}>{comment.text}</div>
                                <div className={styles.commentDate}>
                                  {formatDate(comment.createdAt || comment.date)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className={styles.postHover}></div>
                </article>
                )
              })}
            </div>

            {!token && posts.length > 0 && (
              <div className={styles.loginPrompt}>
                <div className={styles.loginPromptContent}>
                  <h3>🔒 Limited Preview</h3>
                  <p>
                    You're seeing {posts.length} posts. Login to access all
                    posts and get the full experience!
                  </p>
                  <button
                    className={styles.loginButton}
                    onClick={() => {
                      // Navigate to homepage and trigger login modal
                      navigate('/');
                      // Use a timeout to ensure the page has loaded before triggering the event
                      setTimeout(() => {
                        const loginEvent = new CustomEvent('openLoginModal');
                        document.dispatchEvent(loginEvent);
                      }, 100);
                    }}
                  >
                    Login to Continue
                  </button>
                </div>
              </div>
            )}

            {/* Pagination controls for logged-in users */}
            {token && totalPosts > 0 && (
              <div className={styles.pagination}>
                <div className={styles.paginationControls}>
                  <button 
                    className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    ← Prev
                  </button>
                  
                  <div className={styles.pageInfo}>
                    Page {currentPage} of {Math.ceil(totalPosts / limit)}
                  </div>
                  
                  <button 
                    className={`${styles.pageButton} ${currentPage === Math.ceil(totalPosts / limit) ? styles.disabled : ''}`}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalPosts / limit)))}
                    disabled={currentPage === Math.ceil(totalPosts / limit)}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Posts;
