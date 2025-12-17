// apiRoutes.ts
const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
  },
  EVENTS: {
    GET_ALL: "/api/events",
    CREATE: "/api/events",
    UPDATE: (id: number | string) => `/api/events/${id}`,
    DELETE: (id: number | string) => `/api/events/${id}`,
    DELETE_ALL: "/api/events",
  },
};

export default API_ROUTES;
