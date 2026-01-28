import { motion } from "motion/react";
import { Phone, Mail, MapPin } from "lucide-react";
import BackgroundCarousel from "../../shared/ui/BackgroundCarousel";
import ListEvents from "../../shared/ui/ListEvents";
import { galleryApi } from "../../components/services/gallery.api";
import { useEffect, useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true }, // 👈 ВАЖНО
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true },
};

// Компонент снега (редкий и мелкий)
const Snowfall = () => {
  const snowflakes = Array.from({ length: 30 });
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((_, i) => {
        const size = Math.random() * 3 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 12 + 10;
        const delay = Math.random() * 8;
        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: `${left}vw`, opacity: 0 }}
            animate={{
              y: "110vh",
              x: `${left + (Math.random() * 4 - 2)}vw`,
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={{ duration, repeat: Infinity, ease: "linear", delay }}
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

export function Home() {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const gallery = await galleryApi.getAll();

        // 👇 если API возвращает [{ image: "/uploads/..." }]
        const images = gallery.map(
          (item) => `${import.meta.env.VITE_API_URL}${item.image}`,
        );

        setGalleryImages(images);
      } catch (e) {
        console.error("Ошибка загрузки галереи", e);
      } finally {
        setGalleryLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <div id="hero" className="relative">
      <Snowfall />
      <BackgroundCarousel />

      {/* Список мероприятий */}
      <section id="listEvents">
        <ListEvents />
      </section>

      {/* Галерея */}
      <section id="gallery" className="py-24 bg-neutral-900">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-white text-4xl font-bold mb-4 uppercase tracking-tighter">
              Галерея
            </h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full" />
          </motion.div>

          {galleryLoading ? (
            <div className="text-center text-neutral-500 uppercase tracking-widest">
              Загрузка...
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center text-neutral-500 uppercase tracking-widest">
              Галерея пуста
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image}
                  variants={fadeInUp}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="aspect-square overflow-hidden rounded-3xl border border-neutral-800 shadow-2xl bg-neutral-800"
                >
                  <img
                    src={image}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    alt="Галерея"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
