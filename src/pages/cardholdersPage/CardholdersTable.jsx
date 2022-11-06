import '../../styles/TablePage.scss';

import React, { useMemo, useState } from 'react';
import { faPenToSquare, faSquarePlus } from '@fortawesome/free-solid-svg-icons';

import CardholderEditor from './CardholderEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../components/Modal';
import Searchbar from '../../components/forms/Searchbar';
import Table from '../../components/Table';
import { Toaster } from 'react-hot-toast';
import { fetchGetById } from '../../helpers/api/fetch';
import { useCardholders } from '../../helpers/api/queries';
import { useEffect } from 'react';

const blankCardholder = {
	_id: '',
	firstName: '',
	lastName: '',
	email: '',
	jobTitle: '',
	profileStatus: true,
	activationDate: new Date(),
	expirationDate: new Date(),
	profileType: 'Employee',
	accessGroups: [],
	credentials: [],
	exists: false,
};

const CardholdersTable = ({ isNavbarOpen }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [cardholderToEdit, setCardholderToEdit] = useState({});
	const [isNewCardholder, setIsNewCardholder] = useState(false);
	const [searchbarValue, setSearchbarValue] = useState('');
	const [searchFilter, setSearchFilter] = useState('firstName');

	/* =======================
            DATA FETCHING
       ======================= */

	const { data, hasNextPage, fetchNextPage, refetch, isFetching, isFetched } = useCardholders(
		searchbarValue,
		searchFilter
	);

	const flatData = useMemo(() => {
		return data?.pages?.flatMap((page) => page.documents) ?? [];
	}, [data]);

	const tableColumns = useMemo(
		() => [
			{
				header: 'Picture',
				accessorKey: 'avatar',
				size: 75,
				cell: (info) => (
					<img
						src={info ? info.getValue() : 'https://robohash.org/hicveldicta.png?size=50x50&set=set1'}
						alt=''
						className='avatar'
					/>
				),
			},
			{
				header: 'First Name',
				accessorKey: 'firstName',
			},
			{
				header: 'Last Name',
				accessorKey: 'lastName',
			},
			{
				header: 'Status',
				accessorKey: 'profileStatus',
				size: 100,
				cell: (info) => {
					return info.getValue() ? (
						<div className='badge green-txt'>Active</div>
					) : (
						<div className='badge red-txt'>Inactive</div>
					);
				},
			},
			{
				header: 'Type',
				accessorKey: 'profileType',
			},
			{
				header: 'Employee ID',
				accessorKey: '_id',
			},
			{
				header: '',
				id: 'editBtn',
				accessorKey: '_id',
				size: 50,
				cell: (info) => {
					return (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
							}}
						>
							<button className='btn-edit-user' onClick={() => editCardholder(info.getValue())}>
								<FontAwesomeIcon icon={faPenToSquare} />
							</button>
						</div>
					);
				},
			},
		],
		[]
	);

	/* =======================
              HANDLERS
       ======================= */

	const newCardholder = () => {
		if (!isModalOpen) {
			setCardholderToEdit({ ...blankCardholder });
			setIsNewCardholder(true);
			setIsModalOpen(true);
		}
	};

	const editCardholder = async (id) => {
		setIsModalOpen(true);
		await fetchGetById('cardholders', id).then((cardholder) => {
			setCardholderToEdit(cardholder);
		});
	};

	const closeCardholderEditor = () => {
		setCardholderToEdit({});
		setIsNewCardholder(false);
		setIsModalOpen(false);
	};

	const onSaveCardholder = (newCardholder) => {
		setCardholderToEdit(newCardholder);
		refetch(); // reloads infiniteQuery data cache
	};

	const handleRowClick = (e, id) => {
		// if double clicked, open editor
		if (e.detail === 2) editCardholder(id);
	};

	useEffect(() => {
		!isModalOpen && setIsNewCardholder(false);
	}, [isModalOpen, setIsNewCardholder]);

	return (
		<>
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
			<Modal
				isOpen={isModalOpen}
				closeModal={closeCardholderEditor}
				overlayClassName={'overlay cardholder-editor'}
				modalClassName={'modal'}
			>
				<CardholderEditor
					key={cardholderToEdit._id}
					cardholder={cardholderToEdit}
					isCardholderNew={isNewCardholder}
					closeModal={closeCardholderEditor}
					onSaveCardholder={onSaveCardholder}
				/>
			</Modal>

			<div className={'table-page' + (isNavbarOpen ? ' navbar-open' : ' navbar-closed')}>
				<div className='table-header'>
					<h1>Cardholders</h1>
					<Searchbar containerClass={'searchbar-container'} setSearchValue={setSearchbarValue} />
					<select name='search' onChange={(e) => setSearchFilter(e.target.value)}>
						<option value='firstName'>First Name</option>
						<option value='lastName'>Last Name</option>
						<option value='employeeId'>Employee ID</option>
					</select>
					<button className='add-btn' onClick={newCardholder}>
						<span>Create Cardholder</span>
						<div className='icon'>
							<FontAwesomeIcon icon={faSquarePlus} />
						</div>
					</button>
				</div>
				<div className='table-body'>
					{data ? (
						<Table
							flatData={flatData}
							columns={tableColumns}
							hasNextPage={hasNextPage}
							fetchNextPage={fetchNextPage}
							isFetching={isFetching}
							searchbarValue={searchbarValue}
							handleRowClick={handleRowClick}
						/>
					) : (
						<div className='loader-container'>
							{isFetched ? <h3>No results...</h3> : <div className='loader'></div>}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default CardholdersTable;
