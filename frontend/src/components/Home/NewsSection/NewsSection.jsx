import { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPinterest,
} from "react-icons/fa";
import styles from "./NewsSection.module.css";

const NewsSection = () => {
  const [activeTab, setActiveTab] = useState("Travel");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation on component mount
    setIsVisible(true);

    return () => setIsVisible(false);
  }, []);

  const tabs = ["Travel", "Food", "Health", "Politics"];

  const articles = {
    Travel: [
      {
        category: "Travel",
        title: "African Nations Are Struggling to Save Their Wildlife",
        date: "January 18, 2025",
        image:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
        excerpt:
          "Conservation efforts face challenges as climate change impacts habitats.",
      },
      {
        category: "Travel",
        title: "How to get the best deals on flights",
        date: "January 18, 2025",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        excerpt: "Expert tips for finding affordable travel options in 2025.",
      },
      {
        category: "Travel",
        title: "Top 10 Hidden Gems in Southeast Asia",
        date: "January 19, 2025",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
        excerpt: "Undiscovered destinations that offer authentic experiences.",
      },
    ],
    Food: [
      {
        category: "Food",
        title: "The Rise of Plant-Based Cuisine in 2025",
        date: "January 17, 2025",
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
        excerpt: "How chefs are reinventing plant-based dining experiences.",
      },
      {
        category: "Food",
        title: "Traditional Cooking Techniques Making a Comeback",
        date: "January 16, 2025",
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
        excerpt: "Ancient methods are finding new life in modern kitchens.",
      },
    ],
    Health: [
      {
        category: "Health",
        title: "New Study Reveals Benefits of Intermittent Fasting",
        date: "January 18, 2025",
        image:
          "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800",
        excerpt: "Research shows promising results for metabolic health.",
      },
    ],
    Politics: [
      {
        category: "Politics",
        title: "Global Summit Addresses Climate Policy",
        date: "January 17, 2025",
        image:
          "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800",
        excerpt:
          "World leaders gather to negotiate new environmental agreements.",
      },
    ],
  };

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

  const filteredArticles = articles[activeTab] || [];

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ""}`}>
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

        {filteredArticles.length > 0 ? (
          <>
            <div className={styles.mainArticle}>
              <div className={styles.imageContainer}>
                <img src={filteredArticles[0].image} alt="main" />
                <div className={styles.overlay}></div>
                <div className={styles.categoryBadge}>
                  {filteredArticles[0].category}
                </div>
              </div>
              <div className={styles.articleContent}>
                <h3>{filteredArticles[0].title}</h3>
                <p className={styles.excerpt}>{filteredArticles[0].excerpt}</p>
                <div className={styles.articleMeta}>
                  <span className={styles.date}>
                    {filteredArticles[0].date}
                  </span>
                  <button className={styles.readMore}>Read More →</button>
                </div>
              </div>
            </div>

            <div className={styles.articleList}>
              {filteredArticles.slice(1).map((article, index) => (
                <div key={index} className={styles.articleItem}>
                  <div className={styles.imageContainer}>
                    <img src={article.image} alt={article.title} />
                    <div className={styles.overlay}></div>
                  </div>
                  <div className={styles.articleContent}>
                    <h4>{article.title}</h4>
                    <p className={styles.excerpt}>{article.excerpt}</p>
                    <div className={styles.articleMeta}>
                      <span className={styles.date}>{article.date}</span>
                      <button className={styles.readMore}>Read More →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.noArticles}>
            <p>No articles found for {activeTab}.</p>
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
    </div>
  );
};

export default NewsSection;
