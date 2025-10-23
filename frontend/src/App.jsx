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
      <Route path="/about" element={<div>About Us Page</div>} />
      <Route path="/services" element={<div>Services Page</div>} />
      <Route path="/blog" element={<div>Blog Page</div>} />
      <Route path="/faq" element={<div>FAQ Page</div>} />
      <Route path="/terms" element={<div>Terms of Service Page</div>} />
      <Route path="/privacy" element={<div>Privacy Policy Page</div>} />
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
