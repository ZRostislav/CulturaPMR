import React, { useRef, useState, useEffect, useMemo } from "react";
import api from "../../api/api";
import API_ROUTES from "../../api/apiRoutes";

interface CarouselItem {
  id: number;
  title: string;
  description: string;
  ticket_link: string;
  image: string;
}

export default function BackgroundCarousel() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const translateRef = useRef(0);
  const [translateX, setTranslateX] = useState(0);

  const [items, setItems] = useState<CarouselItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showText, setShowText] = useState(false);

  const speed = 0.7;

  // Загрузка данных
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get(API_ROUTES.EVENTS.GET_ALL);
        setItems(res.data);
      } catch (e) {
        console.error("Ошибка загрузки:", e);
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

  if (!items.length)
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center uppercase tracking-widest">
        Загрузка...
      </div>
    );

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black font-sans">
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
                src={`${import.meta.env.VITE_API_URL}${item.image}`}
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
            showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
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
            <h2 className="text-5xl md:text-[8rem] font-black text-white uppercase leading-[0.85] mb-8 tracking-tighter drop-shadow-2xl">
              {duplicated[activeIndex].title}
            </h2>

            <div className="flex flex-col md:flex-row md:items-end gap-10">
              <p className="text-lg md:text-xl text-gray-300 max-w-xl font-light leading-relaxed border-l-4 border-yellow-500 pl-6 uppercase">
                {duplicated[activeIndex].description}
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() =>
                    window.open(duplicated[activeIndex].ticket_link, "_blank")
                  }
                  className="px-10 py-5 bg-yellow-500 hover:bg-white text-black font-bold uppercase tracking-tighter transition-all duration-300 cursor-pointer"
                >
                  Купить билет
                </button>
                <button
                  onClick={() =>
                    window.open(duplicated[activeIndex].ticket_link, "_blank")
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
    </section>
  );
}
