import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import API_ROUTES from "../apiRoutes";

export const AdminIndexRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 🔄 Пытаемся обновить accessToken через refresh
        await api.post(API_ROUTES.AUTH.REFRESH);
        // если refresh валиден — редирект на /admin/events
        navigate("/admin/events", { replace: true });
      } catch {
        // если нет токена или недействительный — остаёмся на странице логина
      }
    };

    checkAuth();
  }, [navigate]);

  return null;
};
