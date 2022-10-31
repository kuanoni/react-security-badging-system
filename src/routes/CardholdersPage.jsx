import { useState } from 'react';
import CardholdersTable from '../components/cardholdersTable/CardholdersTable';
import Navbar from '../components/Navbar';

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
