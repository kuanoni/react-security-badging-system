import React, { useMemo, useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { fetchGetById } from '../../api/fetch';
import CardholderEditor from './CardholderEditor';
import Table from '../Table';
import Modal from '../Modal';
import Searchbar from '../forms/Searchbar';
import { useCardholders } from '../../api/queries';

const CardholdersTable = ({ isNavbarOpen }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [cardholderToEdit, setCardholderToEdit] = useState({});
	const [searchbarValue, setSearchbarValue] = useState('');
	const [searchFilter, setSearchFilter] = useState('firstName');

	/* =======================
            DATA FETCHING
       ======================= */

	const { data, fetchNextPage, hasNextPage, refetch, isFetching, isFetched } = useCardholders(
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
							<button className='btn-edit-user' onClick={() => openCardholderEditor(info.getValue())}>
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

	const onSaveCardholder = (newCardholder) => {
		setCardholderToEdit(newCardholder);
		refetch(); // reloads infiniteQuery data cache
	};

	const onChangeSearchbar = useAsyncDebounce((value) => {
		setSearchbarValue(value);
		refetch(); // reloads infiniteQuery data cache on search
	}, 500);

	const onChangeSearchSetting = (value) => {
		setSearchFilter(value);
	};

	const handleRowClick = (e, id) => {
		// if double clicked, open editor
		if (e.detail === 2) openCardholderEditor(id);
	};

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
					closeModal={closeCardholderEditor}
					onSaveCardholder={onSaveCardholder}
				/>
			</Modal>

			<div className={'table-page' + (isNavbarOpen ? ' navbar-open' : ' navbar-closed')}>
				<div className='table-header'>
					<h1>Cardholders</h1>
					<Searchbar
						containerClass={'searchbar-container'}
						onChange={onChangeSearchbar}
						setClear={setSearchbarValue}
					/>
					<select name='search' onChange={(e) => onChangeSearchSetting(e.target.value)}>
						<option value='firstName'>First Name</option>
						<option value='lastName'>Last Name</option>
						<option value='employeeId'>Employee ID</option>
					</select>
				</div>
				<div className='table-body'>
					{data ? (
						<Table
							flatData={flatData}
							columns={tableColumns}
							handleRowClick={handleRowClick}
							hasNextPage={hasNextPage}
							fetchNextPage={fetchNextPage}
							isFetching={isFetching}
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
