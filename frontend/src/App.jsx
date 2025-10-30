import React, { useState } from "react";
import { Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage/HomePage.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import PostsPage from "./pages/Posts/PostsPage.jsx";
import Contact from "./pages/Contact/ContactPage.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import ScrollToTop from "./components/Common/ScrollToTop/ScrollToTop.jsx";

function App() {
  const [selectedView, setSelectedView] = useState("dashboard");

  return (
    <ToastProvider>
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


