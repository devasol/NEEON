import React, { useState } from "react";
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from "./pages/HomePage/HomePage.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import PostsPage from "./pages/Posts/PostsPage.jsx";
import Contact from "./pages/Contact/ContactPage.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import ScrollToTop from "./components/Common/ScrollToTop/ScrollToTop.jsx";

// Component to handle page titles
function PageTitle() {
  const location = useLocation();
  
  React.useEffect(() => {
    const path = location.pathname;
    let title = "NEEON";
    
    switch(path) {
      case "/":
        title = "NEEON | Home";
        break;
      case "/posts":
        title = "NEEON | Posts";
        break;
      case "/contact":
        title = "NEEON | Contact";
        break;
      case "/admin":
        title = "NEEON | Admin Dashboard";
        break;
      default:
        // For any other routes, keep "NEEON" as the base title
        title = "NEEON";
        break;
    }
    
    document.title = title;
  }, [location]);
  
  return null;
}

function App() {
  const [selectedView, setSelectedView] = useState("dashboard");

  return (
    <ToastProvider>
      <PageTitle />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/admin"
          element={
            <AdminLayout selectedView={selectedView} setSelectedView={setSelectedView}>
              <AdminDashboard selectedView={selectedView} setSelectedView={setSelectedView} />
            </AdminLayout>
          }
        />
      </Routes>
    </ToastProvider>
  );
}

export default App;


