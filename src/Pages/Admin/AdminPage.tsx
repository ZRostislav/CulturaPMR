import * as React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { AdminIndexRedirect } from "./AdminIndexRedirect";
import API_ROUTES from "../../api/apiRoutes";
import api from "../../api/api";

export function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  AdminIndexRedirect();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // вызываем login
      await api.post(API_ROUTES.AUTH.LOGIN, { username, password });
      navigate("/admin/controls");
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(`Ошибка: ${err.response.data.message}`);
      } else if (err.message) {
        setError(`Ошибка: ${err.message}`);
      } else {
        setError("Неизвестная ошибка при входе");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
      <motion.form
        {...fadeInUp}
        onSubmit={submit}
        className="
          w-full max-w-md 
          p-8 rounded-2xl 
          bg-neutral-950
          border border-white/20 
          shadow-xl
          space-y-5
        "
      >
        <h2 className="text-white mb-4 text-center text-xl">Вход</h2>

        {error && (
          <p className="text-red-500 text-sm text-center break-words">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="
              w-full px-4 py-3 
              bg-neutral-900 border border-neutral-800 
              rounded-lg text-white 
              placeholder:text-neutral-500 
              focus:outline-none focus:border-yellow-500 
              transition-all
            "
          />

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full px-4 py-3 
              bg-neutral-900 border border-neutral-800 
              rounded-lg text-white 
              placeholder:text-neutral-500 
              focus:outline-none focus:border-yellow-500 
              transition-all
            "
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className=" 
            w-full px-8 py-3 
            bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 
            text-white rounded-lg
          "
        >
          Войти
        </motion.button>
      </motion.form>
    </div>
  );
}
