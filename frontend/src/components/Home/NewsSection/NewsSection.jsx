import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPinterest,
  FaTimes,
} from "react-icons/fa";
import styles from "./NewsSection.module.css";
import PostActions from "../../Common/PostActions/PostActions";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";

const NewsSection = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [isVisible, setIsVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const { token } = useAuth();

  useEffect(() => {
    // Animation on component mount
    setIsVisible(true);

    // Fetch all blog posts from backend
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000/api/v1'}/blogs/public?limit=20`);
        const data = await response.json();
        if (data.status === 'success' && data.blogs) {
          // Transform the blog data to match the expected structure for the component
          const transformedArticles = data.blogs.allBlogs.map((blog, index) => ({
            id: blog._id || index + 1,
            category: blog.category || "Uncategorized",
            title: blog.newsTitle || "Untitled",
            date: blog.datePosted ? new Date(blog.datePosted).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Unknown Date",
            image: blog.imageUrl || `https://picsum.photos/600/400?random=${index + 1}`,
            excerpt: blog.newsDescription?.substring(0, 150) + (blog.newsDescription?.length > 150 ? "..." : "") || "No description available.",
            content: blog.newsDescription || "",
            postedBy: blog.postedBy || "Admin"
          }));
          
          setAllArticles(transformedArticles);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        // Fallback to static data if API fails
        const fallbackArticles = [
          {
            id: 1,
            category: "Technology",
            title: "Modern CSS Techniques You Should Know",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: "https://images.unsplash.com/photo-1615962122169-6a27d96cc78d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            excerpt: "CSS has evolved significantly in recent years. Discover modern techniques like CSS Grid, Flexbox, custom properties, and container queries that will elevate your styling skills.",
            content: `<p>CSS has evolved significantly in recent years. Discover modern techniques like CSS Grid, Flexbox, custom properties, and container queries that will elevate your styling skills.</p><p>Modern CSS provides powerful layout capabilities that were previously impossible or required complex workarounds. Understanding these techniques will make you a more efficient and effective developer.</p>`,
            postedBy: "Admin"
          },
          {
            id: 2,
            category: "Technology",
            title: "JavaScript ES2024 New Features",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: "https://images.unsplash.com/photo-1550615539-911b09de9a0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            excerpt: "The JavaScript language continues to evolve. Discover the latest features introduced in ES2024 and how they can improve your code's readability and functionality.",
            content: `<p>The JavaScript language continues to evolve. Discover the latest features introduced in ES2024 and how they can improve your code's readability and functionality.</p><p>With each new version, JavaScript adds powerful features that make development more efficient and code more maintainable.</p>`,
            postedBy: "Admin"
          },
          {
            id: 3,
            category: "Technology",
            title: "API Security Best Practices",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: "https://images.unsplash.com/photo-1550522970-2c3e14d2e8d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            excerpt: "Security should be a top priority when building APIs. Explore essential security measures including authentication, rate limiting, and input validation.",
            content: `<p>Security should be a top priority when building APIs. Explore essential security measures including authentication, rate limiting, and input validation.</p><p>Modern applications require robust security measures to protect user data and maintain trust in your services.</p>`,
            postedBy: "Admin"
          },
        ];
        setAllArticles(fallbackArticles);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();

    return () => setIsVisible(false);
  }, []);

  const tabs = ["All", "Technology", "Design", "Business", "Marketing"];

  // Filter articles by active tab
  const filteredArticles = activeTab === "All" 
    ? allArticles 
    : allArticles.filter(article => 
        article.category.toLowerCase().includes(activeTab.toLowerCase())
      );

  // Get the featured article (first one)
  const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  
  // Get the next two articles
  const secondaryArticles = filteredArticles.length > 1 ? filteredArticles.slice(1, 3) : [];

  const socialLinks = [
    {
      name: "Facebook",
      followers: "7.2K Fans",
      color: "#3b5998",
      icon: <FaFacebookF />,
    },
    {
      name: "Twitter",
      followers: "11.5K Followers",
      color: "#1da1f2",
      icon: <FaTwitter />,
    },
    {
      name: "Instagram",
      followers: "9.8K Followers",
      color: "#e1306c",
      icon: <FaInstagram />,
    },
    {
      name: "YouTube",
      followers: "12.3K Subscribers",
      color: "#ff0000",
      icon: <FaYoutube />,
    },
    {
      name: "Pinterest",
      followers: "6.7K Followers",
      color: "#bd081c",
      icon: <FaPinterest />,
    },
  ];

  const handleReadMore = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
    // Re-enable body scrolling when modal is closed
    document.body.style.overflow = "unset";
  };

  const LoginPrompt = () => (
    <div className={styles.loginPrompt}>
      <p>
        <Link to="/login">Login</Link> to get all posts
      </p>
    </div>
  );

  if (loading && allArticles.length === 0) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>What's New</h2>
        <div className={styles.loading}>Loading articles...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${isVisible ? styles.visible : ""}`}
      style={{ position: "relative" }}
    >
      {/* Left Section */}
      <div className={styles.left}>
        <h2 className={styles.title}>What's New</h2>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${styles.tab} ${
                activeTab === tab ? styles.activeTab : ""
              }`}
            >
              {tab}
              <span className={styles.tabIndicator}></span>
            </button>
          ))}
        </div>

        {featuredArticle ? (
          <>
            {/* Featured Article */}
            <div className={styles.mainArticle}>
              <div className={styles.imageContainer}>
                <img src={featuredArticle.image} alt="main" />
                <div className={styles.overlay}></div>
                <div className={styles.categoryBadge}>
                  {featuredArticle.category}
                </div>
              </div>
              <div className={styles.articleContent}>
                <h3>{featuredArticle.title}</h3>
                <p className={styles.excerpt}>{featuredArticle.excerpt}</p>
                <div className={styles.articleMeta}>
                  <span className={styles.date}>
                    {featuredArticle.date}
                  </span>
                  <button
                    className={styles.readMore}
                    onClick={() => handleReadMore(featuredArticle)}
                  >
                    Read More →
                  </button>
                </div>
                <PostActions
                  postId={featuredArticle.id || 0}
                  postTitle={featuredArticle.title}
                />
              </div>
            </div>

            {/* Secondary Articles */}
            <div className={styles.articleList}>
              {secondaryArticles.map((article, index) => (
                <div key={article.id || index} className={styles.articleItem}>
                  <div className={styles.imageContainer}>
                    <img src={article.image} alt={article.title} />
                    <div className={styles.overlay}></div>
                  </div>
                  <div className={styles.articleContent}>
                    <h4>{article.title}</h4>
                    <p className={styles.excerpt}>{article.excerpt}</p>
                    <div className={styles.articleMeta}>
                      <span className={styles.date}>{article.date}</span>
                      <button
                        className={styles.readMore}
                        onClick={() => handleReadMore(article)}
                      >
                        Read More →
                      </button>
                    </div>
                    <PostActions
                      postId={article.id || index + 1}
                      postTitle={article.title}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Button to get all posts */}
            <div className={styles.viewAllButtonContainer}>
              {token ? (
                <Link to="/posts" className={styles.viewAllButton}>
                  Click here to get all the posts
                </Link>
              ) : (
                <Link to="/login" className={styles.viewAllButton}>
                  Login to get all posts
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className={styles.noArticles}>
            <p>No articles found.</p>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className={styles.right}>
        <h2 className={styles.title}>Stay Connected</h2>
        <div className={styles.socialList}>
          {socialLinks.map((social, index) => (
            <div
              key={index}
              className={styles.socialBox}
              style={{
                backgroundColor: social.color,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className={styles.socialIcon}>{social.icon}</div>
              <div className={styles.socialInfo}>
                <span className={styles.socialName}>{social.name}</span>
                <span className={styles.socialFollowers}>
                  {social.followers}
                </span>
              </div>
              <div className={styles.socialArrow}>→</div>
            </div>
          ))}
        </div>

        <div className={styles.newsletter}>
          <h3>Subscribe to Newsletter</h3>
          <p>Get the latest news delivered to your inbox.</p>
          <div className={styles.newsletterForm}>
            <input type="email" placeholder="Your email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      {/* Modal Popup - rendered via portal to document.body so it covers viewport */}
      {isModalOpen && selectedArticle
        ? createPortal(
            <div className={styles.modalOverlay} onClick={closeModal}>
              <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
              >
                <button className={styles.closeButton} onClick={closeModal}>
                  <FaTimes />
                </button>
                <div className={styles.modalImageContainer}>
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                  />
                  <div className={styles.modalImageOverlay}></div>
                  <div className={styles.modalCategoryBadge}>
                    {selectedArticle.category}
                  </div>
                </div>
                <div className={styles.modalContent}>
                  <h2 className={styles.modalTitle}>{selectedArticle.title}</h2>
                  <div className={styles.modalMeta}>
                    <span className={styles.modalDate}>
                      {selectedArticle.date}
                    </span>
                  </div>
                  <div
                    className={styles.modalText}
                    dangerouslySetInnerHTML={{
                      __html: selectedArticle.content,
                    }}
                  />
                  <button className={styles.modalCloseBtn} onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
};

export default NewsSection;
