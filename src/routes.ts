import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { AdminPage } from "./components/AdminPage";
import { EventsPage } from "./components/EventsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },

      { path: "admin", Component: AdminPage },
      { path: "admin/events", Component: EventsPage },
    ],
  },
]);
