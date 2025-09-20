import React, { useState, useEffect } from "react";
import styles from "./Footer.module.css";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGoogle,
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
          <img src={logo} alt="cleaning" className={styles.newsletterImage} />
        </div>
        <div className={styles.newsRight}>
          <h2>
            Subscribe to our newsletter to get updates to our latest collections
          </h2>
          <p>
            Get 20% off on your first order just by subscribing to our
            newsletter
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
            <a href="#">here</a>.
          </p>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className={styles.footerContent}>
        {/* Left Side Logo & Social */}
        <div className={styles.brand}>
          <h3 className={styles.logo}>Stay Clean</h3>
          <p>
            We provide premium cleaning services that transform your space into
            a spotless sanctuary. Experience the difference of professional
            cleaning.
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
            <a href="#" aria-label="Google" className={styles.socialLink}>
              <FaGoogle />
              <span className={styles.tooltip}>Google</span>
            </a>
          </div>
        </div>

        {/* Links */}
        <div className={styles.links}>
          <div className={styles.linkColumn}>
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Services</a>
              </li>
              <li>
                <a href="#">Community</a>
              </li>
              <li>
                <a href="#">Testimonial</a>
              </li>
            </ul>
          </div>
          <div className={styles.linkColumn}>
            <h4>Support</h4>
            <ul>
              <li>
                <a href="#">Help Center</a>
              </li>
              <li>
                <a href="#">Tweet @ Us</a>
              </li>
              <li>
                <a href="#">Webians</a>
              </li>
              <li>
                <a href="#">Feedback</a>
              </li>
            </ul>
          </div>
          <div className={styles.linkColumn}>
            <h4>Links</h4>
            <ul>
              <li>
                <a href="#">Courses</a>
              </li>
              <li>
                <a href="#">Become Teacher</a>
              </li>
              <li>
                <a href="#">Service</a>
              </li>
              <li>
                <a href="#">All in One</a>
              </li>
            </ul>
          </div>
          <div className={styles.linkColumn}>
            <h4>Contact Us</h4>
            <ul>
              <li>
                <a href="tel:+9198765432154">📞 (91) 98765 4321 54</a>
              </li>
              <li>
                <a href="mailto:support@mail.com">📧 support@mail.com</a>
              </li>
              <li>📍 123 Clean Street, Sparkle City</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className={styles.bottom}>
        <p>
          © {new Date().getFullYear()} Copyright by CodedUI. All rights
          reserved. Made with <FaHeart className={styles.heartIcon} /> by Dawit
          S.
        </p>
        <div className={styles.bottomLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Legal</a>
          <a href="#">Site Map</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
