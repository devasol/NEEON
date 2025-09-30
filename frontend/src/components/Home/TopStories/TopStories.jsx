import React, { useState, useEffect, useRef } from "react";
import styles from "./TopStories.module.css";

const stories = [
  {
    id: 1,
    category: "MUSIC",
    title: "How childhood viral infections may year 2021 Section",
    author: "ADMIN",
    date: "December 8, 2021",
    image: "https://picsum.photos/400/250?random=1",
    excerpt:
      "Exploring the long-term effects of childhood viral infections on health in adulthood.",
  },
  {
    id: 2,
    category: "ANIMAL",
    title: "Animal Nation Are Struggling To Save Their Wildlife",
    author: "ADMIN",
    date: "December 9, 2021",
    image: "https://picsum.photos/400/250?random=2",
    excerpt:
      "Conservation efforts face challenges as wildlife populations continue to decline globally.",
  },
  {
    id: 3,
    category: "TRAVEL",
    title: "If you went round the world which places could",
    author: "ADMIN",
    date: "December 9, 2021",
    image: "https://picsum.photos/400/250?random=3",
    excerpt:
      "Discover the most breathtaking destinations for your ultimate around-the-world adventure.",
  },
  {
    id: 4,
    category: "HEALTH",
    title: "Moon They Landing How are Main Close Space Really",
    author: "ADMIN",
    date: "October 9, 2021",
    image: "https://picsum.photos/400/250?random=4",
    excerpt:
      "The latest advancements in space medicine and how they're revolutionizing healthcare on Earth.",
  },
  {
    id: 5,
    category: "TECH",
    title: "Revolutionary AI Breakthrough Changes Everything",
    author: "ADMIN",
    date: "November 15, 2021",
    image: "https://picsum.photos/400/250?random=5",
    excerpt:
      "How new artificial intelligence models are transforming industries across the globe.",
  },
  {
    id: 6,
    category: "FOOD",
    title: "Culinary Experts Reveal Secret Cooking Techniques",
    author: "ADMIN",
    date: "December 20, 2021",
    image: "https://picsum.photos/400/250?random=6",
    excerpt:
      "Professional chefs share their insider tips for creating restaurant-quality meals at home.",
  },
];

const TopStories = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [visible, setVisible] = useState(false);
  const scrollContainer = useRef(null);

  useEffect(() => {
    // Trigger entrance animation
    setVisible(true);

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
                    <button className={styles.reactionBtn}>👍 24</button>
                    <button className={styles.reactionBtn}>💬 8</button>
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
