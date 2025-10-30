import React from "react";
import styles from "./FirstHeader.module.css";
import logo from "./../../../../assets/Images/LogoImages/logo.png";

function FirstHeader() {
  const today = new Date();
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-us", options);

  return (
    <header className={styles.container}>
      <div className={styles.logoContainer}>
        <div className={styles.logoAndTitle}>
          <img src={logo} alt="NEEON Blog Logo" />
          <span>NEEON</span>
        </div>
        <div className={styles.description}>
          <span>
            Your trusted source for the latest news, insights, and trending topics
          </span>
        </div>
      </div>
      <div className={styles.linksContainer}>
        <span>
          <i className="fa-solid fa-calendar-days"></i>
        </span>
        <span>{formattedDate}</span>
        <span> | </span>
        <span>follow us</span>
        <span>
          <i className="fa-brands fa-facebook-f"></i>
        </span>
        <span>
          <i className="fa-brands fa-twitter"></i>
        </span>
        <span>
          <i className="fa-brands fa-instagram"></i>
        </span>
        <span>
          <i className="fa-brands fa-youtube"></i>
        </span>
      </div>
    </header>
  );
}

export default FirstHeader;
