import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import CardholdersTable from '../components/CardholdersTable';
import Navbar from '../components/Navbar';
import TableHeader from '../components/TableHeader';
import { fetchGetById } from '../api/fetch';

function CardholdersPage() {
	const [navbarIsOpen, setNavbarIsOpen] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [cardholderToEdit, setCardholderToEdit] = useState({});
	const [clearDataCache, setClearDataCache] = useState(() => {});
	const [searchbarValue, setSearchbarValue] = useState('');
	const [searchFilter, setSearchFilter] = useState('firstName');

	const tableColumns = [
		{
			Header: 'Picture',
			accessor: 'avatar',
			Cell: ({ value }) => (
				<img
					src={value ? value : 'https://robohash.org/hicveldicta.png?size=50x50&set=set1'}
					alt=''
					className='avatar'
				/>
			),
			style: {
				width: '100px',
			},
		},
		{
			Header: 'First Name',
			accessor: 'firstName',
		},
		{
			Header: 'Last Name',
			accessor: 'lastName',
		},
		{
			Header: 'Status',
			accessor: 'profileStatus',
			Cell: ({ value }) => {
				return value ? (
					<div className='badge green-txt'>Active</div>
				) : (
					<div className='badge red-txt'>Inactive</div>
				);
			},
			style: {
				width: '120px',
			},
		},
		{
			Header: 'Type',
			accessor: 'profileType',
		},
		{
			Header: 'Employee ID',
			accessor: '_id',
		},
		{
			id: 'editBtn',
			accessor: '_id',
			Cell: ({ value }) => {
				return (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<button className='btn-edit-user' onClick={() => openCardholderEditor(value)}>
							<FontAwesomeIcon icon={faPenToSquare} />
						</button>
					</div>
				);
			},
			style: {
				width: '4rem',
			},
		},
	];

	const openCardholderEditor = async (id) => {
		setIsModalOpen(true);
		await fetchGetById('cardholders', id).then((cardholder) => {
			setCardholderToEdit(cardholder);
		});
	};

	const closeCardholderEditor = () => {
		setIsModalOpen(false);
		setCardholderToEdit({});
	};

	return (
		<div className='app'>
			<div className={'cardholders-page' + (navbarIsOpen ? '' : ' navbar-closed')}>
				<Navbar buttonsIsOpen={navbarIsOpen} setButtonsIsOpen={setNavbarIsOpen} />
				<TableHeader
					setSearchbarValue={setSearchbarValue}
					setSearchSetting={setSearchFilter}
					clearDataCache={clearDataCache}
				/>
				<CardholdersTable
					className={navbarIsOpen ? '' : ' navbar-closed'}
					tableColumns={tableColumns}
					searchbarValue={searchbarValue}
					searchFilter={searchFilter}
					isModalOpen={isModalOpen}
					cardholderToEdit={cardholderToEdit}
					setCardholderToEdit={setCardholderToEdit}
					openCardholderEditor={openCardholderEditor}
					closeCardholderEditor={closeCardholderEditor}
					setClearDataCache={setClearDataCache}
				/>
			</div>
		</div>
	);
}

export default CardholdersPage;
