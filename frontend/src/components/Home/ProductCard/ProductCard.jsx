import React, { useState, useEffect } from "react";

import mobilePay from "./../../../assets/Images/MobilePay/mobilePay.jpg";
import styles from "./ProductCard.module.css";

const ProductCard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Animation trigger on component mount
    setIsVisible(true);

    // Cleanup animation on component unmount
    return () => setIsVisible(false);
  }, []);

  return (
    <section className={`${styles.banner} ${isVisible ? styles.visible : ""}`}>
      <div className={styles.content}>
        <div className={styles.left}>
          <div
            className={styles.imageContainer}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={mobilePay}
              alt="Phone"
              className={`${styles.phoneImage} ${
                isHovered ? styles.imageHover : ""
              }`}
            />
            <div
              className={`${styles.floatingIcons} ${
                isHovered ? styles.iconsVisible : ""
              }`}
            >
              <div className={styles.icon}>📷</div>
              <div className={styles.icon}>⚡</div>
              <div className={styles.icon}>🔋</div>
            </div>
          </div>
          <div className={styles.textBlock}>
            <h2 className={styles.brand}>Quaray</h2>
            <span className={styles.tag}>32 Megapixel Camera</span>
            <p className={styles.slogan}>
              Brilliant Picture in <span>Low Light</span>
            </p>
            <div className={styles.features}>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>✨</span>
                <span>Night Mode</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>🎥</span>
                <span>4K Video</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>📱</span>
                <span>6.7" Display</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.priceContainer}>
            <p className={styles.priceLabel}>Price Start Only</p>
            <h1 className={styles.price}>$1,999/-</h1>
            <div className={styles.discountBadge}>20% OFF</div>
          </div>
          <button className={styles.shopBtn}>
            <span>Shop Now</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className={styles.secureCheckout}>
            <span className={styles.lockIcon}>🔒</span>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Animated background elements */}
      <div className={styles.backgroundOrbs}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className={styles.orb3}></div>
      </div>
    </section>
  );
};

export default ProductCard;
