import React from "react";
import { FaFileAlt, FaComments, FaUsers, FaTag, FaChartPie, FaEye, FaHeart, FaCalendarAlt, FaChartLine, FaCommentsDollar } from 'react-icons/fa';
import styles from "./StatsCard.module.css";

const StatsCard = ({ title, value, change, icon }) => {
  // Map icon names to React Icons
  const getIcon = (iconName) => {
    const iconMap = {
      'file-alt': <FaFileAlt size={32} className={styles.statsIcon} />,
      'comments': <FaComments size={32} className={styles.statsIcon} />,
      'users': <FaUsers size={32} className={styles.statsIcon} />,
      'tag': <FaTag size={32} className={styles.statsIcon} />,
      'chart-pie': <FaChartPie size={32} className={styles.statsIcon} />,
      'eye': <FaEye size={32} className={styles.statsIcon} />,
      'heart': <FaHeart size={32} className={styles.statsIcon} />,
      'calendar': <FaCalendarAlt size={32} className={styles.statsIcon} />,
      'chart-line': <FaChartLine size={32} className={styles.statsIcon} />,
      'comments-dollar': <FaCommentsDollar size={32} className={styles.statsIcon} />
    };
    return iconMap[iconName] || <FaChartPie size={32} className={styles.statsIcon} />; // Default to chart icon
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardLeft}>
        <div className={styles.cardIcon}>
          {getIcon(icon)}
        </div>
        <div className={styles.cardTitle}>{title}</div>
        <div className={styles.cardValue}>{value}</div>
      </div>
      <div className={styles.cardDelta}>{change}</div>
    </div>
  );
};

export default StatsCard;
