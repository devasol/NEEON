import { useState, useEffect, useRef } from "react";
import styles from "./Categories.module.css";

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const sectionRef = useRef(null);

  const categories = [
    {
      id: 1,
      name: "Technology",
      description:
        "Latest tech trends, reviews, and innovations shaping our future",
      icon: "💻",
      color: "#6366f1",
      articleCount: 42,
      trending: true,
    },
    {
      id: 2,
      name: "Design",
      description: "UI/UX, graphic design, and creative visual concepts",
      icon: "🎨",
      color: "#ec4899",
      articleCount: 28,
      trending: true,
    },
    {
      id: 3,
      name: "Business",
      description: "Startups, entrepreneurship, and business strategies",
      icon: "💼",
      color: "#10b981",
      articleCount: 35,
      trending: false,
    },
    {
      id: 4,
      name: "Lifestyle",
      description: "Health, wellness, and daily life inspiration",
      icon: "🌟",
      color: "#f59e0b",
      articleCount: 19,
      trending: true,
    },
    {
      id: 5,
      name: "Travel",
      description: "Adventure stories, tips, and destination guides",
      icon: "✈️",
      color: "#ef4444",
      articleCount: 23,
      trending: false,
    },
    {
      id: 6,
      name: "Food",
      description: "Recipes, cooking tips, and culinary adventures",
      icon: "🍕",
      color: "#8b5cf6",
      articleCount: 31,
      trending: true,
    },
    {
      id: 7,
      name: "Science",
      description: "Discoveries, research, and scientific breakthroughs",
      icon: "🔬",
      color: "#06b6d4",
      articleCount: 17,
      trending: false,
    },
    {
      id: 8,
      name: "Arts",
      description: "Music, film, literature, and creative expressions",
      icon: "🎭",
      color: "#d946ef",
      articleCount: 26,
      trending: false,
    },
  ];

  const filteredCategories = categories
    .filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.articleCount - a.articleCount;
        case "name":
          return a.name.localeCompare(b.name);
        case "trending":
          return b.trending === a.trending ? 0 : b.trending ? 1 : -1;
        default:
          return 0;
      }
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const CategoryCard = ({ category, index }) => (
    <div
      className={`${styles.categoryCard} ${
        index === activeCategory ? styles.active : ""
      }`}
      onMouseEnter={() => setActiveCategory(index)}
      onClick={() => setActiveCategory(index)}
      style={{ "--category-color": category.color }}
    >
      {category.trending && (
        <div className={styles.trendingBadge}>Trending</div>
      )}
      <div className={styles.cardHeader}>
        <div className={styles.iconWrapper}>
          <span className={styles.icon}>{category.icon}</span>
        </div>
        <div className={styles.categoryStats}>
          <span className={styles.articleCount}>{category.articleCount}</span>
          <span className={styles.articlesText}>articles</span>
        </div>
      </div>
      <h3 className={styles.categoryName}>{category.name}</h3>
      <p className={styles.categoryDescription}>{category.description}</p>
      <div className={styles.exploreButton}>
        Explore Category
        <span className={styles.arrow}>→</span>
      </div>
      <div className={styles.cardHoverEffect}></div>
    </div>
  );

  return (
    <section ref={sectionRef} className={styles.categories}>
      <div className={`${styles.container} ${isVisible ? styles.visible : ""}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Browse Categories</h2>
          <p className={styles.subtitle}>
            Discover amazing content organized by topics you love
          </p>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <div className={styles.searchIcon}>🔍</div>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button
                className={styles.clearSearch}
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>

          <div className={styles.sortControls}>
            <label>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="popular">Most Popular</option>
              <option value="name">Name</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>

        <div className={styles.categoriesGrid}>
          {filteredCategories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>🔍</div>
            <h3>No categories found</h3>
            <p>Try adjusting your search terms</p>
            <button
              className={styles.resetButton}
              onClick={() => setSearchTerm("")}
            >
              Clear Search
            </button>
          </div>
        )}

        <div className={styles.featuredCategory}>
          <div className={styles.featuredContent}>
            <div className={styles.featuredText}>
              <div className={styles.featuredBadge}>Featured Category</div>
              <h3 className={styles.featuredTitle}>
                {filteredCategories[activeCategory]?.name ||
                  categories[activeCategory].name}
              </h3>
              <p className={styles.featuredDescription}>
                {filteredCategories[activeCategory]?.description ||
                  categories[activeCategory].description}
              </p>
              <div className={styles.featuredStats}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>
                    {filteredCategories[activeCategory]?.articleCount ||
                      categories[activeCategory].articleCount}
                  </span>
                  <span className={styles.statLabel}>Articles</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>
                    {Math.floor(
                      (filteredCategories[activeCategory]?.articleCount ||
                        categories[activeCategory].articleCount) * 2.3
                    )}
                  </span>
                  <span className={styles.statLabel}>Readers</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>
                    {filteredCategories[activeCategory]?.trending ? "🔥" : "📈"}
                  </span>
                  <span className={styles.statLabel}>
                    {filteredCategories[activeCategory]?.trending
                      ? "Trending"
                      : "Growing"}
                  </span>
                </div>
              </div>
              <button className={styles.exploreAllButton}>
                Explore All Articles
                <span className={styles.buttonArrow}>→</span>
              </button>
            </div>
            <div className={styles.featuredVisual}>
              <div
                className={styles.visualCircle}
                style={{
                  backgroundColor:
                    filteredCategories[activeCategory]?.color ||
                    categories[activeCategory].color,
                }}
              >
                <span className={styles.visualIcon}>
                  {filteredCategories[activeCategory]?.icon ||
                    categories[activeCategory].icon}
                </span>
              </div>
              <div className={styles.floatingElements}>
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className={styles.floatingElement}
                    style={{ animationDelay: `${item * 0.5}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
