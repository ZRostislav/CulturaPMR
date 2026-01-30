import api from "../../api/api";

/* ========= Types ========= */
export type GalleryDTO = {
  id: number;
  image: string;
  description: string | null;
};

export type CreateGalleryPayload = {
  imageFile?: File; // ← теперь не обязателен (для update)
  description?: string;
};

/* ========= Helpers ========= */
const buildGalleryFormData = (data: CreateGalleryPayload) => {
  const formData = new FormData();

  if (data.imageFile) {
    formData.append("image", data.imageFile);
  }

  if (data.description !== undefined) {
    formData.append("description", data.description);
  }

  return formData;
};

/* ========= API ========= */
export const galleryApi = {
  /* ========= GET ALL ========= */
  getAll: async (): Promise<GalleryDTO[]> => {
    const { data } = await api.get("/api/gallery");
    return data;
  },

  /* ========= GET ONE ========= */
  getOne: async (id: number | string): Promise<GalleryDTO> => {
    const { data } = await api.get(`/api/gallery/${id}`);
    return data;
  },

  /* ========= CREATE ========= */
  create: async (payload: CreateGalleryPayload): Promise<void> => {
    if (!payload.imageFile) {
      throw new Error("imageFile is required");
    }

    const formData = buildGalleryFormData(payload);
    await api.post("/api/gallery", formData);
  },

  /* ========= UPDATE ========= */
  update: async (
    id: number | string,
    payload: CreateGalleryPayload,
  ): Promise<void> => {
    const formData = buildGalleryFormData(payload);
    await api.put(`/api/gallery/${id}`, formData);
  },

  /* ========= DELETE ========= */
  delete: async (id: number | string): Promise<void> => {
    await api.delete(`/api/gallery/${id}`);
  },
};
