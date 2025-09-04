import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Example: http://localhost:4000/api
  withCredentials: true,
});

// Attach JWT from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // 🔹 match your LoginForm key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
