import React, { useEffect, useMemo, useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
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

	const { data, fetchNextPage, hasNextPage, refetch, isFetchingNextPage, isFetching, isFetched } = useCardholders(
		searchbarValue,
		searchFilter
	);

	const flatData = useMemo(() => {
		return data?.pages?.flatMap((page) => page.documents) ?? [];
	}, [data]);

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
		{
			Header: 'Debug ID',
			accessor: 'debugId',
		},
	];

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

	// const tableContainerRef = React.useRef(null);

	// const rowVirtualizer = useVirtualizer({
	// 	count: hasNextPage ? flatData.length + 1 : flatData.length,
	// 	getScrollElement: () => tableContainerRef.current,
	// 	estimateSize: () => 48,
	// 	overscan: 5,
	// });

	// useEffect(() => {
	// 	const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

	// 	if (!lastItem) {
	// 		return;
	// 	}

	// 	if (lastItem.index >= flatData.length - 1 && hasNextPage && !isFetchingNextPage) {
	// 		fetchNextPage();
	// 	}
	// }, [hasNextPage, fetchNextPage, flatData.length, isFetchingNextPage, rowVirtualizer.getVirtualItems()]);

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
							pages={data.pages}
							columns={tableColumns}
							handleRowClick={handleRowClick}
							fetchNextPage={fetchNextPage}
							isFetching={isFetching}
						/>
					) : (
						<div className='loader-container'>
							{isFetched ? <h3>No results...</h3> : <div className='loader'></div>}
						</div>
					)}
					{hasNextPage && (
						<div className='load-more-container'>
							{!isFetching ? (
								<FontAwesomeIcon icon={faAngleDoubleDown} />
							) : (
								<div className='loader-container'>
									<div className='loader'></div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default CardholdersTable;
