// frontend/src/utils/api.js
const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

const api = {
  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};

export default api;
export { API_BASE };