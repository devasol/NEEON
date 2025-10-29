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
  
  // Update posts when pagination changes for logged-in users
  useEffect(() => {
    if (token && allPosts.length > 0) {
      const startIndex = (currentPage - 1) * limit;
      const endIndex = startIndex + limit;
      setPosts(allPosts.slice(startIndex, endIndex));
    }
  }, [currentPage, token, allPosts, limit]);

  // Reset current page when authentication status changes
  useEffect(() => {
    setCurrentPage(1);
  }, [token]);

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
        
        const response = await api.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        if (response.data && response.data.blogs && response.data.blogs.allBlogs) {
          if (!token) {
            // Non-logged-in user: just set the posts directly
            setPosts(response.data.blogs.allBlogs);
            setShowingLimited(true);
          } else {
            // Logged-in user: store all posts and set the first page
            setAllPosts(response.data.blogs.allBlogs);
            setTotalPosts(response.data.blogs.allBlogs.length);
            setPosts(response.data.blogs.allBlogs.slice(0, limit)); // Default first page
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
          <div className={styles.loadingGrid}>
            {[...Array(3)].map((_, index) => (
              <div key={index} className={styles.loadingCard}>
                <div className={styles.loadingImage}></div>
                <div className={styles.loadingContent}>
                  <div className={styles.loadingTitle}></div>
                  <div className={styles.loadingExcerpt}></div>
                  <div className={styles.loadingMeta}></div>
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
              {posts.map((post, index) => (
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
                      src={post.imageUrl || `${import.meta.env.VITE_API_BASE || "http://localhost:9000"}/api/v1/blogs/${post._id}/image`} 
                      alt={post.newsTitle} 
                      onError={(e) => {
                        // Hide skeleton and show fallback when image fails to load
                        const skeleton = e.target.previousElementSibling;
                        if (skeleton) skeleton.style.display = 'none';
                        
                        // If it's the API endpoint that failed (not an imageUrl), try to load a placeholder
                        if (!post.imageUrl) {
                          // Try to load a placeholder image based on category
                          const category = post.category?.toLowerCase() || 'general';
                          let placeholderUrl = '';
                          
                          if (category.includes('technology')) {
                            placeholderUrl = 'https://via.placeholder.com/400x200/4a90e2/ffffff?text=Technology';
                          } else if (category.includes('design')) {
                            placeholderUrl = 'https://via.placeholder.com/400x200/e74c3c/ffffff?text=Design';
                          } else {
                            placeholderUrl = 'https://via.placeholder.com/400x200/2ecc71/ffffff?text=Blog+Post';
                          }
                          
                          e.target.src = placeholderUrl;
                          e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                        }
                      }}
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
                  </div>

                  <div className={styles.postHover}></div>
                </article>
              ))}
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
