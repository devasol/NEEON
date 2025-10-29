// frontend/src/utils/api.js
const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const api = {
  post: async (endpoint, data, includeAuth = false) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (includeAuth) {
        const token = getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      
      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        // For successful responses, return the result directly
        // For error responses, the entire response is returned as an error object
        if (response.ok) {
          return result;
        } else {
          throw new Error(result.message || 'Request failed');
        }
      } else {
        // If not JSON, handle accordingly
        if (response.ok) {
          return { status: response.status, message: response.statusText };
        } else {
          throw new Error('Request failed');
        }
      }
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  },
  
  get: async (endpoint, includeAuth = false) => {
    try {
      const headers = {};
      
      if (includeAuth) {
        const token = getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers
      });
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        // For successful responses, return the result directly
        // For error responses, the entire response is returned as an error object
        if (response.ok) {
          return result;
        } else {
          throw new Error(result.message || 'Request failed');
        }
      } else {
        // If not JSON, handle accordingly
        if (response.ok) {
          return { status: response.status, message: response.statusText };
        } else {
          throw new Error('Request failed');
        }
      }
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  },
  
  put: async (endpoint, data, includeAuth = false) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (includeAuth) {
        const token = getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        // For successful responses, return the result directly
        // For error responses, the entire response is returned as an error object
        if (response.ok) {
          return result;
        } else {
          throw new Error(result.message || 'Request failed');
        }
      } else {
        // If not JSON, handle accordingly
        if (response.ok) {
          return { status: response.status, message: response.statusText };
        } else {
          throw new Error('Request failed');
        }
      }
    } catch (error) {
      console.error('API PUT error:', error);
      throw error;
    }
  },
  
  patch: async (endpoint, data, includeAuth = false) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (includeAuth) {
        const token = getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      });
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        // For successful responses, return the result directly
        // For error responses, the entire response is returned as an error object
        if (response.ok) {
          return result;
        } else {
          throw new Error(result.message || 'Request failed');
        }
      } else {
        // If not JSON, handle accordingly
        if (response.ok) {
          return { status: response.status, message: response.statusText };
        } else {
          throw new Error('Request failed');
        }
      }
    } catch (error) {
      console.error('API PATCH error:', error);
      throw error;
    }
  },
  
  delete: async (endpoint, includeAuth = false) => {
    try {
      const headers = {};
      
      if (includeAuth) {
        const token = getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'DELETE',
        headers
      });
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        // For successful responses, return the result directly
        // For error responses, the entire response is returned as an error object
        if (response.ok) {
          return result;
        } else {
          throw new Error(result.message || 'Request failed');
        }
      } else {
        // If not JSON, handle accordingly
        if (response.ok) {
          return { status: response.status, message: response.statusText };
        } else {
          throw new Error('Request failed');
        }
      }
    } catch (error) {
      console.error('API DELETE error:', error);
      throw error;
    }
  }
};

export default api;
export { API_BASE };