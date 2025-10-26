import React, { useState, useEffect } from 'react';
import Header from '../../components/Admin/Header/Header';
import Sidebar from '../../components/Admin/Sidebar/Sidebar';
import styles from './AdminLayout.module.css';

const AdminLayout = ({ children, selectedView, setSelectedView }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 900);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSetSelectedView = (view) => {
    setSelectedView(view);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={styles.adminLayout}>
      {isMobile && isSidebarOpen && <div className={styles.sidebarOverlay} onClick={toggleSidebar}></div>}
      <Sidebar isSidebarOpen={isSidebarOpen} selectedView={selectedView} setSelectedView={handleSetSelectedView} />
      <div className={`${styles.mainContent} ${isSidebarOpen && !isMobile ? styles.shifted : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;