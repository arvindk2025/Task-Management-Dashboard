import { createBrowserRouter } from 'react-router-dom';

import { LandingPage } from 'src/features/landing/pages/LandingPage';
import { TaskDashboard } from 'src/features/task/pages/TaskDashboard';
import { AppLayout } from 'src/shared/components/AppLayout';

export const router = createBrowserRouter([
	{
		element: <AppLayout />,
		children: [
			{
				path: '/',
				element: <LandingPage />,
			},
			{
				path: '/dashboard',
				element: <TaskDashboard />,
			},
		],
	},
]);
