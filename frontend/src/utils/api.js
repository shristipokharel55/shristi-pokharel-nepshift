import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Important: This sends cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401, the user is not authenticated
    if (error.response?.status === 401) {
      // Clear any stored user data
      localStorage.removeItem("user");
      
      // Only redirect if not already on auth pages
      const authPages = ["/login", "/register", "/forgot-password", "/verify-otp", "/reset-password"];
      const currentPath = window.location.pathname;
      
      if (!authPages.some(page => currentPath.startsWith(page)) && currentPath !== "/") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
