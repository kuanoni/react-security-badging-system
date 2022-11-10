import { useMemo, useState } from 'react';

import CardholdersTable from './CardholdersTable';
import Navbar from '../../components/Navbar';
import { Toaster } from 'react-hot-toast';
import { useColorTheme } from '../../hooks/useColorTheme';

function CardholdersPage() {
	const [isNavbarOpen, setIsNavbarOpen] = useState(false);
	const { themes, themeIndex } = useColorTheme();

	const tableSection = useMemo(() => <CardholdersTable />, []);

	return (
		<div className='app'>
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
			<div className={'table-page' + (isNavbarOpen ? ' navbar-open' : ' navbar-closed')}>
				<div className='table-page-container'>{tableSection}</div>
			</div>
		</div>
	);
}

export default CardholdersPage;
