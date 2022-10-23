import React, { useMemo, useRef, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useAsyncDebounce } from 'react-table';
import { Toaster } from 'react-hot-toast';
import { fetchCardholder, fetchCardholders } from '../../api/fetch';
import CardholderEditor from '../cardholderEditor/CardholderEditor';
import Table from '../Table';
import Modal from '../Modal';
import '../../styles/CardholderTable.scss';

const CardholdersTable = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [cardholderToEdit, setCardholderToEdit] = useState({});
	const [cardholderCount, setCardholderCount] = useState(0);
	const [searchbarValue, setSearchbarValue] = useState('');
	const [searchFilter, setSearchFilter] = useState('firstName');

	const searchbarRef = useRef(null);

	const searchUrlString = useMemo(() => {
		return searchbarValue ? `?${searchFilter}=${searchbarValue}` : '';
	}, [searchbarValue, searchFilter]);

	const { data, fetchNextPage, remove, isFetching, isFetched } = useInfiniteQuery(
		['table-data', searchbarValue, searchFilter],
		async ({ pageParam = 0 }) => {
			const fetchedData = await fetchCardholders(pageParam, searchUrlString);
			setCardholderCount(fetchedData.count);

			if (searchbarValue) {
				return fetchedData.cardholders.sort((a, b) => (a[searchFilter] < b[searchFilter] ? -1 : 1));
			}

			return fetchedData.cardholders;
		},
		{
			getNextPageParam: (_lastGroup, groups) => groups.length,
			keepPreviousData: false,
			refetchOnWindowFocus: false,
		}
	);

	const flatData = useMemo(() => {
		return data?.pages?.flat() ?? [];
	}, [data]);

	const fetchMoreOnBottomReached = (containerRef) => {
		if (containerRef) {
			const { scrollHeight, scrollTop, clientHeight } = containerRef;

			if (scrollHeight - scrollTop - clientHeight < 10 && !isFetching && flatData.length < cardholderCount) {
				fetchNextPage();
			}
		}
	};

	const openCardholderEditor = async (id) => {
		setIsModalOpen(true);

		await fetchCardholder(id).then((cardholder) => {
			setCardholderToEdit(cardholder);
		});
	};

	const closeCardholderEditor = () => {
		setIsModalOpen(false);
		setCardholderToEdit({});
	};

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
			accessor: 'cardholderProfile.status',
			Cell: ({ value }) => {
				return value ? (
					<div className='badge green-txt'>Active</div>
				) : (
					<div className='badge red-txt'>Inactive</div>
				);
			},
			style: {
				width: '150px',
			},
		},
		{
			Header: 'Type',
			accessor: 'cardholderProfile.type',
		},
		{
			Header: 'Employee ID',
			accessor: 'employeeId',
		},
		{
			accessor: 'id',
			Cell: ({ value }) => {
				return (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<button className='btn-edit-user gg-edit-markup' onClick={(e) => openCardholderEditor(value)} />
					</div>
				);
			},
			style: {
				width: '4rem',
			},
		},
	];

	const onChangeSearchbar = useAsyncDebounce((value) => {
		setSearchbarValue(value);
		remove(); // clear infiniteQuery data cache on search
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
					key={cardholderToEdit.id}
					cardholder={cardholderToEdit}
					closeModal={closeCardholderEditor}
				/>
			</Modal>

			<div className='cardholder-page'>
				<div className='searchbar'>
					<div className='searchbar-input-container'>
						{searchbarValue && (
							<button
								className='btn-close gg-close-o'
								onClick={() => {
									setSearchbarValue('');
									searchbarRef.current.value = '';
								}}
							/>
						)}
						<input
							type='text'
							placeholder='Search...'
							ref={searchbarRef}
							onChange={(e) => onChangeSearchbar(e.target.value)}
						/>
					</div>
					<select name='search' onChange={(e) => onChangeSearchSetting(e.target.value)}>
						<option value='firstName'>First Name</option>
						<option value='lastName'>Last Name</option>
						<option value='employeeId'>Employee ID</option>
					</select>
				</div>
				<div className='cardholder-section-container'>
					<div className='table-container' onScroll={(e) => fetchMoreOnBottomReached(e.target)}>
						{Object.keys(flatData).length ? (
							<Table data={flatData} columns={tableColumns} handleRowClick={handleRowClick} />
						) : (
							<div className='loader-container'>
								{isFetched ? <h3>No results...</h3> : <div className='loader'></div>}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default CardholdersTable;
