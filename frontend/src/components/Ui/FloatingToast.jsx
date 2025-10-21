import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './FloatingToast.module.css';

const FloatingToast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return createPortal(
    <div className={`${styles.toastContainer} ${styles[type]} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.toastContent}>
        {type === 'error' && <i className="fa-solid fa-circle-exclamation"></i>}
        {type === 'success' && <i className="fa-solid fa-circle-check"></i>}
        {type === 'info' && <i className="fa-solid fa-circle-info"></i>}
        <span>{message}</span>
      </div>
    </div>,
    document.body
  );
};

export default FloatingToast;
