// router.tsx
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../Layout/Layout";
import { Home } from "../Pages/Home/Home";
import { Error } from "../Pages/Error/Error";
import { AdminPage } from "../Pages/Admin/AdminPage";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import { ControlsPage } from "../Pages/Admin/ControlsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />, // Обработка критических ошибок рендеринга
    children: [
      { index: true, element: <Home /> },
      { path: "admin", element: <AdminPage /> },
      {
        path: "admin/controls",
        element: (
          <ProtectedRoute>
            <ControlsPage />
          </ProtectedRoute>
        ),
      },
      // 404 - Страница не найдена
      { path: "*", element: <Error /> },
    ],
  },
]);
