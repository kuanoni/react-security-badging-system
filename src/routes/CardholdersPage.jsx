import CardholdersTable from '../components/cardholdersTable/CardholdersTable';
import Navbar from '../components/Navbar';

function CardholdersPage() {
	return (
		<div className='app'>
			<Navbar />
			<CardholdersTable />
		</div>
	);
}

export default CardholdersPage;
