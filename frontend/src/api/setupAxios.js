import axios from 'axios';

const API_BASE_URL = "https://plantplanet.onrender.com";

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor to handle 403
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403) {
      // Clear auth data if token is invalid
      localStorage.removeItem('authToken');
      delete instance.defaults.headers.common['Authorization'];
      window.location.reload(); // Refresh to reset state
    }
    return Promise.reject(error);
  }
);

export default instance;