import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { galleryApi, GalleryDTO } from "../../components/services/gallery.api";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true },
};

export default function GallaryEvents() {
  const [images, setImages] = useState<GalleryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<GalleryDTO | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await galleryApi.getAll();
        setImages(data);
      } catch (e) {
        console.error("Ошибка загрузки", e);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="container mx-auto px-6 py-10">
      <motion.h2
        {...fadeInUp}
        className="text-white text-3xl font-bold mb-10 uppercase tracking-tight text-center"
      >
        Галерея <span className="text-yellow-500">событий</span>
      </motion.h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <motion.div
            key={img.id}
            {...fadeInUp}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedImg(img)}
            className="aspect-square cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-neutral-900 group"
          >
            <img
              src={`${API_URL}${img.image}`}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              alt=""
            />
          </motion.div>
        ))}
      </div>

      {/* Панель просмотра (Lightbox) */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setSelectedImg(null)}
          >
            {/* Кнопка закрытия */}
            <button
              className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedImg(null)}
            >
              <X size={40} strokeWidth={1.5} />
            </button>

            {/* Контент панели */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-5xl w-full flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-black">
                <img
                  src={`${API_URL}${selectedImg.image}`}
                  className="w-full h-full object-contain"
                  alt=""
                />
              </div>

              {/* Блок описания */}
              <div className="px-2">
                <h3 className="text-yellow-500 font-bold uppercase tracking-widest text-sm mb-2">
                  Описание
                </h3>
                <p className="text-white text-lg md:text-xl font-light leading-relaxed">
                  {selectedImg.description ||
                    "К этому событию пока нет описания."}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="text-center text-white/20 mt-10">Загрузка...</div>
      )}
    </div>
  );
}
