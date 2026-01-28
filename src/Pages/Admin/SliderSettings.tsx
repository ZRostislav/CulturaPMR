import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Trash2,
  Pencil,
  Save,
  Ticket,
  X,
  Upload,
  ExternalLink,
} from "lucide-react";
import { Button } from "../../shared/ui/test/button";
import { Input } from "../../shared/ui/test/input";
import { Label } from "../../shared/ui/test/label";
import { Textarea } from "../../shared/ui/test/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../shared/ui/test/card";
import {
  CreateEventPayload,
  EventDTO,
  eventShowcaseApi,
} from "../../components/services/eventShowcase.api";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface SliderSettingsProps {
  initialData?: EventDTO | null;
}

export function SliderSettings({ initialData }: SliderSettingsProps) {
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<EventDTO>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    eventShowcaseApi.getAll().then(setEvents);
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
      });
    }
  }, [initialData]);

  const resolveImageUrl = (path?: string | null): string | undefined => {
    if (!path) return undefined;
    if (path.startsWith("data:image")) return path;
    if (path.startsWith("http")) return path;

    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${API_URL}${normalized}`;
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      title: "Новый слайд",
      description: "Описание слайда",
      ticket_link: "",
      image: null,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await eventShowcaseApi.delete(id);
      setEvents(events.filter((event) => event.id !== id));

      if (editingId === id) {
        setEditingId(null);
        setFormData({});
      }
    } catch (e) {
      console.error("Ошибка удаления события", e);
    }
  };

  const handleEdit = (event: EventDTO) => {
    setEditingId(event.id);
    setFormData({
      title: event.title,
      description: event.description,
      ticket_link: event.ticket_link ?? "",
      image: event.image, // ← URL с сервера
    });
    setImageFile(null);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) return;

    const payload: CreateEventPayload = {
      title: formData.title,
      description: formData.description,
    };

    if (formData.ticket_link) {
      payload.ticket_link = formData.ticket_link;
    }

    // 🧠 ЛОГИКА ИЗОБРАЖЕНИЯ
    if (imageFile) {
      // 1️⃣ выбран новый файл
      payload.imageFile = imageFile;
    } else if (formData.image && !formData.image.startsWith("data:image")) {
      // 2️⃣ существующее изображение с сервера
      payload.imageUrl = formData.image;
    }
    // 3️⃣ если data:image и imageFile == null → ничего не шлём

    if (editingId === null) {
      await eventShowcaseApi.create(payload);
    } else {
      await eventShowcaseApi.update(editingId, payload);
    }

    setEditingId(null);
    setFormData({});
    setImageFile(null);
    setEvents(await eventShowcaseApi.getAll());
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Управление <span className="text-yellow-500">слайдера</span>
          </h2>
          <p className="text-white/60 mt-1">
            Управления слайдами, их создание настройка и удаления.
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-[var(--color-neutral-950)] font-bold shadow-lg shadow-yellow-500/20"
          >
            <Plus className=" h-4 w-4" />
            Добавить слайд
          </Button>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Events List */}
        <div className="xl:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {events.length > 0 ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {events.map((event) => {
                  return (
                    <motion.div
                      key={event.id}
                      variants={item}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -4 }}
                      className="relative"
                    >
                      <Card
                        className={`bg-[var(--color-neutral-900)] border-white/10 overflow-hidden transition-all ${
                          editingId === event.id
                            ? "ring-2 ring-yellow-500 shadow-lg shadow-yellow-500/10"
                            : "hover:border-white/20"
                        }`}
                      >
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row gap-6 p-6">
                            {/* Image Section */}
                            <div className="relative w-full md:w-64 h-44 flex-shrink-0">
                              <div className="w-full h-full rounded-2xl overflow-hidden bg-black shadow-2xl relative">
                                {event.image ? (
                                  <img
                                    src={resolveImageUrl(event.image)}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                                    <Ticket className="h-12 w-12 text-white/10" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 flex flex-col min-w-0">
                              <div className="mb-auto">
                                <div className="flex justify-between items-start gap-4 mb-3">
                                  <h3 className="text-2xl font-bold text-white tracking-tight truncate group-hover:text-yellow-500 transition-colors">
                                    {event.title}
                                  </h3>
                                  {event.ticket_link && (
                                    <a
                                      href={event.ticket_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-full transition-all"
                                      title="Перейти на сайт"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                  )}
                                </div>

                                <p className="text-white/50 text-sm line-clamp-2 mb-5 leading-relaxed">
                                  {event.description}
                                </p>
                              </div>

                              {/* Footer Actions */}
                              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(event)}
                                    className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                                  >
                                    <Pencil className="h-3.5 w-3.5 mr-2" />
                                    Редактировать
                                  </Button>
                                </motion.div>
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(event.id)}
                                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                                    Удалить
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              /* Empty State */
              <Card className="bg-transparent border-2 border-dashed border-white/5 p-20 text-center">
                <div className="flex flex-col items-center">
                  <div className="p-5 rounded-full bg-white/5 mb-4 shadow-inner">
                    <Ticket className="h-10 w-10 text-white/20" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Список пуст
                  </h3>
                  <p className="text-white/40 mb-6 max-w-[250px]">
                    Пора добавить первое крутое событие!
                  </p>
                  <Button
                    onClick={handleAdd}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Добавить
                  </Button>
                </div>
              </Card>
            )}
          </AnimatePresence>
        </div>

        {/* Edit Cards */}
        <div className="xl:sticky xl:top-6 h-fit">
          <AnimatePresence mode="wait">
            {formData.title ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-[var(--color-neutral-900)] border-white/10 shadow-xl overflow-hidden">
                  <CardHeader className="border-b border-white/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white">
                          Редактировать слайдер
                        </CardTitle>
                        <CardDescription className="text-white/50 text-xs">
                          ID: {editingId}
                        </CardDescription>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleCancel}
                        className="text-white/50 hover:text-white p-1"
                      >
                        <X className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5 p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {/* Основная инфа */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white text-xs uppercase tracking-wider opacity-60">
                          Название
                        </Label>
                        <Input
                          value={formData.title || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="mt-1.5 bg-[var(--color-neutral-950)] border-white/10 text-white focus:border-yellow-500/50"
                        />
                      </div>

                      <div>
                        <Label className="text-white text-xs uppercase tracking-wider opacity-60">
                          Описание
                        </Label>
                        <Textarea
                          value={formData.description || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          className="mt-1.5 bg-[var(--color-neutral-950)] border-white/10 text-white min-h-[100px] focus:border-yellow-500/50"
                        />
                      </div>
                    </div>

                    {/* Ссылка на покупку */}
                    <div>
                      <Label className="text-white text-xs uppercase tracking-wider opacity-60">
                        Ссылка на Покупку
                      </Label>
                      <Input
                        type="text"
                        value={formData.ticket_link || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ticket_link: e.target.value,
                          })
                        }
                        placeholder="https://biletpmr.com/concerts"
                        className="mt-1.5 bg-[var(--color-neutral-950)] border-white/10 text-white focus:border-yellow-500/50"
                      />
                    </div>

                    {/* Изображение */}
                    <div>
                      <Label className="text-white text-xs uppercase tracking-wider opacity-60">
                        Обложка
                      </Label>
                      <div
                        className="mt-2 relative aspect-video rounded-xl border-2 border-dashed border-white/5 bg-[var(--color-neutral-950)] overflow-hidden group cursor-pointer hover:border-yellow-500/30 transition-all"
                        onClick={() =>
                          document.getElementById("edit-upload")?.click()
                        }
                      >
                        {formData.image ? (
                          <img
                            src={resolveImageUrl(formData.image)}
                            alt={formData.title || "Preview"}
                            className="w-full h-full object-cover transition group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-white/20">
                            <Upload className="h-8 w-8 mb-2" />
                            <span className="text-[10px] uppercase tracking-tighter">
                              Загрузить изображение
                            </span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        id="edit-upload"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          setImageFile(file);

                          const reader = new FileReader();
                          reader.onload = () => {
                            setFormData((prev) => ({
                              ...prev,
                              image: reader.result as string, // 👈 превью
                            }));
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </div>

                    {/* Кнопки */}
                    <div className="flex gap-3 pt-6 border-t border-white/5">
                      <Button
                        onClick={handleSave}
                        className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-[var(--color-neutral-950)] font-bold shadow-lg shadow-yellow-500/10 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                      >
                        <Save className="mr-2 h-4 w-4" />{" "}
                        {editingId === null ? "Создать" : "Сохранить"}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5"
                      >
                        Отмена
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="bg-[var(--color-neutral-900)] border-white/10 border-dashed border-2">
                  <CardContent className="p-16 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Pencil className="h-8 w-8 text-white/20" />
                    </div>
                    <h3 className="text-white font-medium mb-2 text-lg">
                      Редактирование
                    </h3>
                    <p className="text-white/40 text-sm max-w-[200px] mx-auto">
                      Выберите слайд из списка слева, чтобы начать правку
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
