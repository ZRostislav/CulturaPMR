import api from "../../api/api";

type LoginPayload = {
  username: string;
  password: string;
};

type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type CreatePayload = {
  username: string;
  password: string;
  confirmPassword: string;
  isSuperAdmin: boolean;
};

type UpdatePayload = {
  username?: string;
  role?: "admin" | "super_admin";
  password?: string;
};

export const authApi = {
  // ===== LOGIN =====
  login: (data: LoginPayload) => api.post("/api/auth/login", data),

  // ===== LOGOUT =====
  logout: () => api.post("/api/auth/logout"),

  // ===== ME =====
  me: () => api.get("/api/auth/me"),

  // ===== REFRESH =====
  refresh: () => api.post("/api/auth/refresh"),

  // ===== CHANGE PASSWORD =====
  changePassword: (data: ChangePasswordPayload) =>
    api.post("/api/auth/change-password", data),

  // ===== CREATE ADMIN =====
  create: (data: CreatePayload) => api.post("/api/auth", data),

  // ===== GET ALL ADMINS =====
  getAll: () => api.get("/api/auth"),

  // ===== DELETE ADMIN =====
  delete: (id: number) => api.delete(`/api/auth/${id}`),

  // ===== UPDATE ADMIN =====
  update: (id: number, data: UpdatePayload) => api.put(`/api/auth/${id}`, data),
};
