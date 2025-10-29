import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

// Hook facade to the shared AuthContext
export default function useAuth() {
  return useContext(AuthContext);
}
