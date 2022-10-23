import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import './index.scss';
import CardholdersPage from './routes/CardholdersPage';
import ErrorPage from './components/ErrorPage';
import CredentialsPage from './routes/CredentialsPage';

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
			{/* <App /> */}
		</QueryClientProvider>
	</React.StrictMode>
);
