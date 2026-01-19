import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import api from "../../api/api";
import API_ROUTES from "../../api/apiRoutes";

// Типы
interface Event {
  id: number;
  title: string;
  description: string;
  image: string | null;
  ticket_link: string;
  created_at: string;
}

// Тип для отложенного действия
type PendingAction =
  | { type: "delete"; id: number; originalEvent: Event }
  | { type: "create"; formData: FormData; tempId: number }
  | { type: "update"; id: number; formData: FormData; originalEvent: Event };

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ticketLink, setTicketLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // === Undo
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null
  );
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // =========================
  // Загрузка событий
  // =========================
  const fetchEvents = async () => {
    if (pendingAction) return;
    try {
      setLoading(true);
      const { data } = await api.get<Event[]>(API_ROUTES.EVENTS.GET_ALL);
      setEvents(data);
    } catch (err) {
      console.error("Ошибка при загрузке событий:", err);
      setError("Не удалось загрузить события");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // =========================
  // Undo
  // =========================
  const startUndoTimer = (action: PendingAction) => {
    if (pendingAction) finalizeAction(pendingAction);

    setPendingAction(action);
    setCountdown(10);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          finalizeAction(action);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const finalizeAction = async (action: PendingAction) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPendingAction(null);

    try {
      if (action.type === "delete") {
        await api.delete(API_ROUTES.EVENTS.DELETE(action.id));
      } else if (action.type === "create") {
        await api.post(API_ROUTES.EVENTS.CREATE, action.formData);
        fetchEvents();
      } else if (action.type === "update") {
        await api.put(API_ROUTES.EVENTS.UPDATE(action.id), action.formData);
        fetchEvents();
      }
    } catch (err: any) {
      console.error(err);
      setError("Ошибка при выполнении действия");
      fetchEvents();
    }
  };

  const cancelAction = () => {
    if (!pendingAction) return;
    if (timerRef.current) clearInterval(timerRef.current);

    if (pendingAction.type === "delete") {
      setEvents((prev) => [...prev, pendingAction.originalEvent]);
    } else if (pendingAction.type === "create") {
      setEvents((prev) => prev.filter((e) => e.id !== pendingAction.tempId));
    } else if (pendingAction.type === "update") {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === pendingAction.id ? pendingAction.originalEvent : e
        )
      );
    }

    setPendingAction(null);
    setCountdown(0);
  };

  // =========================
  // Работа с изображением
  // =========================
  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleImageChange(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  // =========================
  // Создание / редактирование
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("ticket_link", ticketLink);
    if (imageFile) formData.append("image", imageFile);

    const tempEvent: Event = {
      id: editingEventId || Date.now(),
      title,
      description,
      ticket_link: ticketLink,
      image: imagePreview || null,
      created_at: new Date().toLocaleString("ru-RU"),
    };

    if (editingEventId) {
      const originalEvent = events.find((e) => e.id === editingEventId);
      if (!originalEvent) return;

      setEvents((prev) =>
        prev.map((e) => (e.id === editingEventId ? tempEvent : e))
      );

      startUndoTimer({
        type: "update",
        id: editingEventId,
        formData,
        originalEvent,
      });
    } else {
      setEvents((prev) => [...prev, tempEvent]);
      startUndoTimer({ type: "create", formData, tempId: tempEvent.id });
    }

    handleCancelEdit();
  };

  const handleEdit = (ev: Event) => {
    if (pendingAction) finalizeAction(pendingAction);

    setEditingEventId(ev.id);
    setTitle(ev.title);
    setDescription(ev.description);
    setTicketLink(ev.ticket_link);
    setImageFile(null);
    setImagePreview(
      ev.image ? `${import.meta.env.VITE_API_URL}${ev.image}` : null
    );

    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
    setTitle("");
    setDescription("");
    setTicketLink("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = (id: number) => {
    const eventToDelete = events.find((e) => e.id === id);
    if (!eventToDelete) return;

    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    startUndoTimer({ type: "delete", id, originalEvent: eventToDelete });
  };

  const getImageSrc = (ev: Event) => {
    if (!ev.image) return undefined;
    if (ev.image.startsWith("data:")) return ev.image;
    if (ev.image.startsWith("http")) return ev.image;
    return `${import.meta.env.VITE_API_URL}${ev.image}`;
  };

  return (
    <div
      ref={formRef}
      className="min-h-screen flex flex-col items-center bg-neutral-900 px-4 py-12 pt-24 space-y-8 overflow-x-hidden relative pb-32"
    >
      {/* === Форма === */}
      <div className="w-full max-w-6xl space-y-8">
        <AnimatePresence initial={false} mode="wait">
          <motion.form
            key={editingEventId ? "edit" : "create"}
            initial={{ x: editingEventId ? 2000 : -1800 }}
            animate={{ x: 0 }}
            exit={{ x: editingEventId ? -1800 : 2000 }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            onSubmit={handleSubmit}
            className="w-full p-8 rounded-2xl bg-neutral-950 border border-white/20 shadow-xl space-y-5"
          >
            <h2 className="text-white text-2xl font-bold text-center">
              {editingEventId ? "Редактировать событие" : "Создать событие"}
            </h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Заголовок"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={15} // Ограничение до 15 символов
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500 transition"
              />
              <textarea
                placeholder="Описание"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={50}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500 transition"
              />
              <input
                type="text"
                placeholder="Ссылка на билеты"
                value={ticketLink}
                onChange={(e) => setTicketLink(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500 transition"
              />
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById("imageInput")?.click()}
                className="w-full h-40 flex items-center justify-center border-2 border-dashed border-neutral-700 rounded-xl text-neutral-400 cursor-pointer bg-neutral-900 hover:border-yellow-500 transition"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <p>Перетащите изображение или кликните сюда</p>
                )}
                <input
                  id="imageInput"
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    handleImageChange(e.target.files?.[0] || null)
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="flex-1 px-8 py-3 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-lg font-medium shadow-lg shadow-yellow-500/20"
              >
                {editingEventId ? "Сохранить изменения" : "Создать событие"}
              </motion.button>
              {editingEventId && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 px-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition"
                >
                  Отменить
                </motion.button>
              )}
            </div>
          </motion.form>
        </AnimatePresence>

        {/* === Список событий === */}
        {loading && !events.length ? (
          <p className="text-white text-center">Загрузка...</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {events.map((ev) => (
                <motion.div
                  key={ev.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    transition: { duration: 0.2 },
                  }}
                  className="bg-neutral-950 p-4 rounded-2xl shadow-xl flex flex-col hover:scale-[1.02] transition duration-300 border border-neutral-800"
                >
                  {ev.image && (
                    <img
                      src={getImageSrc(ev)}
                      alt={ev.title}
                      className="rounded-2xl mb-4 object-cover h-48 w-full border border-neutral-700 bg-neutral-900"
                    />
                  )}
                  <h2 className="text-xl font-bold text-white mb-2">
                    {ev.title}
                  </h2>
                  <p className="text-neutral-300 mb-4 text-sm line-clamp-3">
                    {ev.description}
                  </p>
                  <div className="mt-auto space-y-3">
                    <a
                      href={ev.ticket_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-2 rounded-lg bg-white/5 hover:bg-white/10 text-yellow-400 text-sm transition font-medium"
                    >
                      Купить билет
                    </a>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(ev)}
                        className="flex-1 px-3 py-2 text-xs text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-600 transition"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => handleDelete(ev.id)}
                        className="flex-1 px-3 py-2 text-xs text-red-400 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-red-900/50 hover:bg-red-900/10 transition"
                      >
                        Удалить
                      </button>
                    </div>
                    <p className="text-[10px] text-neutral-600 text-center">
                      {new Date(ev.created_at).toLocaleString("ru-RU")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* === UNDO BAR === */}
      <AnimatePresence>
        {pendingAction && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-neutral-800 text-white px-6 py-4 rounded-xl shadow-2xl border border-neutral-700 min-w-[320px]"
          >
            <div className="flex flex-col">
              <span className="font-medium">
                {pendingAction.type === "delete"
                  ? "Событие удалено"
                  : pendingAction.type === "create"
                  ? "Событие создано"
                  : "Событие обновлено"}
              </span>
              <span className="text-xs text-neutral-400">
                Действие применится через {countdown} сек...
              </span>
            </div>

            <div className="flex gap-3 ml-auto">
              <button
                onClick={cancelAction}
                className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition text-sm"
              >
                Отменить
              </button>
              <button
                onClick={() => finalizeAction(pendingAction)}
                className="px-3 py-2 bg-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-600 transition text-sm"
              >
                OK
              </button>
            </div>

            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 10, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-yellow-500/50 rounded-b-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
