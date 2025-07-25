import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens or request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error responses
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please try again later.');
    } else if (error.response?.status >= 500) {
      console.error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timed out. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
