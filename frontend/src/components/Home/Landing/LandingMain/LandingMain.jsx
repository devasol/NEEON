import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { API_BASE } from "../../../../utils/api";
import styles from "./LandingMain.module.css";
import PostActions from "../../../../components/Common/PostActions/PostActions";

function LandingMain() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [mainPost, setMainPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/v1/blogs/public?limit=4`);
        const data = await response.json();

        if (data.status === "success" && data.blogs && data.blogs.allBlogs) {
          const staticImages = [
            "/postsImg/photo-1421789665209-c9b2a435e3dc.avif",
            "/postsImg/photo-1445307806294-bff7f67ff225.avif",
            "/postsImg/photo-1445633743309-b60418bedbf2.avif",
            "/postsImg/photo-1470071459604-3b5ec3a7fe05.avif",
            "/postsImg/photo-1474511320723-9a56873867b5.avif",
            "/postsImg/photo-1486312338219-ce68d2c6f44d.avif",
            "/postsImg/photo-1497206365907-f5e630693df0.avif",
            "/postsImg/photo-1500622944204-b135684e99fd.avif",
            "/postsImg/photo-1506744038136-46273834b3fb.avif",
            "/postsImg/photo-1518770660439-4636190af475.avif",
            "/postsImg/photo-1528154291023-a6525fabe5b4.avif",
            "/postsImg/photo-1529333166437-7750a6dd5a70.avif",
            "/postsImg/photo-1572705824045-3dd0c9a47945.avif",
            "/postsImg/photo-1649972904349-6e44c42644a7.avif",
          ];

          const transformedPosts = data.blogs.allBlogs.map((post, index) => ({
            id: post._id,
            type: post.category || "Uncategorized",
            img: staticImages[index % staticImages.length],
            title: post.newsTitle,
            by: post.postedBy || "Admin",
            date: new Date(post.datePosted)
              .toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
              .toUpperCase(),
            content: post.newsDescription,
            likes: post.likes || 0,
            comments: post.comments || 0,
          }));

          if (transformedPosts.length > 0) {
            setMainPost(transformedPosts[0]);
            setItems(transformedPosts.slice(1));
          }
        } else {
          setItems([]);
          setMainPost(null);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        const fallbackImages = [
          "/postsImg/photo-1421789665209-c9b2a435e3dc.avif",
          "/postsImg/photo-1445307806294-bff7f67ff225.avif",
          "/postsImg/photo-1445633743309-b60418bedbf2.avif",
          "/postsImg/photo-1470071459604-3b5ec3a7fe05.avif",
        ];

        const fallbackPosts = [
          {
            id: "fallback-1",
            type: "Technology",
            img: fallbackImages[0],
            title: "Latest Technology Trends",
            by: "Admin",
            date: new Date()
              .toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
              .toUpperCase(),
            content:
              "Discover the latest trends in technology that are shaping our future.",
            likes: 0,
            comments: 0,
          },
          // ... other fallback posts
        ];

        setMainPost(fallbackPosts[0]);
        setItems(fallbackPosts.slice(1));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleReadMore = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    document.body.style.overflow = "unset";
  };

  return (
    <>
      <main className={styles.container}>
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper}>
            {mainPost ? (
              <>
                <img
                  src={mainPost.img}
                  alt={mainPost.title}
                  className={styles.img}
                />
                <div className={styles.imageOverlay}></div>
                <h1 className={styles.mainTitle}>{mainPost.title}</h1>
                <div className={styles.imageFooter}>
                  <span className={styles.imageAuthor}>By {mainPost.by}</span>
                  <span className={styles.imageDate}>
                    <i className="fa-solid fa-calendar-days"></i>{" "}
                    {mainPost.date}
                  </span>
                </div>
              </>
            ) : (
              <>
                <img
                  src="/postsImg/photo-1421789665209-c9b2a435e3dc.avif"
                  alt="Placeholder"
                  className={styles.img}
                />
                <div className={styles.imageOverlay}></div>
                <h1 className={styles.mainTitle}>Loading main post...</h1>
                <div className={styles.imageFooter}>
                  <span className={styles.imageAuthor}>By Admin</span>
                  <span className={styles.imageDate}>
                    <i className="fa-solid fa-calendar-days"></i> LOADING...
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.items}>
          {loading ? (
            <div className={styles.loading}>Loading posts...</div>
          ) : items.length > 0 ? (
            items.map((item, index) => (
              <div
                key={item.id || index}
                className={`${styles.item} ${
                  hoveredItem === index ? styles.itemHovered : ""
                }`}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.itemImage}>
                  <img src={item.img} alt={item.type} />
                  <span className={styles.itemType}>{item.type}</span>
                  <div className={styles.itemOverlay}></div>
                </div>
                <div className={styles.itemContent}>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <div className={styles.itemMeta}>
                    <span className={styles.itemBy}>By {item.by}</span>
                    <span className={styles.itemDate}>
                      <i className="fa-solid fa-calendar-days"></i> {item.date}
                    </span>
                  </div>
                  <PostActions
                    postId={item.id}
                    postTitle={item.title}
                    initialLikes={item.likes || 0}
                    initialComments={item.comments || 0}
                  />
                  <button
                    className={styles.readMoreBtn}
                    onClick={() => handleReadMore(item)}
                  >
                    Read More
                    <svg
                      width="16"
                      height="16"
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
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noPosts}>
              No posts available at the moment.
            </div>
          )}
        </div>
      </main>

      {/* Read More Modal */}
      {isModalOpen &&
        selectedItem &&
        createPortal(
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeButton} onClick={closeModal}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className={styles.modalImage}>
                <img src={selectedItem.img} alt={selectedItem.type} />
                <span className={styles.modalType}>{selectedItem.type}</span>
              </div>
              <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>{selectedItem.title}</h2>
                <div className={styles.modalMeta}>
                  <span className={styles.modalBy}>By {selectedItem.by}</span>
                  <span className={styles.modalDate}>
                    <i className="fa-solid fa-calendar-days"></i>{" "}
                    {selectedItem.date}
                  </span>
                </div>
                <PostActions
                  postId={selectedItem.id}
                  postTitle={selectedItem.title}
                  initialLikes={selectedItem.likes || 0}
                  initialComments={selectedItem.comments || 0}
                />
                <div className={styles.modalText}>
                  <p>{selectedItem.content}</p>
                </div>
                <button className={styles.modalCloseBtn} onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

    </>
  );
}

export default LandingMain;
