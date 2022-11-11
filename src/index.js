import './index.scss';

import CardholderEditor, { cardholderEditorLoader } from './pages/cardholdersPage/CardholderEditor';
import CredentialEditor, { credentialEditorLoader } from './pages/credentialsPage/CredentialEditor';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import CardholdersPage from './pages/cardholdersPage/CardholdersPage';
import CredentialsPage from './pages/credentialsPage/CredentialsPage';
import ErrorPage from './pages/ErrorPage';
import React from 'react';
import ReactDOM from 'react-dom/client';
import RootPage from './pages/RootPage';

const queryClient = new QueryClient();

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootPage />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <Navigate to={'/cardholders'} />,
			},
			{
				path: '/cardholders',
				element: <CardholdersPage />,
				children: [
					{
						path: '/cardholders/:id',
						element: <CardholderEditor />,
						loader: cardholderEditorLoader(queryClient),
					},
					{
						path: '/cardholders/newCardholder',
						element: <CardholderEditor />,
						loader: () => ({
							isCreatingData: true,
						}),
					},
				],
			},
			{
				path: '/credentials',
				element: <CredentialsPage />,
				children: [
					{
						path: '/credentials/:id',
						element: <CredentialEditor />,
						loader: credentialEditorLoader(queryClient),
					},
					{
						path: '/credentials/newCredential',
						element: <CredentialEditor />,
						loader: () => ({
							isCreatingData: true,
						}),
					},
				],
			},
		],
	},
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</React.StrictMode>
);
