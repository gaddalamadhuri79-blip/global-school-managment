import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import AppLayout from "./components/AppLayout";
import RequireAuth from "./components/auth/RequireAuth";
import DashboardPage from "./pages/DashboardPage";
import ReportsPage from "./pages/ReportsPage";
import SearchPage from "./pages/SearchPage";
import StudentDetailPage from "./pages/StudentDetailPage";
import StudentsPage from "./pages/StudentsPage";

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  ),
});

const studentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students",
  component: () => (
    <RequireAuth>
      <StudentsPage />
    </RequireAuth>
  ),
});

const studentDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students/$studentId",
  component: () => (
    <RequireAuth>
      <StudentDetailPage />
    </RequireAuth>
  ),
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: () => (
    <RequireAuth>
      <SearchPage />
    </RequireAuth>
  ),
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  component: () => (
    <RequireAuth>
      <ReportsPage />
    </RequireAuth>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  studentsRoute,
  studentDetailRoute,
  searchRoute,
  reportsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
