import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Posts.module.css";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";
import CommentModal from "../Comments/ModernCommentModal";
import PostModal from "./PostModal";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [showingLimited, setShowingLimited] = useState(false);
  const [limit, setLimit] = useState(12); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPosts, setTotalPosts] = useState(0); 
  const sectionRef = useRef(null);
  const { token } = useAuth();
  const navigate = useNavigate();
  
  
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  
  
  const triggerLogin = () => {
    
    const loginEvent = new CustomEvent('triggerLoginModal', { bubbles: true, cancelable: true });
    document.dispatchEvent(loginEvent);
  };

  
  const [allPosts, setAllPosts] = useState([]);
  const [postInteractions, setPostInteractions] = useState({}); 
  const [commentInputs, setCommentInputs] = useState({}); 
  const [showComments, setShowComments] = useState({}); 
  const [postComments, setPostComments] = useState({}); 
  const [showLoginModal, setShowLoginModal] = useState(false); 
  
  const [commentModal, setCommentModal] = useState({ isOpen: false, postId: null, postTitle: null });

  
  useEffect(() => {
    if (token && allPosts.length > 0) {
      const startIndex = (currentPage - 1) * limit;
      const endIndex = startIndex + limit;
      setPosts(allPosts.slice(startIndex, endIndex));
    }
  }, [currentPage, token, allPosts, limit]);

  
  useEffect(() => {
    const initialInteractions = {};
    const initialCommentInputs = {};
    const initialShowComments = {};
    const initialPostComments = {};

    posts.forEach(post => {
      initialInteractions[post._id] = {
        liked: post.likedBy?.includes(token) || false, 
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
            likes: response.likes !== undefined ? response.likes : (response.liked ? prev[postId].likes + 1 : prev[postId].likes - 1)
          }
        }));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };



  // Open comment modal
  const openCommentModal = (postId, postTitle) => {
    setCommentModal({ 
      isOpen: true, 
      postId: postId, 
      postTitle: postTitle || "Post"
    });
  };
  
  // Close comment modal
  const closeCommentModal = () => {
    setCommentModal({ isOpen: false, postId: null, postTitle: null });
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

  // Open post modal
  const openPostModal = (post) => {
    setSelectedPost(post);
    setIsPostModalOpen(true);
  };

  // Close post modal
  const closePostModal = () => {
    setIsPostModalOpen(false);
    setSelectedPost(null);
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
          
          
          
          params.append('limit', '100'); 
        }
        
        const url = params.toString() ? `${endpoint}?${params}` : endpoint;
        
        const response = await api.get(url, !!token);
        
        if (response && response.blogs && response.blogs.allBlogs) {
          
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
            
            
            const postsWithImages = response.blogs.allBlogs.map((post, index) => ({
              ...post,
              staticImage: staticImages[index % staticImages.length]
            }));
            setPosts(postsWithImages);
            setShowingLimited(true);
          } else {
            
            
            const allPostsWithImages = response.blogs.allBlogs.map((post, index) => ({
              ...post,
              staticImage: staticImages[index % staticImages.length]
            }));
            setAllPosts(allPostsWithImages);
            setTotalPosts(allPostsWithImages.length);
            const postsWithImages = allPostsWithImages.slice(0, limit); 
            setPosts(postsWithImages);
            setShowingLimited(false); 
          }
        } else {
          setPosts([]);
          setAllPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        
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
    
    const wordsPerMinute = 200;
    const wordCount = description.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  console.log("Rendering - loading:", loading, "posts count:", posts.length);

  
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
        {}
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
                    
                    const loginEvent = new CustomEvent('openLoginModal');
                    document.dispatchEvent(loginEvent);
                    closeLoginModal(); 
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
                      src={post.staticImage} 
                      alt={post.newsTitle} 
                      onLoad={(e) => {
                        
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

                    {}
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
                        onClick={() => openCommentModal(post._id, post.newsTitle)}
                        title="View Comments"
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
                    
                    {}
                    <button 
                      className={styles.readMoreButton}
                      onClick={() => openPostModal(post)}
                    >
                      Read More
                    </button>


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
                      
                      navigate('/');
                      
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

            {}
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
      
      {}
      <CommentModal 
        postId={commentModal.postId} 
        postTitle={commentModal.postTitle} 
        isOpen={commentModal.isOpen} 
        onClose={closeCommentModal}
        onCommentAdded={() => {
          
          if (commentModal.postId) {
            setPostInteractions(prev => ({
              ...prev,
              [commentModal.postId]: {
                ...prev[commentModal.postId],
                comments: (prev[commentModal.postId].comments || 0) + 1
              }
            }));
          }
        }}
      />
      
      {}
      <PostModal
        post={selectedPost}
        isOpen={isPostModalOpen}
        onClose={closePostModal}
      />
    </section>
  );
};

export default Posts;
