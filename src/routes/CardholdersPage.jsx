import CardholdersTable from '../components/cardholdersTable/CardholdersTable';
import Navbar from '../components/Navbar';

function CardholdersPage() {
	return (
		<div className='cardholders-body'>
			<Navbar />
			<CardholdersTable />
		</div>
	);
}

export default CardholdersPage;
