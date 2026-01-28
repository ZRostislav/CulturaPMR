// services/events.api.ts
import api from "../../api/api";

/* ===== Types ===== */

export interface Event {
  id: number;
  title: string;
  age: number;
  price: number;
  description: string;
  image: string | null;
  link: string;

  location: {
    city: string;
    venue: string;
    address: string;
  };

  schedule: {
    date: string;
    times: string[];
  }[];
}

export type CreateEventPayload = {
  title: string;
  age: number;
  price: number;
  description: string;
  link: string;
  image?: File; // 👈
  location: Event["location"];
  schedule: Event["schedule"];
};

const buildEventFormData = (data: CreateEventPayload) => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("age", String(data.age));
  formData.append("price", String(data.price));
  formData.append("description", data.description);
  formData.append("link", data.link);

  if (data.image) {
    formData.append("image", data.image);
  }

  // сложные объекты — строкой
  formData.append("location", JSON.stringify(data.location));
  formData.append("schedule", JSON.stringify(data.schedule));

  return formData;
};

/* ===== API ===== */

export const eventsApi = {
  // ===== GET ALL =====
  getAll: async (): Promise<Event[]> => {
    const { data } = await api.get("/api/events");
    return data;
  },

  // ===== GET BY ID =====
  getById: async (id: number): Promise<Event> => {
    const { data } = await api.get(`/api/events/${id}`);
    return data;
  },

  // ===== CREATE =====
  create: async (payload: CreateEventPayload): Promise<{ id: number }> => {
    const formData = buildEventFormData(payload);

    const { data } = await api.post("/api/events", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  },

  // ===== UPDATE =====
  update: async (id: number, payload: CreateEventPayload): Promise<void> => {
    const formData = buildEventFormData(payload);

    await api.put(`/api/events/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // ===== DELETE =====
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/events/${id}`);
  },
};
