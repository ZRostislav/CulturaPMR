import { useEffect, useState, useMemo } from "react";
import {
  Trash2,
  Edit3,
  Layers,
  ArrowLeft,
  X,
  FolderPlus,
  Plus,
  Upload,
  MoreVertical,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { galleryApi, GalleryDTO } from "../../components/services/gallery.api";
import { albumsApi, AlbumDTO } from "../../components/services/albums.api";
import { Button } from "../../shared/ui/test/button";

const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
  />
);

const StyledTextarea = (
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) => (
  <textarea
    {...props}
    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500/50 transition-colors resize-none"
  />
);

type Tab = "images" | "albums" | "albumView";

export function GallarySettings() {
  const [activeTabS, setactiveTabS] = useState<Tab>("images");

  // Данные
  const [images, setImages] = useState<GalleryDTO[]>([]);
  const [albums, setAlbums] = useState<AlbumDTO[]>([]);

  // Состояния
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Форма загрузки
  const [newDescription, setNewDescription] = useState("");
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | string>("");

  // Редактирование
  const [editingPhotoId, setEditingPhotoId] = useState<number | null>(null);
  const [editDescription, setEditDescription] = useState("");

  // Альбомы
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [albumForm, setAlbumForm] = useState<{
    title: string;
    description: string;
    id: number | null;
  }>({ title: "", description: "", id: null });

  // Просмотр альбома
  const [viewAlbum, setViewAlbum] = useState<AlbumDTO | null>(null);
  const [albumImages, setAlbumImages] = useState<GalleryDTO[]>([]);

  // Модалка добавления в альбом
  const [isAddToAlbumModalOpen, setIsAddToAlbumModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const resolveImageUrl = (path?: string | null) => {
    if (!path) return "";
    return path.startsWith("http") || path.startsWith("data:")
      ? path
      : `${API_URL}${path}`;
  };

  // --- ЛОГИКА (Оставлена без изменений) ---
  const loadData = async () => {
    setLoading(true);
    try {
      const [imgData, albumData] = await Promise.all([
        galleryApi.getAllWithAlbums(),
        albumsApi.getAll(),
      ]);

      setAlbums(
        albumData.map((a) => ({
          ...a,
          id: Number(a.id),
        })),
      );

      setImages(
        imgData.map((i) => ({
          ...i,
          id: Number(i.id),
          album_id: i.album_id !== null ? Number(i.album_id) : null,
        })),
      );
    } catch (err) {
      console.error("Ошибка загрузки данных:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAlbum = async (id: number | string) => {
    const numericId = Number(id);

    if (!numericId || Number.isNaN(numericId)) {
      console.error("Invalid album id:", id);
      return;
    }

    try {
      const data = await albumsApi.getOne(numericId);
      setViewAlbum(data.album);
      setAlbumImages(data.images);
      setactiveTabS("albumView");
    } catch (err) {
      alert("Не удалось загрузить альбом");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      await galleryApi.create({
        imageFile: file,
        description: newDescription || null,
        album_id: selectedAlbumId ? Number(selectedAlbumId) : null,
      });
      setNewDescription("");
      setSelectedAlbumId("");
      await loadData();
      if (activeTabS === "albumView" && viewAlbum) {
        handleOpenAlbum(viewAlbum.id);
      }
    } catch (err) {
      alert("Ошибка при загрузке");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id: number) => {
    if (!window.confirm("Удалить фото навсегда?")) return;
    try {
      await galleryApi.delete(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      setAlbumImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      alert("Ошибка удаления");
    }
  };

  const saveDescriptionEdit = async (id: number) => {
    try {
      await galleryApi.update(id, { description: editDescription });
      const updater = (img: GalleryDTO) =>
        img.id === id ? { ...img, description: editDescription } : img;
      setImages((prev) => prev.map(updater));
      setAlbumImages((prev) => prev.map(updater));
      setEditingPhotoId(null);
    } catch (err) {
      alert("Ошибка обновления");
    }
  };

  const handleSaveAlbum = async () => {
    try {
      if (albumForm.id) {
        await albumsApi.update(albumForm.id, {
          title: albumForm.title,
          description: albumForm.description,
        });
      } else {
        await albumsApi.create({
          title: albumForm.title,
          description: albumForm.description,
        });
      }
      setIsAlbumModalOpen(false);
      setAlbumForm({ title: "", description: "", id: null });
      loadData();
    } catch (err) {
      alert("Ошибка сохранения альбома");
    }
  };

  const handleDeleteAlbum = async (id: number) => {
    if (!window.confirm("Удалить альбом? Все фото станут одиночными.")) return;
    try {
      await albumsApi.delete(id);
      if (viewAlbum?.id === id) {
        setactiveTabS("albums");
        setViewAlbum(null);
      }
      loadData();
    } catch (err) {
      alert("Ошибка удаления альбома");
    }
  };

  const handleRemoveFromAlbum = async (photoId: number) => {
    try {
      await galleryApi.detachFromAlbum(photoId);
      const photo = albumImages.find((p) => p.id === photoId);
      if (photo) {
        setAlbumImages((prev) => prev.filter((p) => p.id !== photoId));
        setImages((prev) => [{ ...photo, album_id: null }, ...prev]);
      }
    } catch (err) {
      console.error(err);
      alert("Не удалось отвязать фото");
    }
  };

  const handleAddExistingToAlbum = async (photoId: number) => {
    if (!viewAlbum) return;
    try {
      await galleryApi.update(photoId, { album_id: viewAlbum.id });
      const photo = images.find((p) => p.id === photoId);
      if (photo) {
        setImages((prev) => prev.filter((p) => p.id !== photoId));
        setAlbumImages((prev) => [
          { ...photo, album_id: viewAlbum.id },
          ...prev,
        ]);
      }
    } catch (err) {
      alert("Ошибка добавления в альбом");
    }
  };

  const filteredAvailableImages = useMemo(() => {
    return images.filter(
      (img) =>
        !searchTerm ||
        img.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [images, searchTerm]);

  const imagesByAlbum = useMemo(() => {
    const map = new Map<number, typeof images>();

    for (const img of images) {
      if (img.album_id == null) continue;

      const albumId = Number(img.album_id);

      if (!map.has(albumId)) map.set(albumId, []);
      map.get(albumId)!.push(img);
    }

    return map;
  }, [images]);

  const soloImages = useMemo(() => {
    return images.filter((img) => img.album_id === null);
  }, [images]);

  function AlbumCover({
    images,
    resolveImageUrl,
  }: {
    images: GalleryDTO[];
    resolveImageUrl: (p?: string | null) => string;
  }) {
    if (images.length === 0) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 gap-2">
          <ImageIcon size={32} className="opacity-50" />
          <span className="text-xs">Нет фото</span>
        </div>
      );
    }

    if (images.length === 1) {
      return (
        <img
          src={resolveImageUrl(images[0].image)}
          className="w-full h-full object-cover"
        />
      );
    }

    if (images.length === 2) {
      return (
        <div className="grid grid-cols-2 w-full h-full">
          {images.slice(0, 2).map((img) => (
            <img
              key={img.id}
              src={resolveImageUrl(img.image)}
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      );
    }

    if (images.length === 3) {
      return (
        <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
          <img
            src={resolveImageUrl(images[0].image)}
            className="row-span-2 w-full h-full object-cover"
          />
          {images.slice(1, 3).map((img) => (
            <img
              key={img.id}
              src={resolveImageUrl(img.image)}
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      );
    }

    // 4+
    return (
      <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
        {images.slice(0, 4).map((img) => (
          <img
            key={img.id}
            src={resolveImageUrl(img.image)}
            className="w-full h-full object-cover"
          />
        ))}
      </div>
    );
  }

  // --- RENDERING ---

  return (
    <div className="min-h-screen bg-[var(--color-neutral-950)] text-white font-sans selection:bg-yellow-500/30">
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              Медиа Галерея
            </h1>
            <p className="text-neutral-400 mt-2 text-sm">
              Управляйте изображениями и альбомами вашего проекта
            </p>
          </div>

          {/* TABS NAVIGATION */}
          <nav className="flex p-1 bg-white/5 border border-white/10 rounded-xl relative self-start md:self-auto">
            {["images", "albums"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if (tab === "images") setactiveTabS("images");
                  else setactiveTabS("albums");
                }}
                className={`relative px-6 py-2.5 text-sm font-medium transition-colors z-10 ${
                  activeTabS === tab ||
                  (activeTabS === "albumView" && tab === "albums")
                    ? "text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {(activeTabS === tab ||
                  (activeTabS === "albumView" && tab === "albums")) && (
                  <motion.div
                    layoutId="activeTabS"
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg shadow-yellow-500/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab === "images" ? (
                    <ImageIcon size={16} />
                  ) : (
                    <Layers size={16} />
                  )}
                  {tab === "images" ? "Фотографии" : "Альбомы"}
                </span>
              </button>
            ))}
          </nav>
        </header>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ================= Вкладка ФОТО ================= */}
          {activeTabS === "images" && !loading && (
            <motion.section
              key="images"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* UPLOAD AREA */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Upload size={18} className="text-yellow-500" /> Загрузить
                  изображение
                </h3>
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      id="file-upload"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && handleUpload(e.target.files[0])
                      }
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex items-center justify-center w-full md:w-40 h-12 bg-neutral-800 hover:bg-neutral-700 border border-white/10 rounded-lg transition-all text-sm text-neutral-300 gap-2 px-4 shadow-sm group-hover:border-yellow-500/50"
                    >
                      <Plus size={16} /> Выбрать файл
                    </label>
                  </div>

                  <div className="flex-1 w-full gap-4 flex flex-col md:flex-row">
                    <StyledInput
                      placeholder="Описание изображения..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                    />
                    <select
                      value={selectedAlbumId}
                      onChange={(e) => setSelectedAlbumId(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-yellow-500/50 appearance-none min-w-[200px]"
                    >
                      <option
                        value=""
                        className="bg-neutral-900 text-neutral-400"
                      >
                        Без альбома
                      </option>
                      {albums.map((a) => (
                        <option
                          key={a.id}
                          value={a.id}
                          className="bg-neutral-900"
                        >
                          {a.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  {uploading && (
                    <span className="text-yellow-500 animate-pulse self-center text-sm font-medium">
                      Загрузка...
                    </span>
                  )}
                </div>
              </div>

              {/* IMAGES GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {soloImages.map((img) => (
                  <motion.div
                    key={img.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative bg-neutral-900 border border-white/5 rounded-xl overflow-hidden shadow-lg hover:shadow-yellow-500/5 transition-all duration-300"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={resolveImageUrl(img.image)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        alt=""
                      />
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                        <Button
                          // @ts-ignore
                          className="bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 p-0 flex items-center justify-center"
                          onClick={() => {
                            setEditDescription(img.description || "");
                            setEditingPhotoId(img.id);
                          }}
                        >
                          <Edit3 size={16} />
                        </Button>
                        <Button
                          // @ts-ignore
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 rounded-full w-10 h-10 p-0 flex items-center justify-center"
                          onClick={() => handleDeleteImage(img.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>

                    <div className="p-3">
                      {editingPhotoId === img.id ? (
                        <div className="flex gap-2">
                          <input
                            className="w-full bg-black/20 text-xs text-white p-1 rounded border border-yellow-500/50 outline-none"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            autoFocus
                            onKeyDown={(e) =>
                              e.key === "Enter" && saveDescriptionEdit(img.id)
                            }
                          />
                          <button
                            onClick={() => saveDescriptionEdit(img.id)}
                            className="text-green-400 hover:text-green-300"
                          >
                            <Check size={14} />
                          </button>
                        </div>
                      ) : (
                        <p
                          className="text-xs text-neutral-400 truncate"
                          title={img.description || ""}
                        >
                          {img.description || (
                            <span className="italic opacity-50">
                              Без названия
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ================= Вкладка АЛЬБОМЫ ================= */}
          {activeTabS === "albums" && !loading && (
            <motion.section
              key="albums"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-end mb-6">
                <Button
                  // @ts-ignore
                  onClick={() => {
                    setAlbumForm({ title: "", description: "", id: null });
                    setIsAlbumModalOpen(true);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-yellow-500/20 transition-all"
                >
                  <Plus size={18} /> Создать альбом
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map((album) => {
                  const albumPreviews =
                    imagesByAlbum.get(album.id)?.slice(0, 4) ?? [];

                  return (
                    <div
                      key={album.id}
                      className="relative bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/[0.07] transition-all group hover:border-yellow-500/30 flex flex-col h-full"
                    >
                      {/* === ОБЛОЖКА АЛЬБОМА === */}
                      <div
                        onClick={() => handleOpenAlbum(album.id)}
                        className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-neutral-900 mb-4 relative cursor-pointer border border-white/5"
                      >
                        <AlbumCover
                          images={albumPreviews}
                          resolveImageUrl={resolveImageUrl}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      </div>

                      {/* === ШАПКА === */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                          <Layers size={20} />
                        </div>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setAlbumForm({
                                title: album.title,
                                description: album.description || "",
                                id: album.id,
                              });
                              setIsAlbumModalOpen(true);
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white"
                          >
                            <Edit3 size={16} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAlbum(album.id);
                            }}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-neutral-400 hover:text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* === ИНФО === */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1 text-white truncate px-1">
                          {album.title}
                        </h3>

                        <p className="text-sm text-neutral-400 line-clamp-2 min-h-[2.5rem] px-1 mb-4">
                          {album.description || "Нет описания"}
                        </p>
                      </div>

                      <Button
                        onClick={() => handleOpenAlbum(album.id)}
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-lg text-sm font-medium transition-colors mt-auto"
                      >
                        Открыть альбом
                      </Button>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* ================= Вкладка ПРОСМОТР АЛЬБОМА ================= */}
          {activeTabS === "albumView" && viewAlbum && (
            <motion.section
              key="albumView"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setactiveTabS("albums")}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    {viewAlbum.title}
                    <span className="text-sm font-normal text-neutral-500 border border-white/10 px-2 py-0.5 rounded-md">
                      ID: {viewAlbum.id}
                    </span>
                  </h2>
                  <p className="text-neutral-400 text-sm mt-1">
                    {viewAlbum.description}
                  </p>
                </div>
                <div className="ml-auto">
                  <Button
                    // @ts-ignore
                    onClick={() => setIsAddToAlbumModalOpen(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    <FolderPlus size={16} /> Добавить фото
                  </Button>
                </div>
              </div>

              {/* Album Images Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {albumImages.map((img) => (
                  <div
                    key={img.id}
                    className="group relative bg-neutral-900 border border-white/10 rounded-lg overflow-hidden"
                  >
                    <div className="aspect-square">
                      <img
                        src={resolveImageUrl(img.image)}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-[2px]">
                      <button
                        onClick={() => handleRemoveFromAlbum(img.id)}
                        className="text-xs font-medium text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full border border-white/10"
                      >
                        Отвязать
                      </button>
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-full border border-red-500/20"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
                {albumImages.length === 0 && (
                  <div className="col-span-full py-20 text-center text-neutral-500 border-2 border-dashed border-white/5 rounded-2xl">
                    <p>В этом альбоме пока нет фотографий</p>
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* --- МОДАЛКА СОЗДАНИЯ АЛЬБОМА --- */}
        <AnimatePresence>
          {isAlbumModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#1a1a1a] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">
                    {albumForm.id ? "Редактировать альбом" : "Новый альбом"}
                  </h3>
                  <button
                    onClick={() => setIsAlbumModalOpen(false)}
                    className="text-neutral-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-neutral-400 uppercase font-bold tracking-wider mb-1 block">
                      Название
                    </label>
                    <StyledInput
                      value={albumForm.title}
                      onChange={(e) =>
                        setAlbumForm({ ...albumForm, title: e.target.value })
                      }
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 uppercase font-bold tracking-wider mb-1 block">
                      Описание
                    </label>
                    <StyledTextarea
                      rows={3}
                      value={albumForm.description}
                      onChange={(e) =>
                        setAlbumForm({
                          ...albumForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <Button
                    // @ts-ignore
                    onClick={() => setIsAlbumModalOpen(false)}
                    className="text-neutral-400 hover:text-white px-4"
                  >
                    Отмена
                  </Button>
                  <Button
                    // @ts-ignore
                    onClick={handleSaveAlbum}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-medium"
                  >
                    Сохранить
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- МОДАЛКА ВЫБОРА ФОТО --- */}
        <AnimatePresence>
          {isAddToAlbumModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-[#151515] border border-white/10 w-full max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
              >
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a]">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Добавить в «{viewAlbum?.title}»
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Выберите фото из общей галереи
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddToAlbumModalOpen(false)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4 border-b border-white/5 bg-[#1a1a1a]">
                  <StyledInput
                    placeholder="Поиск по описанию..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-[var(--color-neutral-950)]">
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {filteredAvailableImages.map((img) => (
                      <div
                        key={img.id}
                        onClick={() => handleAddExistingToAlbum(img.id)}
                        className="relative group cursor-pointer aspect-square rounded-lg overflow-hidden border border-white/5 hover:border-yellow-500 transition-colors"
                      >
                        <img
                          src={resolveImageUrl(img.image)}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-yellow-500 text-black rounded-full p-2 shadow-lg scale-0 group-hover:scale-100 transition-transform">
                            <Plus size={24} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {filteredAvailableImages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 text-neutral-500">
                      <ImageIcon size={40} className="mb-2 opacity-20" />
                      <p>Доступных фото не найдено</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
