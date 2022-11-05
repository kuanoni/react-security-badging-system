import './index.scss';

import { QueryClient, QueryClientProvider } from 'react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import CardholdersPage from './pages/cardholdersPage/CardholdersPage';
import CredentialsPage from './pages/credentialsPage/CredentialsPage';
import ErrorPage from './pages/ErrorPage';
import React from 'react';
import ReactDOM from 'react-dom/client';

const router = createBrowserRouter([
	{
		path: '/',
		element: <CardholdersPage />,
		errorElement: <ErrorPage />,
	},
	{
		path: 'credentials/',
		element: <CredentialsPage />,
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
