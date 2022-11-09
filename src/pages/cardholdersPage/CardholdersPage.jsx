import CardholdersTable from './CardholdersTable';
import Navbar from '../../components/Navbar';
import { Toaster } from 'react-hot-toast';
import { useColorTheme } from '../../hooks/useColorTheme';
import { useState } from 'react';

function CardholdersPage() {
	const [isNavbarOpen, setIsNavbarOpen] = useState(false);
	const { themes, themeIndex } = useColorTheme();

	return (
		<div className='app'>
			<Toaster
				toastOptions={{
					className: 'toast',
					success: {
						iconTheme: {
							primary: themes[themeIndex].accent.join(', '),
							secondary: '#ffffff',
						},
					},
				}}
			/>
			<Navbar isNavbarOpen={isNavbarOpen} setIsNavbarOpen={setIsNavbarOpen} pageName={'cardholders'} />
			<div className={'table-page' + (isNavbarOpen ? ' navbar-open' : ' navbar-closed')}>
				<div className='table-page-container'>
					<CardholdersTable />
				</div>
			</div>
		</div>
	);
}

export default CardholdersPage;
