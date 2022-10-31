import { useState } from 'react';
import CardholdersTable from '../components/cardholdersTable/CardholdersTable';
import Navbar from '../components/Navbar';

function CardholdersPage() {
	const [isNavbarOpen, setIsNavbarOpen] = useState(true);

	return (
		<div className='app'>
			<Navbar isNavbarOpen={isNavbarOpen} setIsNavbarOpen={setIsNavbarOpen} />
			<CardholdersTable isNavbarOpen={isNavbarOpen} />
		</div>
	);
}

export default CardholdersPage;
