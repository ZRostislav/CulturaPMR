// services/events.api.ts
import api from "../api/api";
import API_ROUTES from "../api/apiRoutes.js";

export const getAllEvents = async () => {
  const { data } = await api.get(API_ROUTES.EVENTS.GET_ALL);
  return data;
};

export const createEvent = async (formData: FormData) => {
  await api.post(API_ROUTES.EVENTS.CREATE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateEvent = async (id: number | string, formData: FormData) => {
  await api.put(API_ROUTES.EVENTS.UPDATE(id), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteEvent = async (id: number | string) => {
  await api.delete(API_ROUTES.EVENTS.DELETE(id));
};

export const deleteAllEvents = async () => {
  await api.delete(API_ROUTES.EVENTS.DELETE_ALL);
};
