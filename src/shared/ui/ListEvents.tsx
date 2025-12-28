import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, number } from "motion/react";
import { EventItem, events } from "./events";

function ModernRange({ label, min, max, value, onChange, unit = "" }: any) {
  const [from, to] = value;
  const leftPos = ((from - min) / (max - min)) * 100;
  const rightPos = ((to - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-3 group">
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
          {label}
        </label>
        <span className="text-[11px] font-mono text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
          {from} — {to} {unit}
        </span>
      </div>

      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-[2px] bg-white/5 rounded-full" />
        <div
          className="absolute h-[2px] bg-gradient-to-r from-yellow-500 to-orange-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]"
          style={{ left: `${leftPos}%`, right: `${100 - rightPos}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={from}
          onChange={(e) => {
            const val = Math.min(Number(e.target.value), to - 1);
            onChange([val, to]);
          }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none z-30 touch-none"
          style={{ WebkitAppearance: "none" }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={to}
          onChange={(e) => {
            const val = Math.max(Number(e.target.value), from + 1);
            onChange([from, val]);
          }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none z-30 touch-none"
          style={{ WebkitAppearance: "none" }}
        />
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #eab308;
          cursor: pointer;
          pointer-events: auto;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}

export default function ListEvents() {
  const [selected, setSelected] = useState<EventItem | null>(null);

  const limits = useMemo(
    () => ({
      age: [
        Math.min(...events.map((e) => e.age)),
        Math.max(...events.map((e) => e.age)),
      ],
      price: [
        Math.min(...events.map((e) => e.price)),
        Math.max(...events.map((e) => e.price)),
      ],
    }),
    []
  );

  const [filters, setFilters] = useState({
    age: limits.age,
    price: limits.price,
    city: "all",
  });

  const cities = useMemo(
    () => ["all", ...new Set(events.map((e) => e.location.city))],
    []
  );

  const isFiltered =
    filters.city !== "all" ||
    filters.age[0] !== limits.age[0] ||
    filters.age[1] !== limits.age[1] ||
    filters.price[0] !== limits.price[0] ||
    filters.price[1] !== limits.price[1];

  const filteredEvents = events.filter((event) => {
    return (
      event.age >= filters.age[0] &&
      event.age <= filters.age[1] &&
      event.price >= filters.price[0] &&
      event.price <= filters.price[1] &&
      (filters.city === "all" || event.location.city === filters.city)
    );
  });

  return (
    <section className="py-12 md:py-24 bg-neutral-950" id="listEvents">
      <main className="relative max-w-7xl mx-auto px-4 md:px-6">
        {/* Заголовок секции */}
        <div className="mb-12 flex items-center gap-5">
          <div className="h-10 w-1.5 bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600" />
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase leading-none">
            Ближайшие{" "}
            <span className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              мероприятия
            </span>
          </h2>
        </div>

        {/* Блок фильтров */}
        <div className="mb-16 md:mb-20">
          <div className="bg-white/[0.03] border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 backdrop-blur-xl">
            <div className="flex flex-col gap-8">
              {/* Города и кнопка сброса */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">
                    Город
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => setFilters((f) => ({ ...f, city }))}
                      className={`px-4 cursor-pointer py-2 md:px-5 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                        filters.city === city
                          ? "bg-yellow-500 border-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                          : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                      }`}
                    >
                      {city === "all" ? "Все города" : city}
                    </button>
                  ))}
                  {isFiltered && (
                    <button
                      onClick={() =>
                        setFilters({
                          age: limits.age,
                          price: limits.price,
                          city: "all",
                        })
                      }
                      className="group cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 rounded-full transition-all duration-300"
                    >
                      <span className="text-[10px]  font-bold uppercase tracking-widest">
                        Сбросить
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 transition-transform group-hover:rotate-90"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Слайдеры */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 border-t border-white/5 pt-8">
                <ModernRange
                  label="Возрастной диапазон"
                  min={limits.age[0]}
                  max={limits.age[1]}
                  value={filters.age}
                  onChange={(v: any) => setFilters((f) => ({ ...f, age: v }))}
                  unit="лет"
                />
                <ModernRange
                  label="Бюджет мероприятия"
                  min={limits.price[0]}
                  max={limits.price[1]}
                  value={filters.price}
                  onChange={(v: any) => setFilters((f) => ({ ...f, price: v }))}
                  unit="₽"
                />
              </div>
            </div>
          </div>

          {/* Результаты поиска (Badge) */}
          <div className="flex justify-center -mt-4">
            <div className="bg-neutral-900 border border-white/10 px-6 py-2 rounded-full shadow-2xl z-10">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Найдено:{" "}
                <span className="text-yellow-500 font-bold">
                  {filteredEvents.length}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Сетка карточек (Ваш оригинальный дизайн) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="relative group cursor-pointer h-full"
              onClick={() => setSelected(event)}
            >
              {/* Фоновое свечение при наведении */}
              <div className="absolute -inset-2 rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600"></div>

              {/* ОСНОВНАЯ КАРТОЧКА */}
              <div className="relative flex flex-col h-full bg-neutral-900 border border-white/5 group-hover:border-[oklch(79.5%_0.184_86.047)]/40 rounded-[2rem] overflow-hidden transition-all duration-500 group-hover:-translate-y-2 shadow-2xl isolate">
                {/* Фото */}
                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#1f1f21] rounded-t-[2rem]">
                  <img
                    src={event.image}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1b] via-transparent to-transparent opacity-80" />

                  {/* Возраст */}
                  <div className="absolute bottom-2 right-2 group/age">
                    <div className="relative px-2.5 py-1 bg-black/40 backdrop-blur-md border border-white/20 text-white font-bold uppercase tracking-tighter transition-all duration-300 cursor-pointer overflow-hidden">
                      <span className="flex items-center justify-center text-sm md:text-base leading-none gap-0.4">
                        <span className="relative">{event.age}</span>
                        <span className="relative top-[-1px]">+</span>
                      </span>
                    </div>
                  </div>

                  {/* Город */}
                  <div className="absolute bottom-2 left-2 group/age">
                    <div className="relative px-2.5 py-1 bg-black/40 backdrop-blur-md border border-white/20 text-white font-bold uppercase tracking-tighter transition-all duration-300 cursor-pointer overflow-hidden text-[10px] md:text-xs">
                      {event.location.city}
                    </div>
                  </div>
                </div>

                {/* Контент */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl md:text-2xl uppercase font-bold text-white mb-6 group-hover:text-[oklch(79.5%_0.184_86.047)] transition-colors line-clamp-2 min-h-[3.5rem] md:min-h-[4rem]">
                    {event.title}
                  </h3>
                  <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xl md:text-2xl uppercase font-black tracking-tighter bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                      {event.price == 0 ? "Бесплатно" : `${event.price} руб`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-[2rem]">
            <p className="text-white/20 uppercase tracking-[0.3em] text-sm">
              Ничего не найдено
            </p>
          </div>
        )}
      </main>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/70 backdrop-blur-xl"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { type: "spring", damping: 25, stiffness: 300 },
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 10,
                transition: { duration: 0.2 },
              }}
              className="relative bg-[#1a1a1c] border border-white/10 w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(234,179,8,0.3)] flex flex-col md:flex-row min-h-[500px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Кнопка закрытия */}
              <button
                onClick={() => setSelected(null)}
                className="absolute cursor-pointer top-6 right-6 z-20 p-2 rounded-full bg-black/20 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/10 group"
              >
                <svg
                  className="w-6 h-6 transition-transform group-hover:rotate-90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Левая часть: Фотография */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <motion.img
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                  src={selected.image || "https://via.placeholder.com/600x800"}
                  alt={selected.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#1a1a1c] via-transparent to-transparent opacity-80" />

                {/* ДОБАВЛЕНО: Город поверх фото (опционально для стиля) */}
                <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white/90 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                  <svg
                    className="w-4 h-4 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
                  </svg>
                  <span className="text-sm font-bold uppercase tracking-widest">
                    {selected.location.city || "Город"}
                  </span>
                </div>
              </div>

              {/* Правая часть: Контент */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-black gap-2 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-tighter bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/20">
                      {selected.age}
                      <span className="relative top-[-1px]">+</span>
                    </span>

                    {/* ДОБАВЛЕНО: Цена */}
                    <span className="text-yellow-500 font-mono font-bold text-lg italic uppercase">
                      {/* {selected.price ? `${selected.price}` : "Цена по запросу"} */}
                      {selected.price == 0
                        ? "Бесплатно"
                        : `${selected.price} руб`}
                    </span>
                    <div className="h-px flex-1 bg-white/10"></div>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic leading-tight mb-2 tracking-tighter">
                    {selected.title}
                  </h2>

                  {/* ДОБАВЛЕНО: Вторая строка с городом под заголовком */}
                  <p className="text-white/40 text-xs uppercase tracking-[0.1em] mb-3 flex items-center gap-2">
                    <span>Локация:</span>
                    <span className="text-white/80">
                      {selected.location.city}, {selected.location.venue}
                      {", "}
                      {selected.location.address}
                    </span>
                  </p>
                  <div className="space-y-2 mb-6">
                    {selected.schedule.map((s) => (
                      <div
                        key={s.date}
                        className="flex flex-wrap gap-2 text-xs"
                      >
                        <span className="text-white/40 uppercase tracking-[0.15em]">
                          {new Date(s.date).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                          })}
                          :
                        </span>
                        <span className="text-white/80 font-mono">
                          {s.times.join(", ")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="relative mb-10">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full" />
                    <p className="text-slate-300 text-lg md:text-xl leading-relaxed pl-6 italic font-light">
                      {selected.description}
                    </p>
                  </div>

                  {/* ИЗМЕНЕНО: Новая анимация кнопки через motion */}
                  <motion.button
                    whileHover={{ scale: 1.02, letterSpacing: "0.25em" }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative cursor-pointer overflow-hidden w-full text-black font-black py-5 rounded-xl transition-all uppercase tracking-[0.2em] text-sm bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 hover:shadow-[0_0_40px_-5px_rgba(234,179,8,0.6)]"
                  >
                    <span className="relative z-10">
                      <a href={selected.link}>Забронировать</a>
                    </span>
                    {/* Эффект блика при наведении */}
                    <motion.div
                      className="absolute inset-0 bg-white/30 -skew-x-12 -translate-x-full"
                      initial={false}
                      whileHover={{ x: "200%", transition: { duration: 0.6 } }}
                    />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
