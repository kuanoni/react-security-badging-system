import './index.scss';

import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import ErrorPage from './pages/ErrorPage';
import React from 'react';
import ReactDOM from 'react-dom/client';
import RootPage from './pages/RootPage';
import { cardholderEditorLoader } from './pages/cardholdersPage/CardholderEditor';
import { credentialEditorLoader } from './pages/credentialsPage/CredentialEditor';

const CardholdersPage = React.lazy(() => import('./pages/cardholdersPage/CardholdersPage'));
const CredentialsPage = React.lazy(() => import('./pages/credentialsPage/CredentialsPage'));
const CardholderEditor = React.lazy(() => import('./pages/cardholdersPage/CardholderEditor'));
const CredentialEditor = React.lazy(() => import('./pages/credentialsPage/CredentialEditor'));

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
