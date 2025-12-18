// ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import api from "../api";

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [authorized, setAuthorized] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.post("/api/auth/refresh"); // пытаемся обновить токен
        setAuthorized(true);
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <p>Загрузка...</p>;

  return authorized ? <>{children}</> : <Navigate to="/admin" replace />;
};
