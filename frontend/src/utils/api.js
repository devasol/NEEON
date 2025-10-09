import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:9000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export { API_BASE };
export default api;
