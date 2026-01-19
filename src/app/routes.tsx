// router.tsx
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../Layout/Layout";
import { Home } from "../Pages/Home/Home";
import { AdminPage } from "../Pages/Admin/AdminPage";
import { EventsPage } from "../Pages/Admin/EventsPage";
import { ProtectedRoute } from "../routes/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "admin", element: <AdminPage /> }, // страница логина
      {
        path: "admin/events",
        element: (
          <ProtectedRoute>
            <EventsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
