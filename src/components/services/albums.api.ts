// src/components/services/albums.api.ts
import api from "../../api/api";
import { GalleryDTO } from "./gallery.api"; // Используем тип изображения из gallery.api

/* ========= Types ========= */

export type AlbumDTO = {
  id: number;
  title: string;
  description: string | null;
  created_at?: string; // Опционально, т.к. приходит с сервера
};

export type AlbumWithImagesDTO = {
  album: AlbumDTO;
  images: GalleryDTO[];
};

export type CreateAlbumPayload = {
  title: string;
  description?: string | null;
};

export type UpdateAlbumPayload = {
  title?: string | null;
  description?: string | null;
};

/* ========= API ========= */

export const albumsApi = {
  /* ========= GET ALL ========= */
  getAll: async (): Promise<AlbumDTO[]> => {
    const { data } = await api.get<AlbumDTO[]>("/api/albums");
    return data;
  },

  /* ========= GET ONE ========= */
  getOne: async (id: number | string): Promise<AlbumWithImagesDTO> => {
    const { data } = await api.get<AlbumWithImagesDTO>(`/api/albums/${id}`);
    return data;
  },

  /* ========= CREATE ========= */
  create: async (payload: CreateAlbumPayload): Promise<void> => {
    await api.post("/api/albums", {
      title: payload.title,
      description: payload.description ?? null,
    });
  },

  /* ========= UPDATE ========= */
  update: async (
    id: number | string,
    payload: UpdateAlbumPayload,
  ): Promise<void> => {
    // Формируем объект только из тех полей, которые были переданы (не undefined)
    const clean: Record<string, any> = {};

    if (payload.title !== undefined) clean.title = payload.title;
    if (payload.description !== undefined)
      clean.description = payload.description;

    // Если обновлять нечего, не делаем запрос
    if (Object.keys(clean).length === 0) return;

    await api.put(`/api/albums/${id}`, clean);
  },

  /* ========= DELETE ========= */
  // Удаляет альбом и отвязывает все фото внутри (логика бекенда)
  delete: async (id: number | string): Promise<void> => {
    await api.delete(`/api/albums/${id}`);
  },
};
