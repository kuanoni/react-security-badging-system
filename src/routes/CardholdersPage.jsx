import CardholdersTable from '../components/cardholdersTable/CardholdersTable';
import Navbar from '../components/Navbar';
import '../index.scss';

function CardholdersPage() {
	return (
		<div className='cardholders-body'>
			<Navbar />
			<CardholdersTable />
		</div>
	);
}

export default CardholdersPage;
