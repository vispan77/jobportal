import axios from "axios";

// This is used for all API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, 
  withCredentials: true, 
});

export default api;
