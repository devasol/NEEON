import React, { useEffect } from "react";
import styles from "./Toast.module.css";

const Toast = ({ message = "", type = "success", onClose = () => {} }) => {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`${styles.toast} ${styles[type]}`} role="status">
      {message}
      <button className={styles.close} onClick={onClose} aria-label="Close">
        ×
      </button>
    </div>
  );
};

export default Toast;
