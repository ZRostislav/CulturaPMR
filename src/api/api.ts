// api/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshQueue: (() => void)[] = [];

const runQueue = () => {
  refreshQueue.forEach((cb) => cb());
  refreshQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push(() => resolve(api(originalRequest)));
        });
      }

      isRefreshing = true;

      try {
        // ❗ ВАЖНО: хардкод тут допустим
        await api.post("/api/auth/refresh");
        runQueue();
        return api(originalRequest);
      } catch {
        window.location.href = "/";
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
