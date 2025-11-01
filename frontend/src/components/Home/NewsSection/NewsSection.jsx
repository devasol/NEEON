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
    
    setIsVisible(true);

    
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000/api/v1'}/blogs/public?limit=20`);
        const data = await response.json();
        if (data.status === 'success' && data.blogs) {
          
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
          
          
          const transformedArticles = data.blogs.allBlogs.map((blog, index) => ({
            id: blog._id || index + 1,
            category: blog.category || "Uncategorized",
            title: blog.newsTitle || "Untitled",
            date: blog.datePosted ? new Date(blog.datePosted).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Unknown Date",
            image: staticImages[index % staticImages.length], 
            excerpt: blog.newsDescription?.substring(0, 150) + (blog.newsDescription?.length > 150 ? "..." : "") || "No description available.",
            content: blog.newsDescription || "",
            postedBy: blog.postedBy || "Admin"
          }));
          
          setAllArticles(transformedArticles);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        
        const staticImages = [
          "/postsImg/photo-1421789665209-c9b2a435e3dc.avif",
          "/postsImg/photo-1445307806294-bff7f67ff225.avif",
          "/postsImg/photo-1445633743309-b60418bedbf2.avif"
        ];
        
        const fallbackArticles = [
          {
            id: 1,
            category: "Technology",
            title: "Modern CSS Techniques You Should Know",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: staticImages[0],
            excerpt: "CSS has evolved significantly in recent years. Discover modern techniques like CSS Grid, Flexbox, custom properties, and container queries that will elevate your styling skills.",
            content: `<p>CSS has evolved significantly in recent years. Discover modern techniques like CSS Grid, Flexbox, custom properties, and container queries that will elevate your styling skills.</p><p>Modern CSS provides powerful layout capabilities that were previously impossible or required complex workarounds. Understanding these techniques will make you a more efficient and effective developer.</p>`,
            postedBy: "Admin"
          },
          {
            id: 2,
            category: "Technology",
            title: "JavaScript ES2024 New Features",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: staticImages[1],
            excerpt: "The JavaScript language continues to evolve. Discover the latest features introduced in ES2024 and how they can improve your code's readability and functionality.",
            content: `<p>The JavaScript language continues to evolve. Discover the latest features introduced in ES2024 and how they can improve your code's readability and functionality.</p><p>With each new version, JavaScript adds powerful features that make development more efficient and code more maintainable.</p>`,
            postedBy: "Admin"
          },
          {
            id: 3,
            category: "Technology",
            title: "API Security Best Practices",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: staticImages[2],
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

  
  const filteredArticles = activeTab === "All" 
    ? allArticles 
    : allArticles.filter(article => 
        article.category.toLowerCase().includes(activeTab.toLowerCase())
      );

  
  const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  
  
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
    
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
    
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
        <div className={styles.left}>
          <h2 className={styles.title}>What's New</h2>
          <div className={styles.tabs}>
            {tabs.map((tab, index) => (
              <button
                key={tab}
                className={`${styles.tab} ${index === 0 ? styles.activeTab : ""}`}
              >
                {tab}
                <span className={styles.tabIndicator}></span>
              </button>
            ))}
          </div>
          
          {}
          <div className={`${styles.mainArticle} ${styles.loadingSkeleton} ${styles.loadingMainArticle}`}>
            <div className={styles.imageContainer}>
              <div className={`${styles.loadingSkeleton}`} style={{width: '100%', height: '100%'}}></div>
              <div className={styles.overlay}></div>
              <div className={`${styles.categoryBadge} ${styles.loadingSkeleton}`} style={{width: '80px', height: '20px'}}></div>
            </div>
            <div className={styles.articleContent}>
              <h3 className={`${styles.loadingSkeleton} ${styles.loadingTitle}`}></h3>
              <p className={`${styles.loadingSkeleton} ${styles.loadingExcerpt}`}></p>
              <p className={`${styles.loadingSkeleton} ${styles.loadingExcerpt}`}></p>
              <div className={`${styles.loadingSkeleton} ${styles.loadingDate}`}></div>
            </div>
          </div>

          {}
          <div className={styles.articleList}>
            {[...Array(2)].map((_, index) => (
              <div key={index} className={`${styles.articleItem} ${styles.loadingSkeleton} ${styles.loadingArticleItem}`}>
                <div className={styles.imageContainer}>
                  <div className={`${styles.loadingSkeleton}`} style={{width: '100%', height: '100%'}}></div>
                  <div className={styles.overlay}></div>
                </div>
                <div className={styles.articleContent}>
                  <h4 className={`${styles.loadingSkeleton} ${styles.loadingTitle}`}></h4>
                  <p className={`${styles.loadingSkeleton} ${styles.loadingExcerpt}`}></p>
                  <p className={`${styles.loadingSkeleton} ${styles.loadingExcerpt}`}></p>
                  <div className={`${styles.loadingSkeleton} ${styles.loadingDate}`}></div>
                </div>
              </div>
            ))}
          </div>

          {}
          <div className={styles.viewAllButtonContainer}>
            <div className={`${styles.viewAllButton} ${styles.loadingSkeleton}`} style={{width: '200px', height: '40px', margin: '0 auto'}}></div>
          </div>
        </div>
        
        {}
        <div className={styles.right}>
          <h2 className={styles.title}>Stay Connected</h2>
          <div className={styles.socialList}>
            {[...Array(5)].map((_, index) => (
              <div key={index} className={`${styles.socialBox} ${styles.loadingSkeleton}`} style={{height: '60px'}}></div>
            ))}
          </div>
          
          <div className={styles.newsletter}>
            <h3 className={`${styles.loadingSkeleton}`} style={{width: '120px', height: '1.5rem', marginBottom: '0.5rem'}}></h3>
            <p className={`${styles.loadingSkeleton}`} style={{width: '180px', height: '1rem', marginBottom: '1rem'}}></p>
            <div className={styles.newsletterForm}>
              <div className={`${styles.loadingSkeleton}`} style={{flexGrow: 1, height: '40px', borderRadius: '4px 0 0 4px'}}></div>
              <div className={`${styles.loadingSkeleton}`} style={{width: '80px', height: '40px', borderRadius: '0 4px 4px 0'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${isVisible ? styles.visible : ""}`}
      style={{ position: "relative" }}
    >
      {}
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
            {}
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

            {}
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

            {}
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

      {}
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

      {}
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
