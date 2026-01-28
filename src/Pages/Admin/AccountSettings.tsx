import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Save,
  Calendar,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  LogOut,
} from "lucide-react";
import { Button } from "../../shared/ui/test/button";
import { Input } from "../../shared/ui/test/input";
import { Label } from "../../shared/ui/test/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../shared/ui/test/card";
import { authApi } from "../../components/services/auth.api";
import { useNavigate } from "react-router-dom";

export function AccountSettings({ user }: { user: any }) {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const passwordErrors = {
    length: passwords.newPassword.length >= 8,
    upper: /[A-Z]/.test(passwords.newPassword),
    lower: /[a-z]/.test(passwords.newPassword),
    numbers: /[0-9]/.test(passwords.newPassword),
  };

  const strengthScore = Object.values(passwordErrors).filter(Boolean).length;
  const isPasswordValid =
    strengthScore === 4 && !/[^A-Za-z0-9]/.test(passwords.newPassword);
  const isMatch =
    passwords.newPassword === passwords.confirmPassword &&
    passwords.confirmPassword !== "";
  const canSubmit =
    passwords.oldPassword.length > 0 && isPasswordValid && isMatch;

  const handleChangePassword = async () => {
    if (!canSubmit || loading) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authApi.changePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword,
      });

      setSuccess("Пароль успешно изменён");

      // очистим форму
      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Ошибка при смене пароля");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error);
    } finally {
      // localStorage.removeItem("accessToken");
      navigate("/admin");
    }
  };

  return (
    <div className="relative w-full p-6 space-y-8">
      {/* Мягкое фоновое свечение */}
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-10"
      >
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Настройки <span className="text-yellow-500">профиля</span>
        </h2>
        <p className="text-white/40 mt-1">
          Управление безопасностью и личными данными
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl relative z-10"
      >
        {/* Левая колонка: Инфо */}
        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          className="lg:col-span-4"
        >
          <Card className="bg-black/40 border-white/5 backdrop-blur-xl border-t-white/10 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-white/50 text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                <User className="h-4 w-4 text-yellow-500" /> Аккаунт
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 flex-grow">
              <div className="group">
                <Label className="text-white/30 text-[10px] uppercase font-bold tracking-widest transition-colors group-hover:text-yellow-500/50">
                  Логин
                </Label>
                <p className="text-white text-xl font-semibold tracking-tight">
                  {user?.username || "Guest"}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <Label className="text-white/30 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Дата регистрации
                </Label>
                <p className="text-white/70 text-sm mt-1">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            </CardContent>

            {/* Секция выхода */}
            <div className="p-6 pt-0 mt-auto">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-white/50 hover:text-red-500 transition-all duration-300 group"
              >
                <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-xs uppercase font-bold tracking-widest">
                  Выйти из системы
                </span>
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Правая колонка: Безопасность */}
        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          className="lg:col-span-8"
        >
          <Card className="bg-black/40 border-white/5 backdrop-blur-xl border-t-white/10 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="h-5 w-5 text-yellow-500" /> Безопасность
              </CardTitle>
              <CardDescription className="text-white/40">
                Измените пароль для защиты вашего аккаунта
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Текущий пароль */}
              <div className="space-y-2">
                <Label className="text-white/60 text-sm ml-1">
                  Текущий пароль
                </Label>
                <Input
                  type="password"
                  className="bg-white/5 border-white/10 focus:border-yellow-500/50 focus:ring-yellow-500/20 transition-all h-12 text-white"
                  value={passwords.oldPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, oldPassword: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Новый пароль */}
                <div className="space-y-3">
                  <Label className="text-white/60 text-sm ml-1">
                    Новый пароль
                  </Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="bg-white/5 border-white/10 focus:border-yellow-500/50 focus:ring-yellow-500/20 transition-all h-12 text-white"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                  />

                  {/* Динамические подсказки */}
                  <AnimatePresence>
                    {(isFocused || passwords.newPassword.length > 0) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-2">
                          <PasswordCriterion
                            met={passwordErrors.length}
                            text="Минимум 8 символов"
                          />
                          <PasswordCriterion
                            met={passwordErrors.upper}
                            text="Заглавная буква"
                          />
                          <PasswordCriterion
                            met={passwordErrors.lower}
                            text="Строчная буква"
                          />
                          <PasswordCriterion
                            met={passwordErrors.numbers}
                            text="Цифры"
                          />

                          {/* Шкала сложности */}
                          <div className="h-1 w-full bg-white/10 rounded-full mt-3 overflow-hidden">
                            <motion.div
                              className={`h-full ${strengthScore <= 2 ? "bg-red-500" : strengthScore === 3 ? "bg-yellow-500" : "bg-green-500"}`}
                              animate={{
                                width: `${(strengthScore / 4) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Подтверждение */}
                <div className="space-y-3">
                  <Label className="text-white/60 text-sm ml-1">
                    Подтверждение
                  </Label>
                  <div className="relative">
                    <Input
                      type="password"
                      className={`bg-white/5 border-white/10 focus:border-yellow-500/50 focus:ring-yellow-500/20 transition-all h-12 text-white pr-10 ${
                        passwords.confirmPassword &&
                        (isMatch ? "border-green-500/30" : "border-red-500/30")
                      }`}
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {passwords.confirmPassword &&
                        (isMatch ? (
                          <ShieldCheck className="text-green-500 h-5 w-5" />
                        ) : (
                          <AlertCircle className="text-red-400 h-5 w-5" />
                        ))}
                    </div>
                  </div>
                  {passwords.confirmPassword && !isMatch && (
                    <p className="text-[10px] text-red-400 ml-1 uppercase font-bold tracking-tighter">
                      Пароли не совпадают
                    </p>
                  )}
                </div>
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-400 text-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-green-400 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {success}
                </motion.div>
              )}
              <div className=" pb-6">
                <Button
                  disabled={!canSubmit || loading}
                  onClick={handleChangePassword}
                  className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-black font-bold h-12 px-10 rounded-xl transition-all disabled:opacity-20 disabled:grayscale shadow-xl shadow-yellow-500/20 active:scale-95"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Сохранение..." : "Сохранить изменения"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Вспомогательный компонент для критериев
function PasswordCriterion({ met, text }: { met: boolean; text: string }) {
  return (
    <div
      className={`flex items-center gap-2 text-[11px] transition-colors ${met ? "text-green-400" : "text-white/30"}`}
    >
      {met ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <XCircle className="h-3 w-3 opacity-50" />
      )}
      {text}
    </div>
  );
}
