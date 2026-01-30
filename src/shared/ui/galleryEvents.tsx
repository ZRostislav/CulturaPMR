import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { galleryApi, GalleryDTO } from "../../components/services/gallery.api";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
};

export default function GallaryEvents() {
  const [images, setImages] = useState<GalleryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<GalleryDTO | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const resolveImageUrl = (path?: string | null) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await galleryApi.getAll();
        setImages(data);
      } catch (e) {
        console.error("Ошибка загрузки галереи", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="container mx-auto px-6">
      {/* Header */}
      <motion.div {...fadeInUp} className="text-center mb-16">
        <h2 className="text-white text-4xl font-bold mb-4 uppercase tracking-tighter">
          Галерея
        </h2>
        <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full" />
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="text-center text-neutral-500 uppercase tracking-widest">
          Загрузка...
        </div>
      ) : images.length === 0 ? (
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
          {images.map((img) => (
            <motion.div
              key={img.id}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedImg(img)}
              className="aspect-square overflow-hidden rounded-3xl border border-neutral-800 shadow-2xl bg-neutral-800 cursor-pointer group"
            >
              <img
                src={resolveImageUrl(img.image)}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                alt={img.description || "Галерея"}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setSelectedImg(null)}
          >
            <button
              className="absolute top-6 right-6 p-2 text-white/50 hover:text-white"
              onClick={() => setSelectedImg(null)}
            >
              <X size={40} strokeWidth={1.5} />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-5xl w-full flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-black">
                <img
                  src={resolveImageUrl(selectedImg.image)}
                  className="w-full h-full object-contain"
                  alt=""
                />
              </div>

              <div className="px-2">
                <h3 className="text-yellow-500 font-bold uppercase tracking-widest text-sm mb-2">
                  Описание
                </h3>
                <p className="text-white text-lg md:text-xl font-light leading-relaxed">
                  {selectedImg.description || "К этому фото пока нет описания."}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
