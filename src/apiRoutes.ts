const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    CHECK: "/api/auth/check",
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
