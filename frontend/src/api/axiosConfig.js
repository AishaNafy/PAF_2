import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-backend.onrender.com', // Backend base URL
  withCredentials: true
});

export default api;
