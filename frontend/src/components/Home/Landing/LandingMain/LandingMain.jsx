import React, { useState } from "react";
import { createPortal } from "react-dom";
import food from "./../../../../assets/Images/Items/food.webp";
import technology from "./../../../../assets/Images/Items/technology.jpg";
import travel from "./../../../../assets/Images/Items/travel.webp";
import styles from "./LandingMain.module.css";

function LandingMain() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items = [
    {
      type: "food",
      img: food,
      title: "Crafty Cook and Decorate all of our food dishes with love",
      by: "Admin",
      date: "DECEMBER 9,2025",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eu ultricies lacinia, nunc nisl aliquam nisl, eu aliquam nisl nunc eu nisl. Nullam auctor, nisl eu ultricies lacinia, nunc nisl aliquam nisl, eu aliquam nisl nunc eu nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eu ultricies lacinia, nunc nisl aliquam nisl, eu aliquam nisl nunc eu nisl.",
    },
    {
      type: "technology",
      img: technology,
      title: "African Nation Are Struggling To Save Their Wildlife",
      by: "Admin",
      date: "DECEMBER 9,2025",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eu ultricies lacinia, nunc nisl aliquam nisl, eu aliquam nisl nunc eu nisl. Nullam auctor, nisl eu ultricies lacinia, nunc nisl aliquam nisl, eu aliquam nisl nunc eu nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eu ultricies lacinia, nunc nisl aliquam nisl, eu aliquam nisl nunc eu nisl.",
    },
    {
      type: "travel",
      img: travel,
      title: "How to have fantastic trip without blowing your budget",
      by: "Admin",
      date: "DECEMBER 9,2025",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eu ultricies lacinia, nunc nisl aliquam nisl, eu aliquam nisl nunc eu nisl. Nullam auctor, nisl eu ultricies lacinia, nunc nisl aliquam nisl, eu aliquam nisl nunc eu nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eu ultricies lacinia, nunc nisl aliquam nisl, eu aliquam nisl nunc eu nisl.",
    },
  ];

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
            <img src={technology} alt="Budget Issues" className={styles.img} />
            <div className={styles.imageOverlay}></div>
            <h1 className={styles.mainTitle}>
              Budget Issues Force The Our To Be Cancelled
            </h1>
            <div className={styles.imageFooter}>
              <span className={styles.imageAuthor}>By Admin</span>
              <span className={styles.imageDate}>
                <i className="fa-solid fa-calendar-days"></i> DECEMBER 9,2025
              </span>
            </div>
          </div>
        </div>

        <div className={styles.items}>
          {items.map((item, index) => (
            <div
              key={index}
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
          ))}
        </div>
      </main>

      {/* Modal Popup rendered via portal */}
      {isModalOpen && selectedItem &&
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
                    <i className="fa-solid fa-calendar-days"></i> {selectedItem.date}
                  </span>
                </div>
                <div className={styles.modalText}>
                  <p>{selectedItem.content}</p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam auctor, nisl eu ultricies lacinia, nunc nisl aliquam
                    nisl, eu aliquam nisl nunc eu nisl. Nullam auctor, nisl eu
                    ultricies lacinia, nunc nisl aliquam nisl, eu aliquam nisl
                    nunc eu nisl.
                  </p>
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
