import { Suspense, useState } from 'react';

import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useColorTheme } from '../hooks/useColorTheme';

const RootPage = () => {
	const [isNavbarOpen, setIsNavbarOpen] = useState(false);
	const { themes, themeIndex } = useColorTheme();

	return (
		<div className={'app' + (isNavbarOpen ? ' navbar-open' : ' navbar-closed')}>
			<Toaster
				toastOptions={{
					className: 'toast',
					success: {
						iconTheme: {
							primary: 'hsl(' + themes[themeIndex].accent.join(', ') + ')',
							secondary: '#ffffff',
						},
					},
				}}
			/>
			<Navbar isNavbarOpen={isNavbarOpen} setIsNavbarOpen={setIsNavbarOpen} pageName={'cardholders'} />
			<Suspense
				fallback={
					<div className='container'>
						<div className='loader'></div>
					</div>
				}
			>
				<Outlet />
			</Suspense>
		</div>
	);
};

export default RootPage;
