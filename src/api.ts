import axios from "axios";
import API_ROUTES from "./apiRoutes";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // fallback
});

// Автоматически добавляем Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api, API_ROUTES };
