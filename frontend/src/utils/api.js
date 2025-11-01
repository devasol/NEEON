
const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const clearAuthToken = () => {
  localStorage.removeItem('token');
  
  
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
      
      
      if (response.status === 401 || response.status === 500) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          
          
          if (result.message && (result.message.includes('invalid signature') || 
                                result.message.includes('jwt malformed') ||
                                result.message.includes('invalid token') ||
                                result.message.includes('jwt expired') ||
                                result.message.includes('Please log in again') ||
                                result.message.includes('not logged in'))) {
            clearAuthToken();
            
          }
          
          throw new Error(result.message || 'Request failed');
        } else {
          throw new Error('Request failed');
        }
      }
      
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        
        
        if (response.ok) {
          return result;
        } else {
          throw new Error(result.message || 'Request failed');
        }
      } else {
        
        if (response.ok) {
          return { status: response.status, message: response.statusText };
        } else {
          throw new Error('Request failed');
        }
      }
    } catch (error) {
      console.error('API POST error:', error);
      
      if (error.message.includes('invalid signature') || 
          error.message.includes('jwt malformed') ||
          error.message.includes('invalid token') ||
          error.message.includes('jwt expired')) {
        clearAuthToken();
      }
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
      
      
      if (response.status === 401 || response.status === 500) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          
          
          if (result.message && (result.message.includes('invalid signature') || 
                                result.message.includes('jwt malformed') ||
                                result.message.includes('invalid token') ||
                                result.message.includes('jwt expired') ||
                                result.message.includes('Please log in again') ||
                                result.message.includes('not logged in'))) {
            clearAuthToken();
            
          }
          
          throw new Error(result.message || 'Request failed');
        } else {
          throw new Error('Request failed');
        }
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        
        
        if (response.ok) {
          return result;
        } else {
          throw new Error(result.message || 'Request failed');
        }
      } else {
        
        if (response.ok) {
          return { status: response.status, message: response.statusText };
        } else {
          throw new Error('Request failed');
        }
      }
    } catch (error) {
      console.error('API GET error:', error);
      
      if (error.message.includes('invalid signature') || 
          error.message.includes('jwt malformed') ||
          error.message.includes('invalid token') ||
          error.message.includes('jwt expired')) {
        clearAuthToken();
      }
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
      
      
      if (response.status === 401 || response.status === 500) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          
          
          if (result.message && (result.message.includes('invalid signature') || 
                                result.message.includes('jwt malformed') ||
                                result.message.includes('invalid token') ||
                                result.message.includes('jwt expired') ||
                                result.message.includes('Please log in again') ||
                                result.message.includes('not logged in'))) {
            clearAuthToken();
            
          }
          
          throw new Error(result.message || 'Request failed');
        } else {
          throw new Error('Request failed');
        }
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        
        
        if (response.ok) {
          return result;
        } else {
          throw new Error(result.message || 'Request failed');
        }
      } else {
        
        if (response.ok) {
          return { status: response.status, message: response.statusText };
        } else {
          throw new Error('Request failed');
        }
      }
    } catch (error) {
      console.error('API PUT error:', error);
      
      if (error.message.includes('invalid signature') || 
          error.message.includes('jwt malformed') ||
          error.message.includes('invalid token') ||
          error.message.includes('jwt expired')) {
        clearAuthToken();
      }
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
      
      
      if (response.status === 401 || response.status === 500) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          
          
          if (result.message && (result.message.includes('invalid signature') || 
                                result.message.includes('jwt malformed') ||
                                result.message.includes('invalid token') ||
                                result.message.includes('jwt expired') ||
                                result.message.includes('Please log in again') ||
                                result.message.includes('not logged in'))) {
            clearAuthToken();
            
          }
          
          throw new Error(result.message || 'Request failed');
        } else {
          throw new Error('Request failed');
        }
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        
        
        if (response.ok) {
          return result;
        } else {
          throw new Error(result.message || 'Request failed');
        }
      } else {
        
        if (response.ok) {
          return { status: response.status, message: response.statusText };
        } else {
          throw new Error('Request failed');
        }
      }
    } catch (error) {
      console.error('API PATCH error:', error);
      
      if (error.message.includes('invalid signature') || 
          error.message.includes('jwt malformed') ||
          error.message.includes('invalid token') ||
          error.message.includes('jwt expired')) {
        clearAuthToken();
      }
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
      
      
      if (response.status === 401 || response.status === 500) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          
          
          if (result.message && (result.message.includes('invalid signature') || 
                                result.message.includes('jwt malformed') ||
                                result.message.includes('invalid token') ||
                                result.message.includes('jwt expired') ||
                                result.message.includes('Please log in again') ||
                                result.message.includes('not logged in'))) {
            clearAuthToken();
            
          }
          
          throw new Error(result.message || 'Request failed');
        } else {
          throw new Error('Request failed');
        }
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        
        
        if (response.ok) {
          return result;
        } else {
          throw new Error(result.message || 'Request failed');
        }
      } else {
        
        if (response.ok) {
          return { status: response.status, message: response.statusText };
        } else {
          throw new Error('Request failed');
        }
      }
    } catch (error) {
      console.error('API DELETE error:', error);
      
      if (error.message.includes('invalid signature') || 
          error.message.includes('jwt malformed') ||
          error.message.includes('invalid token') ||
          error.message.includes('jwt expired')) {
        clearAuthToken();
      }
      throw error;
    }
  }
};

export default api;
export { API_BASE };