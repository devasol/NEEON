import React, { useState } from "react";

import sports from "./../../../../assets/Images/CategoriesImg/sports.jpg";
import fasion from "./../../../../assets/Images/CategoriesImg/fasion.webp";
import travel from "./../../../../assets/Images/CategoriesImg/travel.jpg";
import health from "./../../../../assets/Images/CategoriesImg/health.jpeg";

import styles from "./Categories.module.css";

function Categories() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const categories = [
    {
      number: 1,
      img: sports,
      rel: "Sports",
      category: "sports",
      title: "Ducati 'has all the cards' to Win",
      date: "DECEMBER 9,2025",
    },
    {
      number: 2,
      img: travel,
      rel: "travel",
      category: "travel",
      title: "If You Want Round The World Which",
      date: "DECEMBER 9,2025",
    },
    {
      number: 3,
      img: fasion,
      rel: "fasion",
      category: "fasion",
      title: "The Best Way to Start a Motorsport",
      date: "DECEMBER 9,2025",
    },
    {
      number: 4,
      img: health,
      rel: "health",
      category: "health",
      title: "Moon They Landing How are Main Close",
      date: "DECEMBER 9,2025",
    },
  ];

  return (
    <section className={styles.container}>
      {categories.map((el, index) => {
        return (
          <div
            className={styles.card}
            key={index}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              transform:
                hoveredCard === index ? "translateY(-10px)" : "translateY(0)",
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <div className={styles.img}>
              <img src={el.img} alt={el.rel} className={styles.img} />
              <span className={styles.number}>{el.number}</span>
              <div className={styles.imageOverlay}></div>
            </div>
            <div className={styles.description}>
              <span className={styles.category}>{el.category}</span>
              <span className={styles.title}>{el.title}</span>
              <span className={styles.date}>
                <i className="fa-solid fa-calendar-days"></i> {el.date}
              </span>
              <div
                className={`${styles.hoverContent} ${
                  hoveredCard === index ? styles.hoverContentVisible : ""
                }`}
              >
                <button className={styles.readMoreBtn}>Read More →</button>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default Categories;
