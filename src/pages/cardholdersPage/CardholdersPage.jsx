import toast, { Toaster } from 'react-hot-toast';

import CardholdersTable from './CardholdersTable';
import Navbar from '../../components/Navbar';
import { useState } from 'react';

function CardholdersPage() {
	const [isNavbarOpen, setIsNavbarOpen] = useState(false);

	return (
		<div className='app'>
			<Toaster
				toastOptions={{
					className: 'toast',
					success: {
						iconTheme: {
							primary: '#0086c5',
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
