import '../../styles/TablePage.scss';

import { Outlet, useNavigate } from 'react-router-dom';
import React, { useMemo, useState } from 'react';
import { faPenToSquare, faSquarePlus } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../components/Modal';
import Searchbar from '../../components/forms/Searchbar';
import Table from '../../components/Table';
import { useCallback } from 'react';
import { useCardholders } from '../../helpers/api/queries';

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
};

const CardholdersPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isCardholderNew, setIsCardholderNew] = useState(false);
	const [searchbarValue, setSearchbarValue] = useState('');
	const [searchFilter, setSearchFilter] = useState('firstName');
	const [sorting, setSorting] = useState([]);

	const query = useCardholders(
		{ value: searchbarValue, filter: searchFilter },
		sorting.length ? { by: sorting[0].id, order: sorting[0].desc ? 'desc' : 'asc' } : { by: '', order: '' }
	);

	const navigate = useNavigate();
	const { refetch } = query;

	/* =======================
              HANDLERS
       ======================= */

	const newCardholder = () => {
		if (!isModalOpen) {
			setIsCardholderNew(true);
			setIsModalOpen(true);
		}
	};

	const editCardholder = useCallback(
		(id) => {
			setIsModalOpen(true);
			navigate('./' + id);
		},
		[setIsModalOpen, navigate]
	);

	const closeCardholderEditor = () => {
		setIsCardholderNew(false);
		setIsModalOpen(false);
		navigate('./');
	};

	const onUpdateCardholder = (newCardholder) => {
		refetch(); // reloads infiniteQuery data cache
	};

	const tableColumns = useMemo(
		() => [
			{
				header: 'Picture',
				accessorKey: 'avatar',
				size: 75,
				enableSorting: false,
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
				size: 60,
				enableResizing: false,
				enableSorting: false,
				cell: (info) => {
					return (
						<button className='btn-edit-user' onClick={() => editCardholder(info.getValue())}>
							<FontAwesomeIcon icon={faPenToSquare} />
						</button>
					);
				},
			},
		],
		[editCardholder]
	);

	const tableComponent = useMemo(
		() => (
			<Table
				query={query}
				columns={tableColumns}
				sorting={sorting}
				setSorting={setSorting}
				onRowClick={editCardholder}
			/>
		),
		[query, tableColumns, sorting, setSorting, editCardholder]
	);

	return (
		<>
			<Outlet context={[isCardholderNew, isModalOpen, closeCardholderEditor, onUpdateCardholder]} />

			<div className={'table-page'}>
				<div className='table-page-container'>
					<div className='table-header'>
						<h1>Cardholders</h1>
						<Searchbar containerClass={'searchbar-container'} setSearchValue={setSearchbarValue} />
						<select name='search' onChange={(e) => setSearchFilter(e.target.value)}>
							<option value='firstName'>First Name</option>
							<option value='lastName'>Last Name</option>
							<option value='profileType'>Type</option>
							<option value='_id'>Employee ID</option>
						</select>
						<button className='add-btn' onClick={newCardholder}>
							<span>Create Cardholder</span>
							<div className='icon'>
								<FontAwesomeIcon icon={faSquarePlus} />
							</div>
						</button>
					</div>
					<div className='table-body'>{tableComponent}</div>
				</div>
			</div>
		</>
	);
};

export default CardholdersPage;
