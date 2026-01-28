import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  UploadCloud,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import { galleryApi, GalleryDTO } from "../../components/services/gallery.api";
import { Button } from "../../shared/ui/test/button";

export function GallarySettings() {
  const [images, setImages] = useState<GalleryDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await galleryApi.getAll();
      setImages(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleUpload = async (file: File) => {
    if (images.length >= 6) return;
    setUploading(true);
    try {
      await galleryApi.create({ imageFile: file });
      await loadGallery();
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await galleryApi.delete(id);
    setImages((prev) => prev.filter((img) => img.id !== id));
    setConfirmDeleteId(null);
  };

  const resolveImageUrl = (path?: string | null): string | undefined => {
    if (!path) return undefined;
    if (path.startsWith("data:image")) return path;
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header & Counter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Медиа <span className="text-yellow-500">галерея</span>
          </h2>
          <p className="text-white/50 mt-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Визуальное оформление вашего
            профиля
          </p>
        </motion.div>

        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-white/60 mb-2">
            Заполнено:{" "}
            <span
              className={
                images.length >= 6 ? "text-red-400" : "text-yellow-500"
              }
            >
              {images.length} / 6
            </span>
          </span>
          <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-yellow-500"
              initial={{ width: 0 }}
              animate={{ width: `${(images.length / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <motion.label
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={
          images.length < 6
            ? { scale: 1.005, borderColor: "rgba(234, 179, 8, 0.6)" }
            : {}
        }
        className={`relative group block cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 p-12 text-center overflow-hidden ${
          images.length >= 6
            ? "border-red-500/20 bg-red-500/5 cursor-not-allowed"
            : "border-white/10 bg-white/5 hover:bg-yellow-500/5"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading || images.length >= 6}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleUpload(e.target.files[0]);
              e.target.value = "";
            }
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div
            className={`p-4 rounded-2xl transition-colors ${
              images.length >= 6
                ? "bg-red-500/10"
                : "bg-yellow-500/10 group-hover:bg-yellow-500/20"
            }`}
          >
            {uploading ? (
              <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            ) : images.length >= 6 ? (
              <AlertCircle className="w-8 h-8 text-red-500" />
            ) : (
              <UploadCloud className="w-8 h-8 text-yellow-500" />
            )}
          </div>

          <div>
            <p className="text-xl font-semibold text-white">
              {images.length >= 6
                ? "Лимит исчерпан"
                : uploading
                  ? "Загружаем файл..."
                  : "Добавить фото"}
            </p>
            <p className="text-white/40 text-sm mt-1 max-w-xs mx-auto">
              {images.length >= 6
                ? "Удалите старые фото, чтобы загрузить новые"
                : "Перетащите изображение сюда или кликните для выбора"}
            </p>
          </div>
        </div>
      </motion.label>

      {/* Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-3xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {images.map((img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative aspect-square rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl"
              >
                <img
                  src={resolveImageUrl(img.image)}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Glass Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <Button
                    onClick={() => setConfirmDeleteId(img.id)}
                    className="p-3 bg-red-500 hover:bg-red-600 rounded-2xl text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl"
                  >
                    <Trash2 className="w-6 h-6" />
                  </Button>
                </div>

                {/* Confirm Delete Overlay */}
                <AnimatePresence>
                  {confirmDeleteId === img.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center"
                    >
                      <p className="text-white font-medium mb-4">
                        Удалить это фото?
                      </p>
                      <div className="flex gap-2 w-full">
                        <Button
                          onClick={() => handleDelete(img.id)}
                          className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors"
                        >
                          Да
                        </Button>
                        <Button
                          onClick={() => setConfirmDeleteId(null)}
                          className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm transition-colors"
                        >
                          Нет
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!loading && images.length === 0 && (
        <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl">
          <ImageIcon className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/40">Галерея пока пуста</p>
        </div>
      )}
    </div>
  );
}
