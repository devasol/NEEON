import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { NavLink, Link, useLocation } from "react-router-dom";
import logo from "./../../../../assets/Images/LogoImages/logo.png";
import styles from "./MainHeader.module.css";
import Login from "../../Login/Login";
import Signup from "../../Signup/Signup";
import useAuth from "../../../../hooks/useAuth";
import api, { API_BASE } from "../../../../utils/api";
import ThemeToggle from "../../../Theme/ThemeToggle.jsx";

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
  const [isPagesHovered, setIsPagesHovered] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const headerRef = useRef(null);
  const loginIconRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;

      // Check if we're on the home page (has landing section) or other pages
      const isHomePage =
        location.pathname === "/" || location.pathname === "/home";
      const isPostsPage = location.pathname === "/posts";

      if (isHomePage) {
        const landingPage =
          document.querySelector("section:first-of-type") ||
          document.querySelector(".landing-page") ||
          document.querySelector("#landing");

        if (landingPage) {
          const landingHeight = landingPage.offsetHeight;

          setIsSticky(window.scrollY > landingHeight - 100);
        }
      } else if (isPostsPage) {
        setIsSticky(window.scrollY > 50);
      } else {
        setIsSticky(window.scrollY > 100);
      }
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

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
    const handleOpenLoginModal = () => {
      setShowLogin(true);
    };

    document.addEventListener("openLoginModal", handleOpenLoginModal);

    return () => {
      document.removeEventListener("openLoginModal", handleOpenLoginModal);
    };
  }, []);

  useEffect(() => {
    if (!showLogin && loginIconRef.current) {
      try {
        loginIconRef.current.focus();
      } catch {}
    }
  }, [showLogin]);

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
    const handleClickOutside = (event) => {
      const searchContainer = document.querySelector(
        `.${styles.searchContainer}`
      );
      const searchIcon = document.querySelector(`.${styles.desktopIcons} span`);

      if (
        isSearchOpen &&
        searchContainer &&
        !searchContainer.contains(event.target)
      ) {
        if (!searchIcon || !searchIcon.contains(event.target)) {
          const resultsContainer = document.querySelector(
            `.${styles.searchResults}`
          );
          if (!resultsContainer || !resultsContainer.contains(event.target)) {
            closeSearch();
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories", false);
        if (response) {
          if (response.categories) {
            setCategories(response.categories);
          } else if (response.data && response.data.categories) {
            setCategories(response.data.categories);
          } else if (Array.isArray(response)) {
            setCategories(response);
          } else {
            setCategories([]);
          }
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories from /api/categories:", error);

        try {
          const response = await api.get("/api/categories", false);
          if (response) {
            if (response.categories) {
              setCategories(response.categories);
            } else if (response.data && response.data.categories) {
              setCategories(response.data.categories);
            } else if (Array.isArray(response)) {
              setCategories(response);
            } else {
              const blogResponse = await api.get(
                "/api/v1/blogs/public?limit=100",
                false
              );
              if (
                blogResponse &&
                blogResponse.blogs &&
                blogResponse.blogs.allBlogs
              ) {
                const uniqueCategories = [
                  ...new Set(
                    blogResponse.blogs.allBlogs.map((blog) => blog.category)
                  ),
                ];
                const categoryObjects = uniqueCategories
                  .filter((cat) => cat)
                  .map((cat, index) => ({ name: cat, _id: `cat-${index}` }));
                setCategories(categoryObjects);
              } else {
                setCategories([]);
              }
            }
          }
        } catch (secondError) {
          console.error(
            "Error fetching categories from /api/categories:",
            secondError
          );

          try {
            const response = await fetch(`${API_BASE}/api/categories`);
            if (response.ok) {
              const data = await response.json();
              if (data.categories) {
                setCategories(data.categories);
              } else if (Array.isArray(data)) {
                setCategories(data);
              } else {
                setCategories([]);
              }
            }
          } catch (thirdError) {
            console.error(
              "All attempts to fetch categories failed:",
              thirdError
            );

            try {
              const blogResponse = await fetch(
                `${API_BASE}/api/v1/blogs/public?limit=100`
              );
              if (blogResponse.ok) {
                const blogData = await blogResponse.json();
                if (blogData.blogs && blogData.blogs.allBlogs) {
                  const uniqueCategories = [
                    ...new Set(
                      blogData.blogs.allBlogs.map((blog) => blog.category)
                    ),
                  ];
                  const categoryObjects = uniqueCategories
                    .filter((cat) => cat)
                    .map((cat, index) => ({ name: cat, _id: `cat-${index}` }));
                  setCategories(categoryObjects);
                } else {
                  setCategories([]);
                }
              } else {
                setCategories([]);
              }
            } catch (fourthError) {
              console.error(
                "Could not fetch categories from blogs either:",
                fourthError
              );
              setCategories([]);
            }
          }
        }
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        const response = await api.get(
          `/api/v1/blogs/search?q=${encodeURIComponent(searchQuery)}`,
          false
        );
        if (response && response.blogs && response.blogs.allBlogs) {
          setSearchResults(response.blogs.allBlogs);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);

        try {
          const allBlogsResponse = await api.get(
            "/api/v1/blogs/public?limit=100",
            false
          );
          if (
            allBlogsResponse &&
            allBlogsResponse.blogs &&
            allBlogsResponse.blogs.allBlogs
          ) {
            const filtered = allBlogsResponse.blogs.allBlogs.filter(
              (blog) =>
                blog.newsTitle
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                blog.newsDescription
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                blog.category?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(filtered);
          } else {
            setSearchResults([]);
          }
        } catch (fallbackError) {
          console.error("Fallback search also failed:", fallbackError);
          setSearchResults([]);
        }
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const [isCategoriesHovered, setIsCategoriesHovered] = useState(false);

  const navItems = [
    { name: "Home", path: "/", hasDropdown: false },
    {
      name: "Features",
      path: "#", // Changed to "#" to make it non-clickable
      hasDropdown: true,
      dropdown: [
        { name: "Responsive Design" },
        { name: "SEO Optimization" },
        { name: "User Authentication" },
        { name: "Admin Dashboard" },
        { name: "Commenting System" },
      ],
    },
    { name: "Categories", path: "#", hasDropdown: true }, // Changed to "#" and hasDropdown: true
    { name: "Posts/Blogs", path: "/posts", hasDropdown: false },
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

      {/* Mobile menu button (hamburger) - Always visible */}
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
              className={`${item.hasDropdown ? styles.hasDropdown : ""} ${
                item.name === "Categories" || item.name === "Features"
                  ? styles.noUnderline
                  : ""
              }`}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive && item.path !== "#" ? styles.activeLink : undefined
                }
                onClick={(e) => {
                  if (item.path === "#") {
                    e.preventDefault(); // Prevent navigation for "#" links
                  }
                  closeMenu();
                }}
              >
                {item.name}
              </NavLink>
              {(item.name === "Features" ||
                item.name === "Pages" ||
                item.name === "Categories") && (
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
                    {categories.map((category, catIndex) => (
                      <Link
                        key={catIndex}
                        to={`/categories/${category._id || category.name}`}
                        onClick={closeMenu}
                      >
                        {category.name}
                      </Link>
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

        {/* Mobile Icons Section - appears below navigation links in mobile menu */}
        <div className={styles.mobileIconsSection}>
          <div className={styles.mobileIconsWrapper}>
            {/* Mobile Search */}
            <div className={styles.mobileSearchSection}>
              {isSearchOpen ? (
                <div className={styles.searchContainer}>
                  <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search posts, articles, categories..."
                      className={styles.searchInput}
                      autoFocus
                    />
                    <button type="submit" className={styles.searchButton}>
                      <i className="fa-solid fa-search"></i>
                    </button>
                  </form>
                  <button
                    className={styles.closeSearchButton}
                    onClick={() => {
                      closeSearch();
                      closeMenu();
                    }}
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              ) : (
                <button
                  className={styles.mobileIconButton}
                  onClick={() => {
                    openSearch();
                  }}
                  title="Search"
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <span>Search</span>
                </button>
              )}
            </div>

            {/* Mobile Login/Logout Actions */}
            <div className={styles.mobileActionsWrapper}>
              {token ? (
                // User is logged in
                <div className={styles.userActions}>
                  {isAdmin && (
                    // Show admin button for admin users
                    <button
                      className={`${styles.loginButton} ${styles.mobileButton}`}
                      onClick={() => {
                        window.location.href = "/admin";
                        closeMenu();
                      }}
                      aria-label="Admin Dashboard"
                    >
                      <i className="fa-solid fa-gauge"></i>
                      <span>Admin</span>
                    </button>
                  )}
                  {/* Show logout button for all logged in users */}
                  <button
                    className={`${styles.logoutButton} ${styles.mobileButton}`}
                    onClick={() => {
                      setShowLogoutConfirm(true);
                      closeMenu();
                    }}
                    aria-label="Logout"
                  >
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                // No user is logged in: show login button
                <button
                  className={`${styles.loginButton} ${styles.mobileButton}`}
                  aria-label="Login"
                  onClick={() => {
                    setShowLogin(true);
                    closeMenu();
                  }}
                >
                  <i className="fa-solid fa-right-to-bracket"></i>
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Desktop Icons - Hidden on mobile */}
      <div className={styles.desktopIcons}>
        <div className={styles.iconsWrapper}>
          {isSearchOpen ? (
            <div className={styles.searchContainer}>
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts, articles, categories..."
                  className={styles.searchInput}
                  autoFocus
                />
                <button type="submit" className={styles.searchButton}>
                  <i className="fa-solid fa-search"></i>
                </button>
              </form>
              <button
                className={styles.closeSearchButton}
                onClick={closeSearch}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
          ) : (
            <span onClick={openSearch} title="Search">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
          )}
          <ThemeToggle />
          {token ? (
            // User is logged in
            <div className={styles.userActions}>
              {isAdmin && (
                // Show admin button for admin users
                <button
                  className={styles.loginButton}
                  onClick={() => {
                    window.location.href = "/admin";
                    closeMenu();
                  }}
                  aria-label="Admin Dashboard"
                  title="Admin Dashboard"
                >
                  <i className="fa-solid fa-gauge"></i>
                  Admin
                </button>
              )}
              {/* Show logout button for all logged in users */}
              <button
                className={styles.logoutButton}
                onClick={() => {
                  setShowLogoutConfirm(true);
                  closeMenu();
                }}
                aria-label="Logout"
                title="Logout"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                Logout
              </button>
            </div>
          ) : (
            // No user is logged in: show login button
            <button
              ref={loginIconRef}
              className={styles.loginButton}
              aria-label="Login"
              title="Login"
              onClick={() => {
                setShowLogin(true);
                closeMenu();
              }}
            >
              <i className="fa-solid fa-right-to-bracket"></i>
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Header Icons - Visible only on mobile screens */}
      <div className={styles.mobileHeaderIcons}>
        <ThemeToggle />
      </div>

      {/* Search Results */}
      {isSearchOpen && searchResults.length > 0 && (
        <div className={styles.searchResults}>
          <div className={styles.resultsContainer}>
            {searchResults.map((result) => (
              <a
                key={result._id}
                href={`/posts#${result._id}`}
                className={styles.resultItem}
                onClick={closeSearch}
              >
                <h4>{result.newsTitle}</h4>
                <p>
                  {result.newsDescription?.substring(0, 100) +
                    (result.newsDescription?.length > 100 ? "..." : "")}
                </p>
                <span className={styles.resultCategory}>{result.category}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {isSearchOpen &&
        searchQuery &&
        !isSearching &&
        searchResults.length === 0 && (
          <div className={styles.searchResults}>
            <div className={styles.resultsContainer}>
              <div className={styles.noResults}>
                No results found for "{searchQuery}"
              </div>
            </div>
          </div>
        )}
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
