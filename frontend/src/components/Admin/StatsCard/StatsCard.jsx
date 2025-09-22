import React from "react";
import styles from "./StatsCard.module.css";

const StatsCard = ({ title, value, delta }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardLeft}>
        <div className={styles.cardTitle}>{title}</div>
        <div className={styles.cardValue}>{value}</div>
      </div>
      <div className={styles.cardDelta}>{delta}</div>
    </div>
  );
};

export default StatsCard;
