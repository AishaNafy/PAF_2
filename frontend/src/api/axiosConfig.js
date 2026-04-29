import axios from 'axios';

const api = axios.create({
  baseURL: 'https://it3030-paf-2026-smart-campus-group-100-wie6.onrender.com', // Backend base URL
  withCredentials: true
});

export default api;
