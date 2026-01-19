import { motion } from "motion/react";

export const Snowfall = () => {
  // Генерируем 30 редких снежинок
  const snowflakes = Array.from({ length: 30 });

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((_, i) => {
        // Случайные параметры для каждой снежинки
        const size = Math.random() * 4 + 2; // Мелкие: от 2 до 6 пикселей
        const left = Math.random() * 100; // По всей ширине
        const duration = Math.random() * 10 + 10; // Медленно: от 10 до 20 секунд
        const delay = Math.random() * 10;

        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: `${left}vw`, opacity: 0 }}
            animate={{ 
              y: "110vh", 
              x: `${left + (Math.random() * 10 - 5)}vw`, // Немного качаются в стороны
              opacity: [0, 0.7, 0.7, 0] // Плавное появление и исчезновение
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "linear",
              delay: delay,
            }}
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