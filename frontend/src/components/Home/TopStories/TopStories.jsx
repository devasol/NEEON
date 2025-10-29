import React, { useState, useEffect, useRef } from "react";
import styles from "./TopStories.module.css";

const TopStories = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [visible, setVisible] = useState(false);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainer = useRef(null);

  useEffect(() => {
    // Trigger entrance animation
    setVisible(true);
    
    // Fetch more blog posts from backend for the Top Stories section
    const fetchStories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000/api/v1'}/blogs/public?limit=6`);
        const data = await response.json();
        if (data.status === 'success' && data.blogs) {
          // Transform the blog data to match the expected structure for the component
          const transformedStories = data.blogs.allBlogs.map((blog, index) => ({
            id: blog._id || index + 1,
            category: blog.category || "Uncategorized",
            title: blog.newsTitle || "Untitled",
            author: blog.postedBy || "ADMIN",
            date: blog.datePosted ? new Date(blog.datePosted).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Unknown Date",
            image: blog.imageUrl || `https://picsum.photos/400/250?random=${index + 1}`,
            excerpt: blog.newsDescription?.substring(0, 100) + (blog.newsDescription?.length > 100 ? "..." : "") || "No description available.",
            likes: blog.likes || 0,
            comments: blog.comments || 0
          }));
          setStories(transformedStories);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
        // Fallback to static data if API fails
        const fallbackStories = [
          {
            id: 1,
            category: "TECH",
            title: "Modern CSS Techniques You Should Know",
            author: "ADMIN",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: "https://images.unsplash.com/photo-1615962122169-6a27d96cc78d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            excerpt: "CSS has evolved significantly in recent years. Discover modern techniques like CSS Grid, Flexbox, custom properties, and container queries that will elevate your styling skills.",
          },
          {
            id: 2,
            category: "TECH",
            title: "JavaScript ES2024 New Features",
            author: "ADMIN",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: "https://images.unsplash.com/photo-1550615539-911b09de9a0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            excerpt: "The JavaScript language continues to evolve. Discover the latest features introduced in ES2024 and how they can improve your code's readability and functionality.",
          },
          {
            id: 3,
            category: "TECH",
            title: "API Security Best Practices",
            author: "ADMIN",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: "https://images.unsplash.com/photo-1550522970-2c3e14d2e8d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            excerpt: "Security should be a top priority when building APIs. Explore essential security measures including authentication, rate limiting, and input validation.",
          },
          {
            id: 4,
            category: "DESIGN",
            title: "UI Design Principles for Better User Engagement",
            author: "ADMIN",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: "https://picsum.photos/400/250?random=4",
            excerpt: "Learn essential UI design principles that can significantly improve user engagement and satisfaction with your digital products.",
          },
          {
            id: 5,
            category: "BUSINESS",
            title: "Remote Work Trends in the Tech Industry",
            author: "ADMIN",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: "https://picsum.photos/400/250?random=5",
            excerpt: "Exploring how the shift to remote work has impacted productivity, collaboration, and company culture in the technology sector.",
          },
          {
            id: 6,
            category: "MARKETING",
            title: "Content Marketing Strategies for Startups",
            author: "ADMIN",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: "https://picsum.photos/400/250?random=6",
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

  if (loading && stories.length === 0) {
    return (
      <section className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Top Stories</h2>
        </div>
        <div className={styles.loading}>Loading stories...</div>
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
                    <button className={styles.reactionBtn}>💬 {story.comments || 8}</button>
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
    </section>
  );
};

export default TopStories;
