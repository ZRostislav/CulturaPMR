// src/components/services/gallery.api.ts
import api from "../../api/api";

/* ========= Types ========= */
export type MediaType = "image" | "video";

export type GalleryDTO = {
  id: number;
  image: string;
  description: string | null;
  album_id: number | null;
  created_at?: string;
  media_type: MediaType;
};

export type CreateGalleryPayload = {
  imageFile?: File; // Обязательно при создании, опционально при обновлении
  description?: string | null;
  album_id?: number | null;
};

/* ========= Helpers ========= */
const buildGalleryFormData = (data: CreateGalleryPayload): FormData => {
  const formData = new FormData();

  if (data.imageFile instanceof File) {
    formData.append("image", data.imageFile);
  }

  if (data.description !== undefined) {
    formData.append("description", data.description ?? "");
  }

  // Для album_id логика такая:
  // Если пришел null -> отправляем пустую строку (бекенд преобразует в NULL)
  // Если пришло число -> отправляем строку с числом
  if (data.album_id !== undefined) {
    formData.append(
      "album_id",
      data.album_id === null ? "" : String(data.album_id),
    );
  }

  return formData;
};

/* ========= API ========= */
export const galleryApi = {
  /* ========= GET ALL (No Album) ========= */
  // Возвращает фото, не привязанные к альбомам
  getAll: async (): Promise<GalleryDTO[]> => {
    const { data } = await api.get<GalleryDTO[]>("/api/gallery");
    return data;
  },

  /* ========= GET ALL (WITH ALBUMS) ========= */
  getAllWithAlbums: async (): Promise<GalleryDTO[]> => {
    const { data } = await api.get<GalleryDTO[]>("/api/gallery/all");
    return data;
  },

  /* ========= GET ONE ========= */
  getOne: async (id: number | string): Promise<GalleryDTO> => {
    const { data } = await api.get<GalleryDTO>(`/api/gallery/${id}`);
    return data;
  },

  /* ========= CREATE ========= */
  create: async (payload: CreateGalleryPayload): Promise<void> => {
    if (!payload.imageFile) {
      throw new Error("imageFile is required for creation");
    }

    const formData = buildGalleryFormData(payload);

    await api.post("/api/gallery", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /* ========= UPDATE ========= */
  update: async (
    id: number | string,
    payload: CreateGalleryPayload,
  ): Promise<void> => {
    const formData = buildGalleryFormData(payload);

    // Защита от пустого запроса (если FormData пустой)
    // Array.from(formData.keys()) работает надежнее спреда в старых браузерах
    if (Array.from(formData.keys()).length === 0) {
      return;
    }

    await api.put(`/api/gallery/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /* ========= DETACH FROM ALBUM (NEW) ========= */
  // Убирает фото из альбома (album_id = NULL), но НЕ удаляет файл
  detachFromAlbum: async (id: number | string): Promise<void> => {
    await api.delete(`/api/gallery/${id}/detach`);
  },

  /* ========= DELETE (HARD) ========= */
  // Удаляет фото полностью из базы
  delete: async (id: number | string): Promise<void> => {
    await api.delete(`/api/gallery/${id}`);
  },
};
