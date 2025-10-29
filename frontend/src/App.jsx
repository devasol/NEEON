import React, { useState } from "react";
import { Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage/HomePage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLayout from "./pages/Admin/AdminLayout";
import PostsPage from "./pages/Posts/PostsPage";

function App() {
  const [selectedView, setSelectedView] = useState("dashboard");

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/posts" element={<PostsPage />} />
      <Route
        path="/admin"
        element={
          <AdminLayout selectedView={selectedView} setSelectedView={setSelectedView}>
            <AdminDashboard selectedView={selectedView} setSelectedView={setSelectedView} />
          </AdminLayout>
        }
      />
    </Routes>
  );
}

export default App;


