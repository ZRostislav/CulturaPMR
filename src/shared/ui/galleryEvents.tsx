import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { galleryApi, GalleryDTO } from "../../components/services/gallery.api";
import { albumsApi, AlbumDTO } from "../../components/services/albums.api";

// --- Types ---
type LightboxContext = {
  items: GalleryDTO[];
  startIndex: number;
  albumTitle?: string;
  albumDesc?: string;
};

// --- Animations ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

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

export default function GalleryEvents() {
  const [albums, setAlbums] = useState<AlbumDTO[]>([]);
  const [images, setImages] = useState<GalleryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Unified Lightbox State
  const [lightboxData, setLightboxData] = useState<LightboxContext | null>(
    null,
  );

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [imgData, albumData] = await Promise.all([
          galleryApi.getAllWithAlbums(),
          albumsApi.getAll(),
        ]);
        setImages(imgData);
        setAlbums(albumData);
      } catch (e) {
        console.error("Ошибка загрузки", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter data
  const soloImages = images.filter((img) => !img.album_id);

  const albumsWithImages = albums
    .map((album) => ({
      ...album,
      images: images.filter((img) => img.album_id === album.id),
    }))
    .filter((album) => album.images.length > 0); // Hide empty albums

  // Handlers
  const openAlbum = (album: (typeof albumsWithImages)[0]) => {
    setLightboxData({
      items: album.images,
      startIndex: 0,
      albumTitle: album.title,
      albumDesc: album.description,
    });
  };

  const openSoloImage = (img: GalleryDTO) => {
    setLightboxData({
      items: [img], // Treat as a list of 1 for uniformity
      startIndex: 0,
    });
  };

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

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="container mx-auto px-4 py-16 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
            Галерея <span className="text-yellow-500">событий</span>
          </h2>
          <div className="h-1 w-24 bg-yellow-500 mx-auto rounded-full opacity-80" />
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="space-y-20">
            {/* Albums Section */}
            {albumsWithImages.length > 0 && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {albumsWithImages.map((album) => (
                  <AlbumCard
                    key={album.id}
                    album={album}
                    apiUrl={API_URL}
                    onClick={() => openAlbum(album)}
                  />
                ))}
              </motion.div>
            )}

            {/* Solo Images Section */}
            {soloImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <ImageIcon className="text-yellow-500 w-6 h-6" />
                    Отдельные кадры
                  </h3>
                  <div className="h-px bg-white/10 flex-grow" />
                </div>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  {soloImages.map((img) => (
                    <PhotoCard
                      key={img.id}
                      img={img}
                      apiUrl={API_URL}
                      onClick={() => openSoloImage(img)}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxData && (
          <Lightbox
            data={lightboxData}
            onClose={() => setLightboxData(null)}
            apiUrl={API_URL}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Component: Album Card ---
const AlbumCard = ({
  album,
  apiUrl,
  onClick,
}: {
  album: AlbumDTO & { images: GalleryDTO[] };
  apiUrl: string;
  onClick: () => void;
}) => {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="group cursor-pointer relative aspect-[4/5] overflow-hidden rounded-xl bg-neutral-900 shadow-xl ring-1 ring-white/10"
    >
      {/* AlbumCover вместо img */}
      <AlbumCover
        images={album.images}
        resolveImageUrl={(p) => `${apiUrl}${p}`}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end h-full">
        <div className="translate-y-4 transform transition-transform duration-300 group-hover:translate-y-0">
          <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold uppercase tracking-widest mb-2">
            <Layers className="w-4 h-4" />
            <span>Альбом • {album.images.length} фото</span>
          </div>
          <h3 className="text-xl font-bold text-white leading-tight mb-2 group-hover:text-yellow-400 transition-colors">
            {album.title}
          </h3>
          <p className="text-sm text-neutral-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            {album.description ||
              "Нажмите, чтобы просмотреть фотографии этого события."}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// --- Component: Photo Card ---
const PhotoCard = ({
  img,
  apiUrl,
  onClick,
}: {
  img: GalleryDTO;
  apiUrl: string;
  onClick: () => void;
}) => {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-neutral-900 border border-white/5"
    >
      <img
        src={`${apiUrl}${img.image}`}
        alt="Gallery item"
        className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
      />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="bg-black/50 backdrop-blur-sm p-2 rounded-full text-white">
          <ImageIcon size={20} />
        </div>
      </div>
    </motion.div>
  );
};

// --- Component: Lightbox ---
const Lightbox = ({
  data,
  onClose,
  apiUrl,
}: {
  data: LightboxContext;
  onClose: () => void;
  apiUrl: string;
}) => {
  const [index, setIndex] = useState(data.startIndex);
  const currentImg = data.items[index];
  const isMultiple = data.items.length > 1;

  // Keyboard navigation
  const handleNext = useCallback(() => {
    if (isMultiple) setIndex((prev) => (prev + 1) % data.items.length);
  }, [isMultiple, data.items.length]);

  const handlePrev = useCallback(() => {
    if (isMultiple)
      setIndex((prev) => (prev - 1 + data.items.length) % data.items.length);
  }, [isMultiple, data.items.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/95 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
      >
        <X size={28} />
      </button>

      {/* Content Container */}
      <div
        className="relative w-full h-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center p-4 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Image */}
        <div className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImg.id}
              src={`${apiUrl}${currentImg.image}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-full max-h-full object-contain rounded-md shadow-2xl drop-shadow-2xl"
            />
          </AnimatePresence>

          {/* Navigation Arrows */}
          {isMultiple && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 md:-left-12 p-3 text-white/50 hover:text-yellow-500 hover:scale-110 transition-all"
              >
                <ChevronLeft size={40} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 md:-right-12 p-3 text-white/50 hover:text-yellow-500 hover:scale-110 transition-all"
              >
                <ChevronRight size={40} />
              </button>
            </>
          )}
        </div>

        {/* Info Panel (Only for Albums) */}
        {data.albumTitle && (
          <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none md:static md:w-[300px] md:text-left md:pl-8 md:h-[80vh] md:flex md:flex-col md:justify-end">
            <div className="bg-black/60 backdrop-blur-md p-4 md:bg-transparent md:backdrop-blur-none md:p-0 rounded-xl inline-block pointer-events-auto">
              <span className="text-yellow-500 font-bold uppercase tracking-widest text-xs mb-2 block">
                {index + 1} / {data.items.length}
              </span>
              <h3 className="text-white text-xl font-bold mb-2">
                {data.albumTitle}
              </h3>
              {data.albumDesc && (
                <p className="text-neutral-400 text-sm leading-relaxed max-w-md md:max-w-none mx-auto">
                  {data.albumDesc}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
