import React, { useState, useEffect } from "react";
import styles from "./Footer.module.css";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPaperPlane,
  FaHeart,
} from "react-icons/fa";

import logo from "./../../../../assets/Images/LogoImages/logo.png";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation on component mount
    setIsVisible(true);

    return () => setIsVisible(false);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && !isSubscribed) {
      console.log("Subscribed with email:", email);
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setIsSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className={`${styles.footer} ${isVisible ? styles.visible : ""}`}>
      {/* Newsletter Section */}
      <div className={styles.newsletter}>
        <div className={styles.newsLeft}>
          <img src={logo} alt="NEEON Blog" className={styles.newsletterImage} />
        </div>
        <div className={styles.newsRight}>
          <h2>
            Subscribe to our newsletter to get updates to our latest blog posts
          </h2>
          <p>
            Stay informed with our latest articles, insights, and trending topics
          </p>
          <form onSubmit={handleSubscribe} className={styles.subscribeForm}>
            <div className={styles.subscribeBox}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.emailInput}
              />
              <button
                type="submit"
                className={`${styles.subscribeBtn} ${
                  isSubscribed ? styles.subscribed : ""
                }`}
                disabled={isSubscribed}
              >
                {isSubscribed ? (
                  <span className={styles.checkmark}>✓</span>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <FaPaperPlane className={styles.sendIcon} />
                  </>
                )}
              </button>
            </div>
          </form>
          <p className={styles.smallText}>
            You will be able to unsubscribe at any time. Read our privacy policy{" "}
            <a href="/privacy-policy">here</a>.
          </p>
        </div>
      </div>

      {}
      <div className={styles.footerContent}>
        {}
        <div className={styles.brand}>
          <h3 className={styles.logo}>NEEON</h3>
          <p>
            Your go-to destination for the latest news, insights, and stories. 
            Discover engaging content across various topics and stay updated with our blog.
          </p>
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Facebook" className={styles.socialLink}>
              <FaFacebookF />
              <span className={styles.tooltip}>Facebook</span>
            </a>
            <a href="#" aria-label="Twitter" className={styles.socialLink}>
              <FaTwitter />
              <span className={styles.tooltip}>Twitter</span>
            </a>
            <a href="#" aria-label="Instagram" className={styles.socialLink}>
              <FaInstagram />
              <span className={styles.tooltip}>Instagram</span>
            </a>
            <a href="#" aria-label="LinkedIn" className={styles.socialLink}>
              <FaLinkedinIn />
              <span className={styles.tooltip}>LinkedIn</span>
            </a>
            <a href="#" aria-label="YouTube" className={styles.socialLink}>
              <FaYoutube />
              <span className={styles.tooltip}>YouTube</span>
            </a>
          </div>
        </div>

        {}
        <div className={styles.links}>
          <div className={styles.linkColumn}>
            <h4>Company</h4>
            <ul>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/categories">Categories</a>
              </li>
              <li>
                <a href="/features">Features</a>
              </li>
            </ul>
          </div>
          <div className={styles.linkColumn}>
            <h4>Resources</h4>
            <ul>
              <li>
                <a href="/posts">Blog Posts</a>
              </li>
              <li>
                <a href="/help">Help Center</a>
              </li>
              <li>
                <a href="/community">Community</a>
              </li>
              <li>
                <a href="/feedback">Feedback</a>
              </li>
            </ul>
          </div>
          <div className={styles.linkColumn}>
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="/privacy-policy">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms-of-service">Terms of Service</a>
              </li>
              <li>
                <a href="/cookies-policy">Cookies Policy</a>
              </li>
              <li>
                <a href="/disclaimer">Disclaimer</a>
              </li>
            </ul>
          </div>
          <div className={styles.linkColumn}>
            <h4>Contact Us</h4>
            <ul>
              <li>
                <a href="tel:+1234567890">📞 +1 (234) 567-890</a>
              </li>
              <li>
                <a href="mailto:info@neeon.com">📧 info@neeon.com</a>
              </li>
              <li>📍 123 Digital Street, Tech City</li>
            </ul>
          </div>
        </div>
      </div>

      {}
      <div className={styles.bottom}>
        <p>
          © {new Date().getFullYear()} NEEON Blog. All rights reserved. Made with <FaHeart className={styles.heartIcon} /> by the NEEON Team
        </p>
        <div className={styles.bottomLinks}>
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-service">Terms of Use</a>
          <a href="/cookies-policy">Cookies</a>
          <a href="/sitemap">Site Map</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
