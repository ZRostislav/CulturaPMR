import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  eventShowcaseApi,
  EventDTO,
} from "../../components/services/eventShowcase.api";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Calendar, MousePointer2 } from "lucide-react";

const mapEventToCarouselItem = (event: EventDTO): any => ({
  id: event.id,
  title: event.title,
  description: event.description,
  image: event.image ?? "", // ⭐ защита от null
  ticket_link: event.ticket_link ?? "", // ⭐ защита от null
});

export default function BackgroundCarousel() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const translateRef = useRef(0);
  const [translateX, setTranslateX] = useState(0);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showText, setShowText] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const speed = 0.7;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const events = await eventShowcaseApi.getAll();
        setItems(events.map(mapEventToCarouselItem));
      } catch (e) {
        console.error("Ошибка загрузки:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Создаем большой массив для имитации бесконечности (например, 20 повторений)
  const duplicated = useMemo(() => {
    if (items.length === 0) return [];
    return Array.from({ length: 20 }, () => items).flat();
  }, [items]);

  // Анимация движения
  useEffect(() => {
    if (!duplicated.length || activeIndex !== null) return;

    let frame: number;
    const animate = () => {
      if (!sliderRef.current) return;

      const containerWidth = sliderRef.current.clientWidth;
      const itemWidth = containerWidth / 4;
      const totalWidth = itemWidth * duplicated.length;

      translateRef.current -= speed;

      // Бесшовный перезапуск: если уехали слишком далеко, возвращаемся в середину
      if (Math.abs(translateRef.current) >= totalWidth / 2) {
        translateRef.current = 0;
      }

      setTranslateX(translateRef.current);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [activeIndex, duplicated.length]);

  const handleClick = (index: number) => {
    if (!sliderRef.current || activeIndex !== null) return;

    const containerWidth = sliderRef.current.clientWidth;
    const itemWidth = containerWidth / 4 + 4;

    // Находим ближайший повтор слайда к центру видимой области
    const currentTranslate = translateRef.current;
    const totalWidth = itemWidth * items.length;

    // Индекс дублированного блока, который ближе всего
    const blockIndex = Math.round(Math.abs(currentTranslate) / totalWidth);
    const adjustedIndex = index - blockIndex * items.length;

    // Целевая позиция
    const target = -(index * itemWidth);

    translateRef.current = target;
    setTranslateX(target);
    setActiveIndex(index);
    setIsExpanded(true);
    setTimeout(() => setShowText(true), 300);
  };

  const closeText = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowText(false);
    setIsExpanded(false);

    setTimeout(() => {
      setActiveIndex(null);
      // После закрытия возобновляем движение с текущей точки
    }, 800);
  };

  const activeContent = !loading && items.length > 0;

  const { scrollY } = useScroll();
  // Эффект легкого параллакса для фона
  const yBg = useTransform(scrollY, [0, 500], [0, 150]);

  const truncate = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.slice(0, maxLength).trimEnd() + "…"
      : text;
  };

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

  if (loading) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center uppercase tracking-widest">
        Загрузка...
      </div>
    );
  }

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black font-sans">
      {activeContent ? (
        <div>
          {" "}
          <div
            ref={sliderRef}
            className={`absolute inset-0 flex ${
              activeIndex === null
                ? ""
                : "transition-transform duration-1000 ease-in-out"
            }`}
            style={{ transform: `translateX(${translateX}px)` }}
          >
            {duplicated.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={`${item.id}-${index}`}
                  className="h-full flex-shrink-0 relative group overflow-hidden cursor-pointer"
                  style={{
                    width: isActive && isExpanded ? "100vw" : "25vw",
                    transition: "width 0.8s cubic-bezier(0.65, 0, 0.35, 1)",
                  }}
                  onClick={() => handleClick(index)}
                >
                  <img
                    src={resolveImageUrl(item.image)}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-transform duration-1000 ${
                      isActive ? "scale-105" : "group-hover:scale-110"
                    }`}
                  />

                  {/* Градиент (становится темнее при активации) */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-700 ${
                      isActive ? "opacity-100" : "opacity-40"
                    }`}
                  />
                </div>
              );
            })}
          </div>
          {/* Контентная часть */}
          {activeIndex !== null && (
            <div
              className={`absolute inset-0 z-1 flex flex-col justify-end px-8 md:px-20 pb-20 transition-all duration-700 ${
                showText
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              } pointer-events-none`}
            >
              {/* КРЕСТИК - опустили ниже (top-24) */}
              <button
                onClick={closeText}
                className="absolute top-24 right-10 pointer-events-auto group p-4 z-[60] cursor-pointer"
              >
                <div className="relative flex items-center justify-center w-12 h-12">
                  <span className="absolute w-8 h-[2px] bg-white rotate-45 group-hover:bg-yellow-400 transition-all duration-300 " />
                  <span className="absolute w-8 h-[2px] bg-white -rotate-45 group-hover:bg-yellow-400 transition-all duration-300" />
                </div>
              </button>

              <div className="max-w-6xl pointer-events-auto">
                <h2
                  className="
    text-5xl md:text-[8rem] font-black text-white uppercase
    leading-[0.85] mb-8 tracking-tighter drop-shadow-2xl
    whitespace-nowrap  text-ellipsis
  "
                >
                  {truncate(duplicated[activeIndex].title, 25)}
                </h2>

                <div className="flex flex-col md:flex-row md:items-end gap-10">
                  <p
                    className="
    text-lg md:text-xl text-gray-300 max-w-xl font-light leading-relaxed
    border-l-4 border-yellow-500 pl-6 uppercase
    whitespace-nowrap  text-ellipsis
  "
                  >
                    {truncate(duplicated[activeIndex].description, 45)}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() =>
                        window.open(
                          duplicated[activeIndex].ticket_link,
                          "_blank",
                        )
                      }
                      className="px-10 py-5 bg-yellow-500 hover:bg-white text-black font-bold uppercase tracking-tighter transition-all duration-300 cursor-pointer"
                    >
                      Купить билет
                    </button>
                    <button
                      onClick={() =>
                        window.open(
                          duplicated[activeIndex].ticket_link,
                          "_blank",
                        )
                      }
                      className="px-10 py-5 border border-white/20 hover:border-white text-white font-bold uppercase tracking-tighter backdrop-blur-md transition-all duration-300 cursor-pointer"
                    >
                      Подробнее
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
          {/* Background Section */}
          <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
            <img
              src="/background.jpg"
              alt="Cultural Center"
              className="w-full h-full object-cover scale-110" // scale чуть больше для запаса параллакса
            />
            {/* Более сложный градиент для лучшей читаемости */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/40 to-neutral-950"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/60 via-transparent to-neutral-950/60"></div>
          </motion.div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Надзаголовок */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] text-yellow-500 uppercase border border-yellow-500/30 rounded-full bg-yellow-500/5 backdrop-blur-md"
                >
                  Premium Experience
                </motion.span>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 tracking-tight leading-[1.1]">
                  Многофункциональный <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500">
                    Культурный Комплекс
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-neutral-300/80 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                  Современное пространство для культурных мероприятий,
                  творческих встреч и вдохновляющих событий в самом сердце
                  города.
                </p>

                {/* Buttons Group */}
                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(234, 179, 8, 0.4)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      document
                        .getElementById("contacts")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="group relative px-8 py-4 bg-yellow-500 text-black font-bold rounded-2xl overflow-hidden transition-all"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Связаться с нами
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(255,255,255,0.15)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      document
                        .getElementById("listEvents")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="px-8 py-4 bg-white/5 backdrop-blur-md text-white font-medium rounded-2xl border border-white/10 hover:border-white/20 transition-all flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-yellow-500" />
                    Смотреть события
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">
              Листайте вниз
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-5 h-8 border-2 border-white/10 rounded-full flex justify-center p-1"
            >
              <div className="w-1 h-2 bg-yellow-500 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
