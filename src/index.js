import './index.scss';

import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import CardholdersPage from './pages/cardholdersPage/CardholdersPage';
import CredentialsPage from './pages/credentialsPage/CredentialsPage';
import ErrorPage from './pages/ErrorPage';
import React from 'react';
import ReactDOM from 'react-dom/client';
import RootPage from './pages/RootPage';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootPage />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <Navigate to={'cardholders'} />,
			},
			{
				path: 'cardholders',
				element: <CardholdersPage />,
			},
			{
				path: 'credentials',
				element: <CredentialsPage />,
			},
		],
	},
]);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</React.StrictMode>
);
