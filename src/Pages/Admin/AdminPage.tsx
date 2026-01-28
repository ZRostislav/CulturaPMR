import * as React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { AdminIndexRedirect } from "./AdminIndexRedirect";
import { authApi } from "../../components/services/auth.api";
import { Input } from "../../shared/ui/test/input";

export function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  AdminIndexRedirect();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await authApi.login({ username, password });
      navigate("/admin/controls");
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Ошибка при входе");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
      <motion.form
        onSubmit={submit}
        className="w-full max-w-md p-8 rounded-2xl bg-neutral-950 border border-white/20 shadow-xl space-y-5"
      >
        <h2 className="text-white mb-4 text-center text-xl">Вход</h2>

        {error && (
          <p className="text-red-500 text-sm text-center break-words">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border-white/10 focus:border-yellow-500/50 focus:ring-yellow-500/20 transition-all h-12 text-white"
          />
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border-white/10 focus:border-yellow-500/50 focus:ring-yellow-500/20 transition-all h-12 text-white"
          />
        </div>

        <motion.button
          type="submit"
          className="w-full px-8 py-3 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded-lg"
        >
          Войти
        </motion.button>
      </motion.form>
    </div>
  );
}
