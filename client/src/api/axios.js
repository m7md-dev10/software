import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api/v1' : 'http://localhost:5001/api/v1',
  withCredentials: true
});

export default api; 