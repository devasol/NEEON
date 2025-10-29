import React from "react";
import styles from "./StatsCard.module.css";

const StatsCard = ({ title, value, change, icon }) => {
  // Map icon names to actual icons
  const getIcon = (iconName) => {
    const iconMap = {
      'file-alt': '📝',
      'comments': '💬',
      'users': '👥',
      'tag': '🏷️',
      'chart-pie': '📊',
      'eye': '👁️',
      'heart': '❤️',
      'calendar': '📅'
    };
    return iconMap[iconName] || '📊'; // Default to chart icon
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardLeft}>
        <div className={styles.cardIcon}>{getIcon(icon)}</div>
        <div className={styles.cardTitle}>{title}</div>
        <div className={styles.cardValue}>{value}</div>
      </div>
      <div className={styles.cardDelta}>{change}</div>
    </div>
  );
};

export default StatsCard;
