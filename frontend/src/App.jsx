import React from "react";
import HomePage from "./pages/HomePage/HomePage";

// load admin lazily to avoid adding routing library
const AdminDashboard = React.lazy(() => import("./pages/Admin/AdminDashboard"));

function App() {
  const path = typeof window !== "undefined" ? window.location.pathname : "/";

  if (path === "/admin") {
    return (
      <React.Suspense
        fallback={<div style={{ padding: 20 }}>Loading admin...</div>}
      >
        <AdminDashboard />
      </React.Suspense>
    );
  }

  return <HomePage />;
}

export default App;
