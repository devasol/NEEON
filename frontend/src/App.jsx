import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import GlobalImageLoader from "./components/GlobalImageLoader/GlobalImageLoader";
import CommentsPage from "./pages/Comments/CommentsPage";
import Login from "./components/Home/Login/Login";
import Signup from "./components/Home/Signup/Signup";
import FeaturesPage from "./pages/Features/FeaturesPage";
import ContactPage from "./pages/Contact/ContactPage";
import CategoriesPage from "./pages/Categories/CategoriesPage";

// load admin lazily to avoid adding routing library
const AdminDashboard = React.lazy(() => import("./pages/Admin/AdminDashboard"));

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/comments/*" element={<CommentsPage />} />
      <Route
        path="/admin"
        element={
          <React.Suspense
            fallback={<div style={{ padding: 20 }}>Loading admin...</div>}
          >
            <AdminDashboard />
          </React.Suspense>
        }
      />
    </Routes>
  );
}

export default App;
