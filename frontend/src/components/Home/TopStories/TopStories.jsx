import React, { useState, useEffect, useRef } from "react";
import styles from "./TopStories.module.css";
import CommentModal from "../../Comments/ModernCommentModal";

const TopStories = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [visible, setVisible] = useState(false);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainer = useRef(null);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    // Trigger entrance animation
    setVisible(true);
    
    // Fetch more blog posts from backend for the Top Stories section
    const fetchStories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000/api/v1'}/blogs/public?limit=6`);
        const data = await response.json();
        if (data.status === 'success' && data.blogs) {
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
          
          // Transform the blog data to match the expected structure for the component
          const transformedStories = data.blogs.allBlogs.map((blog, index) => ({
            id: blog._id || index + 1,
            category: blog.category || "Uncategorized",
            title: blog.newsTitle || "Untitled",
            author: blog.postedBy || "ADMIN",
            date: blog.datePosted ? new Date(blog.datePosted).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Unknown Date",
            image: staticImages[index % staticImages.length], // Use static images from postsImg
            excerpt: blog.newsDescription?.substring(0, 100) + (blog.newsDescription?.length > 100 ? "..." : "") || "No description available.",
            likes: blog.likes || 0,
            comments: blog.comments || 0
          }));
          setStories(transformedStories);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
        // Fallback to static data with images from postsImg if API fails
        const staticImages = [
          "/postsImg/photo-1421789665209-c9b2a435e3dc.avif",
          "/postsImg/photo-1445307806294-bff7f67ff225.avif",
          "/postsImg/photo-1445633743309-b60418bedbf2.avif",
          "/postsImg/photo-1470071459604-3b5ec3a7fe05.avif",
          "/postsImg/photo-1474511320723-9a56873867b5.avif",
          "/postsImg/photo-1486312338219-ce68d2c6f44d.avif"
        ];
        
        const fallbackStories = [
          {
            id: 1,
            category: "TECH",
            title: "Modern CSS Techniques You Should Know",
            author: "ADMIN",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: staticImages[0],
            excerpt: "CSS has evolved significantly in recent years. Discover modern techniques like CSS Grid, Flexbox, custom properties, and container queries that will elevate your styling skills.",
          },
          {
            id: 2,
            category: "TECH",
            title: "JavaScript ES2024 New Features",
            author: "ADMIN",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: staticImages[1],
            excerpt: "The JavaScript language continues to evolve. Discover the latest features introduced in ES2024 and how they can improve your code's readability and functionality.",
          },
          {
            id: 3,
            category: "TECH",
            title: "API Security Best Practices",
            author: "ADMIN",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: staticImages[2],
            excerpt: "Security should be a top priority when building APIs. Explore essential security measures including authentication, rate limiting, and input validation.",
          },
          {
            id: 4,
            category: "DESIGN",
            title: "UI Design Principles for Better User Engagement",
            author: "ADMIN",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: staticImages[3],
            excerpt: "Learn essential UI design principles that can significantly improve user engagement and satisfaction with your digital products.",
          },
          {
            id: 5,
            category: "BUSINESS",
            title: "Remote Work Trends in the Tech Industry",
            author: "ADMIN",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: staticImages[4],
            excerpt: "Exploring how the shift to remote work has impacted productivity, collaboration, and company culture in the technology sector.",
          },
          {
            id: 6,
            category: "MARKETING",
            title: "Content Marketing Strategies for Startups",
            author: "ADMIN",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: staticImages[5],
            excerpt: "Discover effective content marketing tactics that can help startups build brand awareness and attract customers on a limited budget.",
          },
        ];
        setStories(fallbackStories);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();

    return () => setVisible(false);
  }, []);

  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  const handleOpenCommentModal = (story) => {
    setSelectedStory(story);
    setCommentModalOpen(true);
  };

  const handleCloseCommentModal = () => {
    setCommentModalOpen(false);
    setSelectedStory(null);
  };

  if (loading && stories.length === 0) {
    return (
      <section className={styles.container}>
        <div className={styles.header}>
          <h2 className={`${styles.heading} ${styles.loadingSkeleton}`} style={{width: '180px', height: '2.2rem'}}></h2>
          <div className={styles.navigation}>
            <div className={`${styles.navButton} ${styles.loadingSkeleton}`} style={{width: '40px', height: '40px', borderRadius: '50%'}}></div>
            <div className={`${styles.navButton} ${styles.loadingSkeleton}`} style={{width: '40px', height: '40px', borderRadius: '50%'}}></div>
          </div>
        </div>
        
        <div className={styles.scrollContainer}>
          <div className={styles.horizontalGrid}>
            {[...Array(6)].map((_, index) => (
              <div key={index} className={`${styles.loadingCard} ${styles.loadingSkeleton}`}>
                <div className={`${styles.imageContainer} ${styles.loadingImageContainer}`}>
                  <div className={`${styles.loadingSkeleton}`} style={{width: '100%', height: '100%'}}></div>
                </div>
                <div className={styles.loadingCardContent}>
                  <div className={`${styles.category} ${styles.loadingSkeleton}`} style={{width: '60px', height: '20px', marginBottom: '0.8rem'}}></div>
                  <div className={`${styles.loadingSkeleton} ${styles.loadingCardTitle}`}></div>
                  <p className={`${styles.loadingSkeleton} ${styles.loadingCardExcerpt}`}></p>
                  <p className={`${styles.loadingSkeleton} ${styles.loadingCardExcerpt}`}></p>
                  <div className={`${styles.loadingSkeleton} ${styles.loadingCardMeta}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.scrollIndicator}>
          <div className={styles.indicatorBar}></div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.container} ${visible ? styles.visible : ""}`}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Top Stories</h2>
        <div className={styles.navigation}>
          <button
            className={styles.navButton}
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className={styles.navButton}
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.scrollContainer} ref={scrollContainer}>
        <div className={styles.horizontalGrid}>
          {stories.map((story, index) => (
            <div
              key={story.id}
              className={styles.card}
              onMouseEnter={() => setHoveredCard(story.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.imageContainer}>
                <img
                  src={story.image}
                  alt={story.title}
                  className={`${styles.image} ${
                    hoveredCard === story.id ? styles.imageHover : ""
                  }`}
                />
                <div
                  className={`${styles.overlay} ${
                    hoveredCard === story.id ? styles.overlayVisible : ""
                  }`}
                >
                  <button className={styles.readMoreBtn}>Read More</button>
                </div>
                <span className={styles.category}>{story.category}</span>
                <div className={styles.floatingElements}>
                  <div
                    className={styles.floatingElement}
                    style={{ animationDelay: "0s" }}
                  >
                    ✨
                  </div>
                  <div
                    className={styles.floatingElement}
                    style={{ animationDelay: "0.5s" }}
                  >
                    🌟
                  </div>
                  <div
                    className={styles.floatingElement}
                    style={{ animationDelay: "1s" }}
                  >
                    ⭐
                  </div>
                </div>
              </div>
              <div className={styles.content}>
                <h3 className={styles.title}>{story.title}</h3>
                <p className={styles.excerpt}>{story.excerpt}</p>
                <p className={styles.meta}>
                  BY <span>{story.author}</span> • {story.date}
                </p>
                <div
                  className={`${styles.cardFooter} ${
                    hoveredCard === story.id ? styles.footerVisible : ""
                  }`}
                >
                  <div className={styles.reactions}>
                    <button className={styles.reactionBtn}>👍 {story.likes || 24}</button>
                    <button 
                      className={styles.reactionBtn} 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCommentModal(story);
                      }}
                    >
                      💬 {story.comments || 8}
                    </button>
                    <button className={styles.reactionBtn}>🔗 Share</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <div className={styles.indicatorBar}></div>
      </div>

      {/* Comment Modal */}
      <CommentModal 
        postId={selectedStory?.id} 
        postTitle={selectedStory?.title} 
        isOpen={commentModalOpen} 
        onClose={handleCloseCommentModal} 
      />
    </section>
  );
};

export default TopStories;
