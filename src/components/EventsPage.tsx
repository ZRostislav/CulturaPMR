import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "./services/events.api.ts";

interface Event {
  id: number;
  title: string;
  description: string;
  image: string | null;
  ticket_link: string;
  created_at: string;
}

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

  /* =========================
     Загрузка событий
  ========================= */
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error("Ошибка при загрузке событий:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  /* =========================
     Работа с изображением
  ========================= */
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
    if (e.dataTransfer.files?.[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  /* =========================
     Создание / редактирование
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("ticket_link", ticketLink);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editingEventId) {
        await updateEvent(editingEventId, formData);
      } else {
        await createEvent(formData);
      }

      handleCancelEdit();
      fetchEvents();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Ошибка при сохранении события");
    }
  };

  /* =========================
     Редактирование
  ========================= */
  const handleEdit = (ev: Event) => {
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

  /* =========================
     Удаление
  ========================= */
  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить событие?")) return;

    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении события");
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div
      ref={formRef}
      className="min-h-screen flex flex-col items-center bg-neutral-900 px-4 py-12 pt-24 space-y-8 overflow-x-hidden"
    >
      <div className="w-full max-w-6xl space-y-8">
        {/* Форма */}
        <div className="relative w-full">
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
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500 transition"
                />

                <textarea
                  placeholder="Описание"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
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
                  className="flex-1 px-8 py-3 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-lg"
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
        </div>

        {/* Список */}
        {loading ? (
          <p className="text-white text-center">Загрузка...</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {events.map((ev) => (
              <motion.div
                key={ev.id}
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.35 }}
                className="bg-neutral-950 p-4 rounded-2xl shadow-xl flex flex-col hover:scale-105 transition"
              >
                {ev.image && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${ev.image}`}
                    alt={ev.title}
                    className="rounded-2xl mb-4 object-cover h-48 w-full border border-neutral-700"
                  />
                )}

                <h2 className="text-xl font-bold text-white mb-2">
                  {ev.title}
                </h2>
                <p className="text-white mb-2">{ev.description}</p>

                <a
                  href={ev.ticket_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto text-yellow-400 hover:underline"
                >
                  Купить билет
                </a>

                <p className="text-xs text-neutral-400 mt-2">
                  {new Date(ev.created_at).toLocaleString()}
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(ev)}
                    className="flex-1 px-3 py-1 text-xs text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="flex-1 px-3 py-1 text-xs text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition"
                  >
                    Удалить
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
