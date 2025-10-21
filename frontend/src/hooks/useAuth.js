import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Hook facade to the shared AuthContext
export default function useAuth() {
  return useContext(AuthContext);
}
