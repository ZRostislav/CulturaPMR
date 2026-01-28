import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Pencil,
  CheckCircle2,
  X,
  UserPlus,
  ShieldCheck,
  Shield,
  Loader2,
} from "lucide-react";
import { authApi } from "../../components/services/auth.api";
import { Button } from "../../shared/ui/test/button";
import { Input } from "../../shared/ui/test/input";
import { Label } from "../../shared/ui/test/label";

type Admin = {
  id: number;
  username: string;
  role: "admin" | "super_admin";
  created_at: string;
};

export function AdministratorsSettings() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    isSuperAdmin: false,
  });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await authApi.getAll();
      setAdmins(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const openModal = (admin?: Admin) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        username: admin.username,
        password: "",
        confirmPassword: "",
        isSuperAdmin: admin.role === "super_admin",
      });
    } else {
      setEditingAdmin(null);
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        isSuperAdmin: false,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    setActionLoading(true);
    try {
      if (editingAdmin) {
        await authApi.update(editingAdmin.id, {
          username: formData.username,
          role: formData.isSuperAdmin ? "super_admin" : "admin",
          password: formData.password || undefined,
        });
      } else {
        await authApi.create(formData);
      }
      setShowModal(false);
      fetchAdmins();
    } catch (err: any) {
      alert(err.response?.data?.message || "Ошибка");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить администратора?")) return;
    try {
      await authApi.delete(id);
      fetchAdmins();
    } catch (err: any) {
      alert(err.response?.data?.message || "Ошибка");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-neutral-900)]/50 p-6 rounded-3xl border border-white/5 shadow-2xl">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Системные <span className="text-yellow-500">Администраторы</span>
          </h2>
          <p className="text-white/40 mt-1 text-sm">
            Управление уровнями доступа и учетными записями персонала
          </p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 px-6 rounded-xl transition-all active:scale-95"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Новый администратор
        </Button>
      </div>

      {/* Table Container */}
      <div className="bg-[var(--color-neutral-900)]/30 rounded-3xl border border-white/10 overflow-hidden shadow-xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">
                  Администратор
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">
                  Роль
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">
                  Дата регистрации
                </th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider text-right">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 text-yellow-500 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <motion.tr
                    key={admin.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center border border-white/10 text-white font-bold">
                          {admin.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-medium">
                            {admin.username}
                          </span>
                          <span className="text-[10px] text-white/30 uppercase tracking-tighter">
                            ID: {admin.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {admin.role === "super_admin" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                          <ShieldCheck size={14} /> Super Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                          <Shield size={14} /> Admin
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/50">
                      {new Date(admin.created_at).toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openModal(admin)}
                          className="h-9 w-9 p-0 rounded-lg hover:bg-yellow-500 hover:text-black transition-all"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(admin.id)}
                          className="h-9 w-9 p-0 rounded-lg hover:bg-red-500/20 hover:text-red-500 text-white/40"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[var(--color-neutral-900)] border border-white/10 p-8 rounded-[2rem] w-full max-w-md shadow-2xl shadow-black"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {editingAdmin ? "Редактирование" : "Новый доступ"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white/20 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label className="text-white/60 ml-1">
                    Логин администратора
                  </Label>
                  <Input
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                    className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-yellow-500/50"
                    placeholder="Например: alex_admin"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/60 ml-1">
                    Пароль{" "}
                    {editingAdmin && (
                      <span className="text-[10px] text-yellow-500/50 block opacity-50 font-normal mt-1">
                        (Оставьте пустым для сохранения текущего)
                      </span>
                    )}
                  </Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required={!editingAdmin}
                    className="bg-white/5 border-white/10 h-12 rounded-xl"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/60 ml-1">
                    Подтвердите пароль
                  </Label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required={!editingAdmin}
                    className="bg-white/5 border-white/10 h-12 rounded-xl"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <input
                    id="isSuperAdmin"
                    type="checkbox"
                    checked={formData.isSuperAdmin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isSuperAdmin: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded-md border-white/20 bg-transparent text-yellow-500 focus:ring-offset-0 focus:ring-yellow-500"
                  />
                  <Label htmlFor="isSuperAdmin" className="cursor-pointer">
                    <span className="block font-bold text-white">
                      Права Супер-админа
                    </span>
                    <span className="text-[10px] text-white/40 leading-none">
                      Полный доступ к системным настройкам
                    </span>
                  </Label>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1 h-12 rounded-xl text-white/50 hover:bg-white/5"
                    onClick={() => setShowModal(false)}
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 h-12 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                  >
                    {actionLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : editingAdmin ? (
                      "Сохранить"
                    ) : (
                      "Создать"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
