import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useColorTheme } from '../hooks/useColorTheme';
import { useState } from 'react';

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
			<Outlet />
		</div>
	);
};

export default RootPage;
