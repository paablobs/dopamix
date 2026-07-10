import { createHashRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { HomePage } from '../pages/HomePage';
import { EventsPage } from '../pages/EventsPage';
import { HistoryPage } from '../pages/HistoryPage';
import { DashboardPage } from '../pages/DashboardPage';
import { RewardsPage } from '../pages/RewardsPage';
import { SettingsPage } from '../pages/SettingsPage';

const router = createHashRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/events', element: <EventsPage /> },
      { path: '/history', element: <HistoryPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/rewards', element: <RewardsPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
