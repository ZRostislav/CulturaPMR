import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Trash2,
  Pencil,
  Save,
  Calendar,
  MapPin,
  Ticket,
  Users,
  X,
  Upload,
  ExternalLink,
  FileSliders,
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
  eventsApi,
  CreateEventPayload,
} from "../../components/services/events.api";
import { setActiveSectionGlobal, setSliderDataGlobal } from "./ControlsPage";
import { EventDTO } from "../../components/services/eventShowcase.api";

interface Event {
  id: number;
  title: string;
  age: number;
  price: number;
  description: string;
  image: string;
  link: string;

  location: {
    city: string;
    venue: string;
    address: string;
  };

  schedule: {
    date: string;
    times: string[];
  }[];
}

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

type EventLocation = Event["location"];

export function EventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({});
  const [locationInput, setLocationInput] = useState("");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const openSlider = (event: Event) => {
    const dto: EventDTO = {
      id: event.id,
      title: event.title,
      description: event.description,
      image: event.image, // <- уже полный URL
      ticket_link: event.link || null,
      created_at: new Date().toISOString(),
    };

    console.log(dto);

    setSliderDataGlobal?.(dto);
    setActiveSectionGlobal?.("slider");
  };

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await eventsApi.getAll();

        const normalized = data.map(
          (e: any): Event => ({
            ...e,
            price: Number(e.price),
            age: Number(e.age),
            schedule: e.schedule.map((s: any) => ({
              ...s,
              date: s.date.split("T")[0], // 👈 ВАЖНО
            })),
          }),
        );

        setEvents(normalized);
      } catch (e) {
        console.error("Не удалось загрузить события", e);
      }
    };

    loadEvents();
  }, []);

  const resolveImageUrl = (path?: string | null): string | undefined => {
    if (!path) return undefined;

    // base64 не трогаем
    if (path.startsWith("data:image")) return path;

    // если пришёл полный URL — берём только pathname
    if (path.startsWith("http")) {
      try {
        path = new URL(path).pathname;
      } catch {
        return undefined;
      }
    }

    // гарантируем ведущий слэш
    if (!path.startsWith("/")) {
      path = `/${path}`;
    }

    // 🔥 Убираем дублирующий /uploads
    path = path.replace(/^\/uploads\/uploads\//, "/uploads/");

    return `${API_URL}${path}`;
  };

  const handleAdd = () => {
    const emptyEvent: Omit<Event, "id"> = {
      title: "Новое событие",
      age: 5,
      price: 0,
      description: "Описание события",
      image:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
      link: "",

      location: {
        city: "Бендеры",
        venue: "Дом культуры",
        address: "ул. Ленина 12",
      },

      schedule: [
        {
          date: new Date().toISOString().split("T")[0],
          times: ["12:00"],
        },
      ],
    };

    setEditingId(null);
    setFormData(emptyEvent);
  };

  const handleDelete = async (id: number) => {
    try {
      await eventsApi.delete(id);
      setEvents(events.filter((event) => event.id !== id));

      if (editingId === id) {
        setEditingId(null);
        setFormData({});
      }
    } catch (e) {
      console.error("Ошибка удаления события", e);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setFormData(event);
    setImageFile(null);
    setLocationInput(
      `${event.location.city}, ${event.location.venue}, ${event.location.address}`,
    );
  };
  // Вынесем загрузку событий в отдельную функцию
  const fetchEvents = async () => {
    try {
      const data = await eventsApi.getAll();

      const normalized = data.map(
        (e: any): Event => ({
          ...e,
          price: Number(e.price),
          age: Number(e.age),
          schedule: e.schedule.map((s: any) => ({
            ...s,
            date: s.date.split("T")[0],
          })),
        }),
      );

      setEvents(normalized);
    } catch (e) {
      console.error("Не удалось загрузить события", e);
    }
  };

  // useEffect теперь просто вызывает fetchEvents
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSave = async () => {
    if (!formData || !formData.location || !formData.schedule?.length) return;

    try {
      const payload: CreateEventPayload = {
        title: formData.title || "",
        age: formData.age || 0,
        price: formData.price || 0,
        description: formData.description || "",
        link: formData.link || "",
        location: formData.location!,
        schedule: formData.schedule!.map((s) => ({
          date: s.date, // YYYY-MM-DD
          times: s.times || [],
        })),
        image: imageFile ?? undefined,
      };

      // ===== CREATE =====
      if (editingId === null) {
        const { id } = await eventsApi.create(payload);

        setEvents([...events, { ...(formData as Event), id }]);
      }

      // ===== UPDATE =====
      else {
        await eventsApi.update(editingId, payload);

        setEvents(
          events.map((event) =>
            event.id === editingId
              ? {
                  ...event,
                  ...formData,
                  image: formData.image || event.image,
                }
              : event,
          ),
        );
      }

      setEditingId(null);
      setFormData({});
      setImageFile(null);
      await fetchEvents();
    } catch (e) {
      console.error("Ошибка сохранения события", e);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  // Edit Cards
  // Добавить новый блок даты
  const addDateBlock = () => {
    const newSchedule = [...(formData.schedule || []), { date: "", times: [] }];
    setFormData({ ...formData, schedule: newSchedule });
  };

  // Удалить блок даты
  const removeDateBlock = (index: number) => {
    const newSchedule = formData.schedule?.filter((_, i) => i !== index);
    setFormData({ ...formData, schedule: newSchedule });
  };

  // Обновить саму дату (строку)
  const updateDateValue = (index: number, value: string) => {
    const newSchedule = [...(formData.schedule ?? [])];

    newSchedule[index].date = value;
    setFormData({ ...formData, schedule: newSchedule });
  };

  // Добавить время в конкретную дату

  const isValidTime = (time: string) =>
    /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

  const addTimeInput = (index: number) => {
    const time = prompt("Введите время (формат HH:MM, например, 19:00)");
    if (!time) return;

    if (!isValidTime(time)) {
      alert("Неверный формат времени! Используйте HH:MM (например, 09:30)");
      return;
    }

    const newSchedule = [...(formData.schedule ?? [])];

    // Проверка на дубликаты
    if (newSchedule[index].times.includes(time)) {
      alert("Это время уже добавлено!");
      return;
    }

    newSchedule[index].times = [...newSchedule[index].times, time].sort();
    setFormData({ ...formData, schedule: newSchedule });
  };

  // Удалить конкретное время
  const removeTime = (dateIndex: number, timeIndex: number) => {
    const newSchedule = [...(formData.schedule ?? [])];

    newSchedule[dateIndex].times = newSchedule[dateIndex].times.filter(
      (_, i) => i !== timeIndex,
    );
    setFormData({ ...formData, schedule: newSchedule });
  };

  const savedLocations = useMemo(() => {
    const map = new Map<string, Event["location"]>();

    for (const event of events) {
      const { city, venue, address } = event.location;
      const key = `${city}|${venue}|${address}`;

      if (!map.has(key)) {
        map.set(key, { city, venue, address });
      }
    }

    return Array.from(map.values());
  }, [events]);

  const validateLocation = (location: EventLocation) => {
    if (!location.city) {
      return "Не указан город";
    }
    if (!location.venue) {
      return "Не указано место проведения";
    }
    if (!location.address) {
      return "Не указано адресс";
    }
    return null;
  };

  const parseLocation = (value: string): EventLocation => {
    const parts = value.split(",").map((v) => v.trim());

    return {
      city: parts[0] ?? "",
      venue: parts[1] ?? "",
      address: parts[2] ?? "",
    };
  };

  const parseAndValidateLocation = (
    value: string,
  ): { location: Event["location"]; error: string | null } => {
    const location = parseLocation(value);
    const error = validateLocation(location);
    return { location, error };
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
            Управление <span className="text-yellow-500">событиями</span>
          </h2>
          <p className="text-white/60 mt-1">
            Управления мероприятиями, их создание настройка и удаления.
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-[var(--color-neutral-950)] font-bold shadow-lg shadow-yellow-500/20"
          >
            <Plus className=" h-4 w-4" />
            Добавить событие
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
                  // Группируем расписание
                  const groupedSchedule = event.schedule.reduce<
                    Record<string, string[]>
                  >((acc, { date, times }) => {
                    acc[date] = [...(acc[date] || []), ...times];
                    return acc;
                  }, {});

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

                                {/* Age Badge */}
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold w-8 h-6 flex items-center justify-center rounded-xl">
                                  {event.age}+
                                </div>

                                {/* Price Tag */}
                                <div className="absolute bottom-3 left-3 bg-yellow-500 text-black px-3 py-1 rounded-lg font-bold text-sm shadow-lg">
                                  {event.price} руб
                                </div>
                              </div>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 flex flex-col min-w-0">
                              <div className="mb-auto">
                                <div className="flex justify-between items-start gap-4 mb-3">
                                  <h3 className="text-2xl font-bold text-white tracking-tight truncate group-hover:text-yellow-500 transition-colors">
                                    {event.title}
                                  </h3>
                                  {event.link && (
                                    <a
                                      href={event.link}
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

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                  {/* Schedule */}
                                  <div className="flex items-start gap-3">
                                    <div className="mt-1 p-1.5 rounded-lg bg-yellow-500/10 text-yellow-500">
                                      <Calendar className="h-4 w-4" />
                                    </div>
                                    <div className="space-y-1">
                                      {Object.entries(groupedSchedule).map(
                                        ([date, times]) => (
                                          <div
                                            key={date}
                                            className="text-xs text-white/70"
                                          >
                                            <span className="font-medium text-white/90">
                                              {new Date(
                                                date,
                                              ).toLocaleDateString("ru-RU")}
                                              :
                                            </span>
                                            <span className="ml-1 italic">
                                              {(times as string[])
                                                .map((t) => t.slice(0, 5)) // оставляем только HH:MM
                                                .join(", ")}
                                            </span>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>

                                  {/* Full Location */}
                                  <div className="flex items-start gap-3">
                                    <div className="mt-1 p-1.5 rounded-lg bg-yellow-500/10 text-yellow-500">
                                      <MapPin className="h-4 w-4" />
                                    </div>
                                    <div className="text-xs text-white/70 leading-snug">
                                      <div className="font-medium text-white/90">
                                        {event.location.city}
                                      </div>
                                      <div>{event.location.venue}</div>
                                      <div className="opacity-60">
                                        {event.location.address}
                                      </div>
                                    </div>
                                  </div>
                                </div>
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
                                    className="border-green-500/30 text-green-400 hover:bg-white/10 hover:border-green-500/50"
                                    onClick={() => openSlider(event)}
                                  >
                                    <FileSliders className="h-3.5 w-3.5 mr-2" />
                                    Добавить в Слайдер
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
                          Редактировать событие
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

                    {/* Расписание (Schedule) */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-white text-xs uppercase tracking-wider opacity-60">
                          Расписание
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={addDateBlock}
                          className="h-6 text-[10px] text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/5"
                        >
                          <Plus className="h-3 w-3 mr-1" /> Добавить дату
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {formData.schedule?.map((item, dIdx) => (
                          <div
                            key={dIdx}
                            className="p-3 rounded-lg bg-white/[0.03] border border-white/5 relative group"
                          >
                            <button
                              onClick={() => removeDateBlock(dIdx)}
                              className="absolute top-2 right-2 text-white/10 group-hover:text-red-400/60 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>

                            <Input
                              type="date"
                              value={item.date}
                              onChange={(e) =>
                                updateDateValue(dIdx, e.target.value)
                              }
                              className="bg-transparent border-white/5 text-sm h-8 mb-3 w-fit pr-8"
                            />

                            <div className="flex flex-wrap gap-1.5 items-center">
                              {item.times.map((t, tIdx) => (
                                <div
                                  key={tIdx}
                                  className="flex items-center gap-1.5 bg-yellow-500/10 rounded-md px-2 py-1 border border-yellow-500/20"
                                >
                                  <span className="text-[11px] font-medium text-yellow-500">
                                    {t}
                                  </span>
                                  <button
                                    onClick={() => removeTime(dIdx, tIdx)}
                                    className="text-yellow-500/40 hover:text-red-500"
                                  >
                                    <X className="h-2.5 w-2.5" />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => addTimeInput(dIdx)}
                                className="text-[10px] px-2 py-1 rounded border border-dashed border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all"
                              >
                                + время
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Локация */}
                    <div>
                      <Label className="text-white text-xs uppercase tracking-wider opacity-60">
                        Локация
                      </Label>

                      {locationError && (
                        <p className="mt-1 text-xs text-red-500">
                          {locationError}
                        </p>
                      )}

                      <Input
                        list="locations"
                        placeholder="Город, Место, Адрес"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        className="mt-1.5 bg-[var(--color-neutral-950)] border-white/10 text-white focus:border-yellow-500/50"
                        onBlur={() => {
                          const { location, error } =
                            parseAndValidateLocation(locationInput);

                          if (error) {
                            setLocationError(error);
                            return;
                          }

                          setLocationError(null);
                          setFormData((prev) => ({
                            ...prev,
                            location,
                          }));
                        }}
                      />

                      <datalist id="locations">
                        {savedLocations.map((loc, i) => (
                          <option
                            key={i}
                            value={`${loc.city}, ${loc.venue}, ${loc.address}`}
                          />
                        ))}
                      </datalist>
                    </div>

                    {/* Числовые данные */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white text-xs uppercase tracking-wider opacity-60">
                          Возраст
                        </Label>
                        <Input
                          type="number"
                          value={formData.age || 0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              age: Number(e.target.value),
                            })
                          }
                          className="mt-1.5 bg-[var(--color-neutral-950)] border-white/10 text-white focus:border-yellow-500/50"
                        />
                      </div>
                      <div>
                        <Label className="text-white text-xs uppercase tracking-wider opacity-60">
                          Цена
                        </Label>
                        <Input
                          type="number"
                          value={formData.price || 0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              price: Number(e.target.value),
                            })
                          }
                          className="mt-1.5 bg-[var(--color-neutral-950)] border-white/10 text-white focus:border-yellow-500/50"
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
                        value={formData.link || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, link: e.target.value })
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
                          <>
                            <img
                              src={resolveImageUrl(formData.image)}
                              className="w-full h-full object-cover transition group-hover:scale-105"
                              alt="Preview"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Pencil className="text-white h-6 w-6" />
                            </div>
                          </>
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
              /* Placeholder */
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
                      Выберите мероприятие из списка слева, чтобы начать правку
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
