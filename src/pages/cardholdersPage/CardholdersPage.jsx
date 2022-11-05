import CardholdersTable from './CardholdersTable';
import Navbar from '../../components/Navbar';
import { useState } from 'react';

function CardholdersPage() {
	const [isNavbarOpen, setIsNavbarOpen] = useState(false);

	return (
		<div className='app'>
			<Navbar isNavbarOpen={isNavbarOpen} setIsNavbarOpen={setIsNavbarOpen} pageName={'cardholders'} />
			<CardholdersTable isNavbarOpen={isNavbarOpen} />
		</div>
	);
}

export default CardholdersPage;
