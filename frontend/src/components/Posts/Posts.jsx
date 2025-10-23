import { useState, useEffect, useRef } from "react";
import styles from "./Posts.module.css";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [showingLimited, setShowingLimited] = useState(false);
  const sectionRef = useRef(null);
  const { token } = useAuth();

  // Test data with proper structure
  const testPosts = [
    {
      _id: "1",
      newsTitle: "Test Post 1",
      newsDescription:
        "This is a test post description with more content to make it look realistic and engaging for users.",
      category: "Technology",
      postedBy: "Admin",
      datePosted: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      featured: true,
      readTime: "3 min read",
    },
    {
      _id: "2",
      newsTitle: "Test Post 2",
      newsDescription:
        "Another test post description with interesting content about web development and modern technologies.",
      category: "General",
      postedBy: "Admin",
      datePosted: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      featured: false,
      readTime: "5 min read",
    },
    {
      _id: "3",
      newsTitle: "Test Post 3",
      newsDescription:
        "This is the third test post showing how the grid layout works with multiple cards in a beautiful arrangement.",
      category: "Design",
      postedBy: "Admin",
      datePosted: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      featured: true,
      readTime: "4 min read",
    },
  ];

  useEffect(() => {
    console.log("Posts component mounted");

    // Simulate API call with timeout to show loading state
    const timer = setTimeout(() => {
      console.log("Setting test posts");
      setPosts(testPosts);
      setLoading(false);
      setShowingLimited(!token);
    }, 1000);

    return () => clearTimeout(timer);
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
                    post.featured ? styles.featured : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {post.featured && (
                    <div className={styles.featuredBadge}>Featured</div>
                  )}

                  <div className={styles.postImage}>
                    <span className={styles.emoji}>
                      {post.category === "Technology"
                        ? "💻"
                        : post.category === "Design"
                        ? "🎨"
                        : "📝"}
                    </span>
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
                        {post.readTime || "5 min read"}
                      </div>
                    </div>
                  </div>

                  <div className={styles.postHover}></div>
                </article>
              ))}
            </div>

            {showingLimited && (
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
                      // Trigger login modal
                      const loginButton = document.querySelector(
                        "[data-login-trigger]"
                      );
                      if (loginButton) {
                        loginButton.click();
                      } else {
                        // Fallback: redirect to login page or show alert
                        alert("Please navigate to the login page");
                      }
                    }}
                  >
                    Login to Continue
                  </button>
                </div>
              </div>
            )}

            {token && posts.length > 0 && (
              <div className={styles.loadMore}>
                <button className={styles.loadMoreButton}>
                  Load More Posts
                  <span className={styles.loadMoreArrow}>↓</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Posts;
