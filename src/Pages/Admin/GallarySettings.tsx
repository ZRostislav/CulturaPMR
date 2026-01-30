import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  UploadCloud,
  AlertCircle,
  ImageIcon,
  X,
  Plus,
  Edit3,
  RefreshCcw,
} from "lucide-react";
import { galleryApi, GalleryDTO } from "../../components/services/gallery.api";
import { Button } from "../../shared/ui/test/button";

export function GallarySettings() {
  const [images, setImages] = useState<GalleryDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [newDescription, setNewDescription] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editDescription, setEditDescription] = useState("");
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
      await galleryApi.create({
        imageFile: file,
        description: newDescription || undefined,
      });
      setNewDescription("");
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

  const startEdit = (img: GalleryDTO) => {
    setEditId(img.id);
    setEditDescription(img.description || "");
  };

  const saveEdit = async (id: number) => {
    await galleryApi.update(id, { description: editDescription });
    setImages((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, description: editDescription } : i,
      ),
    );
    setEditId(null);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-8 rounded-[2rem] border border-white/10">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Медиа{" "}
            <span className="text-yellow-500 underline decoration-yellow-500/30 underline-offset-8">
              галерея
            </span>
          </h2>
          <p className="text-white/40 mt-3 flex items-center gap-2 font-medium">
            <ImageIcon className="w-5 h-5 text-yellow-500/70" />
            Управляйте галереи (макс. 6 фото)
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex justify-between w-full text-xs font-bold uppercase tracking-wider mb-1">
            <span className="text-white/40">Загружено</span>
            <span
              className={
                images.length >= 6 ? "text-red-400" : "text-yellow-500"
              }
            >
              {images.length} / 6
            </span>
          </div>
          <div className="w-64 h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
              initial={{ width: 0 }}
              animate={{ width: `${(images.length / 6) * 100}%` }}
              transition={{ duration: 1, ease: "circOut" }}
            />
          </div>
        </div>
      </div>

      {/* Upload Section */}
      {images.length < 6 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4"
        >
          <label className="relative group flex flex-col items-center justify-center h-48 rounded-[2rem] border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-yellow-500/[0.02] hover:border-yellow-500/50 transition-all cursor-pointer overflow-hidden">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleUpload(e.target.files[0]);
                  e.target.value = "";
                }
              }}
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-yellow-500 font-medium animate-pulse">
                  Загрузка...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                  <Plus className="w-8 h-8 text-yellow-500" />
                </div>
                <span className="font-semibold">Выбрать изображение</span>
              </div>
            )}
          </label>

          <div className="flex flex-col gap-3">
            <textarea
              placeholder="Добавить описание к следующему фото..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-[1.5rem] p-4 text-white text-sm focus:outline-none focus:border-yellow-500/50 transition-colors resize-none"
            />
          </div>
        </motion.div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {images.map((img) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl"
            >
              <img
                src={resolveImageUrl(img.image)}
                alt=""
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Bottom Info & Edit Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                {editId === img.id ? (
                  <div className="space-y-3">
                    <textarea
                      autoFocus
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-yellow-500"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(img.id)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded-lg text-xs transition-colors"
                      >
                        Сохранить
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-white text-sm font-medium line-clamp-2 opacity-90">
                      {img.description || (
                        <span className="text-white/30 italic">
                          Без описания
                        </span>
                      )}
                    </p>
                    <button
                      onClick={() => startEdit(img)}
                      className="p-2 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-full transition-all text-white/50"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Top Actions (Delete/Replace) */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-10px] group-hover:translate-y-0 duration-300">
                <label className="p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl text-white cursor-pointer transition-colors shadow-lg border border-white/10">
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      galleryApi
                        .update(img.id, { imageFile: e.target.files[0] })
                        .then(loadGallery)
                    }
                  />
                  <RefreshCcw className="w-5 h-5" />
                </label>
                <button
                  onClick={() => setConfirmDeleteId(img.id)}
                  className="p-3 bg-red-500/20 backdrop-blur-md hover:bg-red-500 text-white rounded-2xl transition-all shadow-lg border border-red-500/20"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Delete Confirmation Overlay */}
              <AnimatePresence>
                {confirmDeleteId === img.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-neutral-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center z-20"
                  >
                    <div className="p-4 bg-red-500/10 rounded-full mb-4">
                      <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h4 className="text-white font-bold text-lg mb-2">
                      Удалить изображение?
                    </h4>
                    <p className="text-white/40 text-sm mb-6">
                      Это действие нельзя будет отменить.
                    </p>
                    <div className="flex gap-3 w-full">
                      <button
                        onClick={() => handleDelete(img.id)}
                        className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-all active:scale-95"
                      >
                        Удалить
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-medium transition-all"
                      >
                        Отмена
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {!loading && images.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]"
        >
          <div className="relative inline-block mb-6">
            <ImageIcon className="w-20 h-20 text-white/5 mx-auto" />
            <Plus className="w-8 h-8 text-yellow-500/40 absolute -bottom-2 -right-2" />
          </div>
          <h3 className="text-white font-bold text-xl">Ваша галерея пуста</h3>
          <p className="text-white/30 max-w-xs mx-auto mt-2">
            Загрузите до 6 фотографий, чтобы показать свои лучшие работы.
          </p>
        </motion.div>
      )}
    </div>
  );
}
