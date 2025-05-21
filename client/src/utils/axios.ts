import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with custom config
const instance = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    
    // Handle specific error cases
    switch (error.response?.status) {
      case 401:
        // Unauthorized - redirect to login
        window.location.href = '/login';
        break;
      case 403:
        // Forbidden - redirect to unauthorized page
        window.location.href = '/unauthorized';
        break;
      default:
        // Show error message
        toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default instance; 