import React, { useState, useEffect, useRef } from "react";
import logo from "./../../../../assets/Images/LogoImages/logo.png";
import styles from "./MainHeader.module.css";
import Login from "../../Login/Login";

function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const headerRef = useRef(null);
  const loginIconRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;

      // Get the height of the landing page (first section)
      const landingPage =
        document.querySelector("section:first-of-type") ||
        document.querySelector(".landing-page") ||
        document.querySelector("#landing");

      // Default to viewport height if no specific landing page element is found
      const landingHeight = landingPage
        ? landingPage.offsetHeight
        : window.innerHeight;

      // Check if we've scrolled past the landing page
      setIsSticky(window.scrollY > landingHeight - 100);
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  useEffect(() => {
    if (!showLogin && loginIconRef.current) {
      try {
        loginIconRef.current.focus();
      } catch {
        // ignore
      }
    }
  }, [showLogin]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const navItems = [
    { name: "Home", hasDropdown: true },
    { name: "Features", hasDropdown: true },
    { name: "Categories", hasDropdown: true },
    { name: "Elements", hasDropdown: true },
    { name: "Pages", hasDropdown: true },
    { name: "Shop", hasDropdown: true },
    { name: "Contact", hasDropdown: false },
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
              onClick={() => item.hasDropdown && toggleDropdown(index)}
              className={item.hasDropdown ? styles.hasDropdown : ""}
            >
              {item.name}{" "}
              {item.hasDropdown && <i className="fa-solid fa-chevron-down"></i>}
              {item.hasDropdown && (
                <div
                  className={`${styles.dropdown} ${
                    activeDropdown === index ? styles.dropdownOpen : ""
                  }`}
                >
                  <div className={styles.dropdownContent}>
                    <a href="#">Option 1</a>
                    <a href="#">Option 2</a>
                    <a href="#">Option 3</a>
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
        <span
          ref={loginIconRef}
          className={styles.loginIcon}
          tabIndex={0}
          aria-label="Login"
          role="button"
          onClick={() => setShowLogin(true)}
          onKeyDown={(e) => e.key === "Enter" && setShowLogin(true)}
        >
          <i className="fa-solid fa-user"></i>
        </span>
      </div>
      {showLogin && (
        <div
          className={styles.loginModalOverlay}
          onClick={() => setShowLogin(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className={`${styles.loginModal} embedded clean`} onClick={(e) => e.stopPropagation()}>
            <Login noContainer onClose={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </header>
  );
}

export default MainHeader;
