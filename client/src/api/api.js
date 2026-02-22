// import axios from "axios";

// // This is used for all API calls
// const api = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URL, 
//   withCredentials: true, 
// });

// export default api;




import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, 
  withCredentials: true, 
});

// Interceptor to add the token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // We use the 'Authorization' header with the 'Bearer' scheme
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
