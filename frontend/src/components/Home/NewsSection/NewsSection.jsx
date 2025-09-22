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

const NewsSection = () => {
  const [activeTab, setActiveTab] = useState("Travel");
  const [isVisible, setIsVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef(null);

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
        content: `
          <p>African nations are facing unprecedented challenges in their efforts to protect wildlife as climate change continues to alter ecosystems and habitats. Conservationists report that many species are struggling to adapt to rapidly changing conditions.</p>
          <p>In Kenya's Maasai Mara, elephant populations have declined by 30% over the past decade due to prolonged droughts and human-wildlife conflicts. Similar trends are being observed across the continent, with rhinos, lions, and other iconic species facing increasing threats.</p>
          <p>Government agencies and non-profit organizations are working together to implement new conservation strategies, including wildlife corridors and community-based conservation programs. However, funding remains a significant challenge, with many projects operating on limited budgets.</p>
          <p>Experts emphasize that international cooperation and increased funding are crucial to reversing these trends and preserving Africa's rich biodiversity for future generations.</p>
        `,
      },
      {
        category: "Travel",
        title: "How to get the best deals on flights",
        date: "January 18, 2025",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        excerpt: "Expert tips for finding affordable travel options in 2025.",
        content: `
          <p>Finding the best flight deals requires strategy, timing, and knowing where to look. Industry experts share their top tips for securing affordable airfare in 2025.</p>
          <p>First, be flexible with your travel dates. Flying on Tuesday, Wednesday, or Saturday typically offers the lowest fares. Consider using fare comparison tools that show prices across an entire month to identify the cheapest days to fly.</p>
          <p>Second, set up price alerts for your desired routes. Numerous apps and websites will notify you when prices drop for specific destinations. Booking 6-8 weeks in advance for domestic flights and 3-4 months for international routes often yields the best prices.</p>
          <p>Finally, consider alternative airports and be willing to take connecting flights. Sometimes flying into a nearby city and taking ground transportation can save hundreds of dollars.</p>
        `,
      },
      {
        category: "Travel",
        title: "Top 10 Hidden Gems in Southeast Asia",
        date: "January 19, 2025",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
        excerpt: "Undiscovered destinations that offer authentic experiences.",
        content: `
          <p>While destinations like Bali and Bangkok continue to draw crowds, Southeast Asia still harbors countless hidden gems waiting to be discovered by intrepid travelers.</p>
          <p>In Vietnam, consider visiting the mountainous region of Ha Giang instead of the popular Halong Bay. The dramatic landscapes and authentic hill tribe communities offer a much more genuine experience of Vietnamese culture.</p>
          <p>In Indonesia, skip crowded Bali and head to the untouched islands of the Maluku archipelago, where pristine beaches and vibrant coral reefs await without the tourist crowds.</p>
          <p>Laos' 4,000 Islands region provides a tranquil alternative to the well-trodden tourist trail, with rustic bungalows, waterfalls, and the chance to spot rare Irrawaddy dolphins.</p>
          <p>These destinations not only offer more authentic experiences but also help distribute tourism revenue to communities that benefit greatly from visitor spending.</p>
        `,
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
        content: `
          <p>Plant-based cuisine has evolved from simple meat alternatives to a sophisticated culinary movement celebrating vegetables, legumes, and grains in their own right.</p>
          <p>Top chefs are now creating multi-course tasting menus that highlight the diversity and complexity of plant-based ingredients. Techniques like fermentation, smoking, and aging are being applied to vegetables to develop deep, umami-rich flavors.</p>
          <p>Restaurants specializing in plant-based cuisine are seeing record reservations, with some requiring bookings months in advance. This trend reflects a growing consumer interest in sustainable, health-conscious dining options that don't compromise on flavor or experience.</p>
        `,
      },
      {
        category: "Food",
        title: "Traditional Cooking Techniques Making a Comeback",
        date: "January 16, 2025",
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
        excerpt: "Ancient methods are finding new life in modern kitchens.",
        content: `
          <p>As the culinary world becomes increasingly focused on sustainability and flavor, chefs are rediscovering traditional cooking techniques that had nearly been forgotten.</p>
          <p>Fermentation, once primarily used for preservation, is now being explored for the complex flavors it can develop. Chefs are creating their own misos, kimchis, and fermented sauces to add depth to their dishes.</p>
          <p>Wood-fired cooking is also experiencing a renaissance, with restaurants installing custom-built hearths and ovens. The live fire imparts a unique smokiness that can't be replicated with modern equipment.</p>
          <p>These time-honored techniques not only produce exceptional flavors but also connect us to culinary traditions that have sustained cultures for centuries.</p>
        `,
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
        content: `
          <p>A comprehensive new study published in the New England Journal of Medicine has provided compelling evidence for the benefits of intermittent fasting on metabolic health.</p>
          <p>The year-long study followed 500 participants with prediabetes, comparing those who practiced a 16:8 intermittent fasting pattern (16 hours fasting, 8-hour eating window) with a control group that maintained their regular eating patterns.</p>
          <p>The results showed significant improvements in insulin sensitivity, blood pressure, and cholesterol levels in the fasting group. Participants also reported increased energy levels and improved mental clarity.</p>
          <p>Researchers caution that intermittent fasting isn't suitable for everyone, particularly those with certain medical conditions or a history of eating disorders. They recommend consulting with a healthcare provider before making significant changes to eating patterns.</p>
        `,
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
        content: `
          <p>World leaders convened in Geneva this week for the Global Climate Summit, aiming to negotiate more ambitious targets for reducing greenhouse gas emissions.</p>
          <p>The summit comes amid growing concerns about the pace of climate change, with recent reports indicating that current commitments fall far short of what's needed to limit global warming to 1.5 degrees Celsius.</p>
          <p>Key topics on the agenda include financing for climate adaptation in developing nations, mechanisms for carbon pricing and trading, and agreements on phasing out fossil fuel subsidies.</p>
          <p>Environmental activists have organized parallel events to pressure negotiators, arguing that incremental changes are no longer sufficient to address the climate emergency. The outcomes of this summit will set the direction for global climate policy for the next decade.</p>
        `,
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

  const filteredArticles = articles[activeTab] || [];

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
                  <button
                    className={styles.readMore}
                    onClick={() => handleReadMore(filteredArticles[0])}
                  >
                    Read More →
                  </button>
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
                      <button
                        className={styles.readMore}
                        onClick={() => handleReadMore(article)}
                      >
                        Read More →
                      </button>
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
