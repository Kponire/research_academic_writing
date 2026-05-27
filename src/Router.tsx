import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import AppLayout from "./components/layout/AppLayout";
import GeneratePaperPage from "./pages/GeneratePaperPage";
import MyPapersPage from "./pages/MyPapersPage";
import CollaborationsPage from "./pages/CollaborationsPage";
import JournalSubmissionsPage from "./pages/JournalSubmissionsPage";
import DiscoverJournalsPage from "./pages/DiscoverJournalsPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import { AchievementsPage } from "./pages/AchievementsPage";
import { SettingsPage } from "./pages/SettingsPage";

const router = createBrowserRouter([
  {
    path: "/dashboard/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "generate",
        element: <GeneratePaperPage />,
      },
      {
        path: "papers",
        element: <MyPapersPage />,
      },
      {
        path: "collaborations",
        element: <CollaborationsPage />,
      },
      {
        path: "submissions",
        element: <JournalSubmissionsPage />,
      },
      {
        path: "discover",
        element: <DiscoverJournalsPage />,
      },
      {
        path: "reviews",
        element: <ReviewsPage />,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "achievements",
        element: <AchievementsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
