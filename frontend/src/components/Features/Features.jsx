import { useState, useEffect, useRef } from "react";
import styles from "./Features.module.css";

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const features = [
    {
      icon: "🚀",
      title: "Lightning Fast",
      description:
        "Experience blazing fast performance with optimized loading and seamless interactions.",
      color: "#6366f1",
    },
    {
      icon: "🎨",
      title: "Beautiful Design",
      description:
        "Stunning visuals and modern aesthetics that captivate your audience instantly.",
      color: "#ec4899",
    },
    {
      icon: "📱",
      title: "Fully Responsive",
      description:
        "Perfect experience across all devices from desktop to mobile screens.",
      color: "#10b981",
    },
    {
      icon: "⚡",
      title: "Smart Analytics",
      description:
        "Advanced insights and analytics to understand your audience better.",
      color: "#f59e0b",
    },
    {
      icon: "🔒",
      title: "Secure & Safe",
      description:
        "Enterprise-grade security to protect your data and privacy.",
      color: "#ef4444",
    },
    {
      icon: "🔄",
      title: "Auto Updates",
      description:
        "Always stay current with automatic updates and new features.",
      color: "#8b5cf6",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <section ref={sectionRef} className={styles.features}>
      <div className={`${styles.container} ${isVisible ? styles.visible : ""}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Amazing Features</h2>
          <p className={styles.subtitle}>
            Discover what makes our platform extraordinary and built for the
            future
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${styles.featureCard} ${
                index === activeFeature ? styles.active : ""
              }`}
              onMouseEnter={() => setActiveFeature(index)}
              style={{ "--accent-color": feature.color }}
            >
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>{feature.icon}</span>
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
              <div className={styles.hoverEffect}></div>
            </div>
          ))}
        </div>

        <div className={styles.showcase}>
          <div className={styles.showcaseContent}>
            <div className={styles.textContent}>
              <h3>{features[activeFeature].title}</h3>
              <p>{features[activeFeature].description}</p>
              <button className={styles.ctaButton}>Learn More</button>
            </div>
            <div className={styles.visual}>
              <div
                className={styles.visualElement}
                style={{ backgroundColor: features[activeFeature].color }}
              >
                <span>{features[activeFeature].icon}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
