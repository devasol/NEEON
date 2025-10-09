import { useAuthContext } from "../context/AuthContext";

// Hook facade to the shared AuthContext
export default function useAuth() {
  return useAuthContext();
}
