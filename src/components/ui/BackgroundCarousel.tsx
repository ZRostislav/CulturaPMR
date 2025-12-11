import React, { useRef, useState, useEffect } from "react";

const items = [
  {
    img: "https://pridnestrovie-tourism.com/wp-content/uploads/2018/11/dji_0401.jpg",
    title: "Выставки",
    description: "Современные выставки и арт-проекты для всей семьи.",
  },
  {
    img: "https://i.pinimg.com/originals/de/c0/8b/dec08b360778ac5f80e3db080f87f6a6.jpg",
    title: "Концерты",
    description: "Музыкальные события в живом исполнении лучших артистов.",
  },
  {
    img: "https://i.pinimg.com/originals/94/af/95/94af95349d9393cf80092cd796c744f8.jpg",
    title: "Театральные постановки",
    description: "Интерактивные и классические спектакли для всех возрастов.",
  },
  {
    img: "https://images.steamusercontent.com/ugc/52453354080448818/543783B601D5A853E3F50907B9722A314DFD92B6/?imw=512&imh=320&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
    title: "Мастер-классы",
    description: "Обучение и творчество с лучшими специалистами города.",
  },
];

export default function BackgroundCarousel() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const translateRef = useRef(0);
  const [translateX, setTranslateX] = useState(0);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showText, setShowText] = useState(false);

  const speed = 1.5;

  // только 2 набора — идеальная бесконечная лента
  const duplicated = [
    ...items,
    ...items,
    ...items,
    ...items,
    ...items,
    ...items,
  ];

  useEffect(() => {
    let frame: number;

    const animate = () => {
      if (activeIndex !== null) {
        frame = requestAnimationFrame(animate);
        return;
      }

      if (!sliderRef.current) {
        frame = requestAnimationFrame(animate);
        return;
      }

      const containerWidth = sliderRef.current.clientWidth;
      const itemWidth = containerWidth / 4;
      const loopWidth = itemWidth * (duplicated.length / 2); // ширина половины ленты

      translateRef.current -= speed;

      // Когда полностью прошли одну половину — плавно переносим
      if (Math.abs(translateRef.current) >= loopWidth) {
        translateRef.current += loopWidth;
      }

      setTranslateX(translateRef.current);

      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [activeIndex]);

  const handleClick = (index: number) => {
    if (!sliderRef.current) return;

    const containerWidth = sliderRef.current.clientWidth;
    const itemWidth = containerWidth / 4;

    const target = -(index * itemWidth);
    const start = translateRef.current;
    const duration = 500;
    const startTime = performance.now();

    const move = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const value = start + (target - start) * progress;
      translateRef.current = value;
      setTranslateX(value);

      if (progress < 1) requestAnimationFrame(move);
      else {
        setIsExpanded(true);
        setTimeout(() => setShowText(true), 300);
      }
    };

    requestAnimationFrame(move);
    setActiveIndex(index);
  };

  const closeText = () => {
    setShowText(false);
    setIsExpanded(false);
    setTimeout(() => setActiveIndex(null), 400);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <div
        ref={sliderRef}
        className="absolute inset-0 flex"
        style={{ transform: `translateX(${translateX}px)` }}
      >
        {duplicated.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={index}
              className="h-full flex-shrink-0 relative cursor-pointer"
              style={{
                width: isActive && isExpanded ? "100%" : "25%",
                transition: "width 0.5s ease",
              }}
              onClick={() => handleClick(index)}
            >
              <img
                src={item.img}
                className="w-full h-full object-cover"
                alt=""
              />
            </div>
          );
        })}
      </div>

      {activeIndex !== null && (
        <div
          className={`absolute top-1/2 left-12 -translate-y-1/2 z-30 text-white max-w-lg p-6 bg-black/40 rounded-lg backdrop-blur-sm transition-all duration-700 ${
            showText ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
          }`}
        >
          <button
            onClick={closeText}
            className="absolute top-2 right-2 text-white text-2xl font-bold"
          >
            ×
          </button>

          <h2 className="text-3xl font-bold mb-4">
            {duplicated[activeIndex].title}
          </h2>

          <p className="mb-4">{duplicated[activeIndex].description}</p>

          <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg">
            Подробнее
          </button>
        </div>
      )}
    </section>
  );
}
