// services/eventShowcase.api.ts
import api from "../../api/api";

/* ========= Types ========= */
export type EventDTO = {
  id: number;
  title: string;
  description: string;
  image: string | null;
  ticket_link: string | null;
  created_at: string;
};

export type CreateEventPayload = {
  title: string;
  description: string;
  ticket_link?: string;

  imageFile?: File;
  imageUrl?: string;
};

/* ========= Helpers ========= */
const buildEventFormData = (data: CreateEventPayload) => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("description", data.description);

  if (data.ticket_link) {
    formData.append("ticket_link", data.ticket_link);
  }

  if (data.imageFile) {
    formData.append("image", data.imageFile); // multer
  }

  if (data.imageUrl) {
    formData.append("image_url", data.imageUrl); // обычная строка
  }

  return formData;
};

/* ========= API ========= */

export const eventShowcaseApi = {
  /* ========= GET ALL ========= */
  getAll: async (): Promise<EventDTO[]> => {
    const { data } = await api.get("/api/eventShowcase");
    return data;
  },

  /* ========= CREATE ========= */
  create: async (payload: CreateEventPayload) => {
    const formData = buildEventFormData(payload);
    await api.post("/api/eventShowcase", formData);
  },

  /* ========= UPDATE ========= */
  update: async (id: any, payload: CreateEventPayload) => {
    const formData = buildEventFormData(payload);
    await api.put(`/api/eventShowcase/${id}`, formData);
  },

  /* ========= DELETE ========= */
  delete: async (id: number | string): Promise<void> => {
    await api.delete(`/api/eventShowcase/${id}`);
  },

  /* ========= DELETE ALL ========= */
  deleteAll: async (): Promise<void> => {
    await api.delete("/api/eventShowcase");
  },
};
