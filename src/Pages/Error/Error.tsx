import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { motion } from "framer-motion"; // Исправлено: обычно импорт из framer-motion
import { AlertTriangle, Home } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

// Используем ваш эффект снега для консистентности
const Snowfall = () => {
  const snowflakes = Array.from({ length: 20 });
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((_, i) => {
        const size = Math.random() * 3 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 12 + 10;
        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: `${left}vw`, opacity: 0 }}
            animate={{
              y: "110vh",
              x: `${left + (Math.random() * 4 - 2)}vw`,
              opacity: [0, 0.4, 0.4, 0],
            }}
            transition={{ duration, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              width: size,
              height: size,
              backgroundColor: "white",
              borderRadius: "50%",
              filter: "blur(1px)",
            }}
          />
        );
      })}
    </div>
  );
};

export function Error() {
  const error = useRouteError();
  let status = "404";
  let message = "Страница не найдена";

  if (isRouteErrorResponse(error)) {
    // Ошибки роутинга (404, 401 и т.д.)
    status = error.status.toString();
    message = error.statusText;
  } else if (
    error !== null &&
    typeof error === "object" &&
    "message" in error
  ) {
    // Обычные JS ошибки (Error)
    status = "500";
    message = (error as { message: string }).message;
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center relative overflow-hidden font-sans">
      <Snowfall />

      {/* Фоновый градиент для глубины */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div {...fadeInUp} className="max-w-2xl mx-auto text-center">
          {/* Иконка ошибки */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="mb-8 inline-block"
          >
            <div className="p-6 rounded-full bg-neutral-900 border border-neutral-800 shadow-2xl">
              <AlertTriangle size={64} className="text-yellow-500" />
            </div>
          </motion.div>

          <h2 className="text-white text-4xl font-bold mb-6 uppercase tracking-tighter relative">
            Ошибка {status}
          </h2>

          <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full mb-8" />

          <p className="text-neutral-400 text-lg mb-12 max-w-md mx-auto">
            {status === "404"
              ? "Похоже, вы забрели в заснеженную пустошь. Страница, которую вы ищете, не существует или была перемещена."
              : `Произошла системная ошибка: ${message}`}
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              to="/"
              className="flex items-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-neutral-950 px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-yellow-500/20"
            >
              <Home size={20} />
              На главную
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
