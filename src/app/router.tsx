import { lazy } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';

const HomePage = lazy(async () => ({ default: (await import('../pages/HomePage')).HomePage }));
const EventsPage = lazy(async () => ({ default: (await import('../pages/EventsPage')).EventsPage }));
const HistoryPage = lazy(async () => ({ default: (await import('../pages/HistoryPage')).HistoryPage }));
const DashboardPage = lazy(async () => ({ default: (await import('../pages/DashboardPage')).DashboardPage }));
const RewardsPage = lazy(async () => ({ default: (await import('../pages/RewardsPage')).RewardsPage }));
const SettingsPage = lazy(async () => ({ default: (await import('../pages/SettingsPage')).SettingsPage }));

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
