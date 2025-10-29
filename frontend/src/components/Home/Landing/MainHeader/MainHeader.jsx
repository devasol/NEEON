import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { NavLink, Link, useLocation } from "react-router-dom";
import logo from "./../../../../assets/Images/LogoImages/logo.png";
import styles from "./MainHeader.module.css";
import Login from "../../Login/Login";
import Signup from "../../Signup/Signup";
import useAuth from "../../../../hooks/useAuth";
import api from "../../../../utils/api";

function MainHeader() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isFeaturesHovered, setIsFeaturesHovered] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isCategoriesHovered, setIsCategoriesHovered] = useState(false);
  const [isPagesHovered, setIsPagesHovered] = useState(false);
  const headerRef = useRef(null);
  const loginIconRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;

      // Check if we're on the home page (has landing section) or other pages
      const isHomePage = location.pathname === '/' || 
        location.pathname === '/home';
      const isPostsPage = location.pathname === '/posts';
      
      if (isHomePage) {
        // For home page, use the original logic with landing page detection
        const landingPage =
          document.querySelector("section:first-of-type") ||
          document.querySelector(".landing-page") ||
          document.querySelector("#landing");

        if (landingPage) {
          const landingHeight = landingPage.offsetHeight;
          // Check if we've scrolled past the landing page
          setIsSticky(window.scrollY > landingHeight - 100);
        }
      } else if (isPostsPage) {
        // For the posts page, make header sticky after minimal scroll to match home page behavior
        setIsSticky(window.scrollY > 50);
      } else {
        // For other pages, make header sticky after minimal scroll
        setIsSticky(window.scrollY > 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  // Close modal on Escape and return focus to the login icon
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && showLogin) {
        setShowLogin(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showLogin]);

  // Listen for the custom event to open login modal
  useEffect(() => {
    const handleOpenLoginModal = () => {
      setShowLogin(true);
    };

    document.addEventListener('openLoginModal', handleOpenLoginModal);
    
    return () => {
      document.removeEventListener('openLoginModal', handleOpenLoginModal);
    };
  }, []);

  useEffect(() => {
    if (!showLogin && loginIconRef.current) {
      try {
        loginIconRef.current.focus();
      } catch {
        // ignore
      }
    }
  }, [showLogin]);

  // Prevent body scroll while either modal is open
  useEffect(() => {
    const original = document.body.style.overflow;
    if (showLogin || showSignup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = original;
    }
    return () => {
      document.body.style.overflow = original;
    };
  }, [showLogin, showSignup]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories", false); // Categories don't need auth
        if (response && response.data && response.data.data && response.data.data.categories) {
          setCategories(response.data.data.categories || []);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const { token, isAdmin, logout } = useAuth();

  const navItems = [
    { name: "Home", path: "/", hasDropdown: false },
    {
      name: "Features",
      path: "/features",
      hasDropdown: true,
      dropdown: [
        { name: "Responsive Design" },
        { name: "SEO Optimization" },
        { name: "User Authentication" },
        { name: "Admin Dashboard" },
        { name: "Commenting System" },
      ],
    },
    { name: "Categories", path: "#", hasDropdown: true },
    { name: "Posts/Blogs", path: "/posts", hasDropdown: false },
    { name: "Shop", path: "/shop", hasDropdown: false },
    { name: "Contact", path: "/contact", hasDropdown: false },
  ];

  return (
    <header
      ref={headerRef}
      className={`${styles.container} ${isSticky ? styles.sticky : ""}`}
    >
      <div className={styles.logoContainer}>
        <div className={styles.logoImg}>
          <img src={logo} alt="Website Logo" />
        </div>
        <div className={styles.titleAndDesc}>
          <span>NEEON</span>
          <span>Blog Site</span>
        </div>
      </div>

      {/* Mobile menu button (hamburger) */}
      <div className={styles.mobileMenuButton} onClick={toggleMenu}>
        <span className={isMenuOpen ? styles.bar1Open : styles.bar1}></span>
        <span className={isMenuOpen ? styles.bar2Open : styles.bar2}></span>
        <span className={isMenuOpen ? styles.bar3Open : styles.bar3}></span>
      </div>

      <nav
        className={`${styles.navigator} ${isMenuOpen ? styles.navOpen : ""}`}
      >
        {/* Close button in sidebar */}
        <div className={styles.closeButton} onClick={closeMenu}>
          <span></span>
          <span></span>
        </div>

        <ul>
          {navItems.map((item, index) => (
            <li
              key={index}
              onMouseEnter={() => {
                if (item.name === "Features") setIsFeaturesHovered(true);
                if (item.name === "Categories") setIsCategoriesHovered(true);
                if (item.name === "Pages") setIsPagesHovered(true);
              }}
              onMouseLeave={() => {
                if (item.name === "Features") setIsFeaturesHovered(false);
                if (item.name === "Categories") setIsCategoriesHovered(false);
                if (item.name === "Pages") setIsPagesHovered(false);
              }}
              className={`${item.hasDropdown ? styles.hasDropdown : ""} ${item.name === "Categories" ? styles.categories : ""}`}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? styles.activeLink : undefined
                }
              >
                {item.name}
              </NavLink>
              {(item.name === "Features" ||
                item.name === "Categories" ||
                item.name === "Pages") && (
                <i className="fa-solid fa-chevron-down"></i>
              )}
              {item.name === "Features" && isFeaturesHovered && (
                <div className={`${styles.dropdown} ${styles.dropdownOpen}`}>
                  <div className={styles.dropdownContent}>
                    {item.dropdown.map((dropdownItem, dropdownIndex) => (
                      <span key={dropdownIndex}>{dropdownItem.name}</span>
                    ))}
                  </div>
                </div>
              )}
              {item.name === "Categories" && isCategoriesHovered && (
                <div className={`${styles.dropdown} ${styles.dropdownOpen}`}>
                  <div className={styles.dropdownContent}>
                    {categories.map((category, categoryIndex) => (
                      <span key={categoryIndex}>{category.name}</span>
                    ))}
                  </div>
                </div>
              )}
              {item.name === "Pages" && isPagesHovered && (
                <div className={`${styles.dropdown} ${styles.dropdownOpen}`}>
                  <div className={styles.dropdownContent}>
                    {item.dropdown.map((dropdownItem, dropdownIndex) => (
                      <Link key={dropdownIndex} to={dropdownItem.path}>
                        {dropdownItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div
        className={`${styles.iconsWrapper} ${
          isMenuOpen ? styles.iconsOpen : ""
        }`}
      >
        <span>
          <i className="fa-solid fa-magnifying-glass"></i>
        </span>
        <span>
          <i className="fa-solid fa-cart-shopping"></i>
        </span>
        <span>
          <i className="fa-solid fa-bars-staggered"></i>
        </span>
        {isAdmin && (
          <button
            className={styles.loginButton}
            onClick={() => (window.location.href = "/admin")}
            aria-label="Admin"
            title="Admin"
          >
            <i className="fa-solid fa-gauge"></i>
            Admin
          </button>
        )}
        {token ? (
          <button
            className={styles.logoutButton}
            onClick={() => setShowLogoutConfirm(true)}
            aria-label="Logout"
            title="Logout"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            Logout
          </button>
        ) : (
          <button
            ref={loginIconRef}
            className={styles.loginButton}
            aria-label="Login"
            title="Login"
            onClick={() => setShowLogin(true)}
          >
            <i className="fa-solid fa-right-to-bracket"></i>
            Login
          </button>
        )}
      </div>
      {showLogoutConfirm &&
        createPortal(
          <div
            className={styles.confirmOverlay}
            role="dialog"
            aria-modal="true"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <div
              className={styles.confirmModal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.confirmHeader}>
                <span>Confirm Logout</span>
                <button
                  className={styles.confirmClose}
                  aria-label="Close"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  ×
                </button>
              </div>
              <div className={styles.confirmBody}>
                <p>Are you sure you want to log out?</p>
              </div>
              <div className={styles.confirmActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className={styles.confirmBtn}
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    logout();
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      {showLogin &&
        createPortal(
          <div
            className={styles.loginModalOverlay}
            onClick={() => setShowLogin(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className={`${styles.loginModal} embedded clean`}
              onClick={(e) => e.stopPropagation()}
            >
              <Login
                noContainer
                onClose={() => setShowLogin(false)}
                onSignupClick={() => {
                  setShowLogin(false);
                  setShowSignup(true);
                }}
              />
            </div>
          </div>,
          document.body
        )}

      {showSignup &&
        createPortal(
          <div
            className={styles.loginModalOverlay}
            onClick={() => setShowSignup(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className={`${styles.loginModal} embedded clean`}
              onClick={(e) => e.stopPropagation()}
            >
              <Signup
                noContainer
                onClose={() => setShowSignup(false)}
                onLoginClick={() => {
                  setShowSignup(false);
                  setShowLogin(true);
                }}
              />
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}

export default MainHeader;
