import { motion } from "motion/react";
import { Phone, Mail, MapPin } from "lucide-react";
import BackgroundCarousel from "../../shared/ui/BackgroundCarousel";
import ListEvents from "../../shared/ui/ListEvents";
import GallaryEvents from "../../shared/ui/galleryEvents";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
};

const StageLights = () => {
  // Создаем 12 случайных бликов
  const flares = Array.from({ length: 42 });

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      
   

     

      {/* --- РЕДКИЕ ВОЗНИКАЮЩИЕ БЛИКИ (ИСКРЫ) --- */}
      {flares.map((_, i) => {
        const size = Math.random() * 4 + 2; // Разный размер искр
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = 5 + Math.random() * 10;
        const delay = Math.random() * 20;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.4, 0], // Плавно появляется и исчезает
              scale: [0, 1.5, 0],
              y: [0, -40, -80],    // Медленно плывет вверх
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              backgroundColor: "rgba(234, 179, 8, 0.6)", // Золотистый цвет блика
              boxShadow: "0 0 10px rgba(234, 179, 8, 0.8)",
              filter: "blur(1px)",
            }}
          />
        );
      })}

      {/* --- НИЖНИЕ АКЦЕНТЫ --- */}
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-5%] left-[-2%] h-[40vh] w-[20vw]" 
        style={{
          background: "radial-gradient(circle at bottom left, rgba(234, 179, 8, 0.4) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-5%] right-[-2%] h-[40vh] w-[20vw]"
        style={{
          background: "radial-gradient(circle at bottom right, rgba(234, 179, 8, 0.4) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
    </div>
  );
};

export function Home() {
  return (
    <div id="hero" className="relative bg-neutral-950">
      {/* Теперь здесь Софиты вместо Снега */}
      <StageLights />
      
      <BackgroundCarousel />

      {/* Список мероприятий */}
      <section id="listEvents">
        <ListEvents />
      </section>

      {/* Галерея */}
      <section id="gallery" className="py-24 bg-neutral-900">
        <GallaryEvents />
      </section>

      {/* Контакты */}
      <section id="contacts" className="py-24 bg-neutral-950 relative">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-white text-4xl font-bold mb-4 uppercase tracking-tighter">
              Контакты
            </h2>
            <p className="text-neutral-500">
              Свяжитесь с нами для сотрудничества
            </p>
          </motion.div>

          {/* Сетка с карточками контактов */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <motion.div
              variants={fadeInUp}
              className="bg-neutral-900/40 p-10 rounded-3xl border border-neutral-800 text-center hover:border-yellow-500/30 transition-colors"
            >
              <Phone className="text-yellow-500 mx-auto mb-6" size={32} />
              <h3 className="text-white font-bold mb-2 uppercase tracking-wide">
                Телефон
              </h3>
              <p className="text-neutral-300 text-lg">0 (552) 2-65-34</p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-neutral-900/40 p-10 rounded-3xl border border-neutral-800 text-center hover:border-yellow-500/30 transition-colors"
            >
              <Mail className="text-yellow-500 mx-auto mb-6" size={32} />
              <h3 className="text-white font-bold mb-2 uppercase tracking-wide">
                Email
              </h3>
              <p className="text-neutral-300 text-lg">-</p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-neutral-900/40 p-10 rounded-3xl border border-neutral-800 text-center hover:border-yellow-500/30 transition-colors"
            >
              <MapPin className="text-yellow-500 mx-auto mb-6" size={32} />
              <h3 className="text-white font-bold mb-2 uppercase tracking-wide">
                Адрес
              </h3>
              <p className="text-neutral-300 text-lg">
                г. Бендеры, ул. Ленина, 32
              </p>
            </motion.div>
          </div>

        
           

        </div>
      </section>
    </div>
  );
}