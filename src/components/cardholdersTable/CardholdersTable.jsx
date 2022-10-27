import React, { useMemo, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useAsyncDebounce } from 'react-table';
import { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { fetchGetById, fetchGet } from '../../api/fetch';
import CardholderEditor from './CardholderEditor';
import Table from '../Table';
import Modal from '../Modal';
import Searchbar from '../forms/Searchbar';

const CardholdersTable = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [cardholderToEdit, setCardholderToEdit] = useState({});
	const [cardholderCount, setCardholderCount] = useState(0);
	const [searchbarValue, setSearchbarValue] = useState('');
	const [searchFilter, setSearchFilter] = useState('firstName');

	const searchParams = useMemo(() => {
		return searchbarValue ? { filter: searchFilter, value: searchbarValue } : {};
	}, [searchbarValue, searchFilter]);

	const { data, fetchNextPage, remove, isFetching, isFetched } = useInfiniteQuery(
		['table-data', searchbarValue, searchbarValue && searchFilter],
		async ({ pageParam = 0 }) => {
			const fetchedData = await fetchGet('cardholders', pageParam, searchParams);
			setCardholderCount(fetchedData.count);

			if (searchbarValue) {
				return fetchedData.documents.sort((a, b) => (a[searchFilter] < b[searchFilter] ? -1 : 1));
			}

			return fetchedData.documents;
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

	const onSaveCardholder = (newCardholder) => {
		setCardholderToEdit(newCardholder);
		remove(); // reloads infiniteQuery data cache
	};

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
					key={cardholderToEdit._id}
					cardholder={cardholderToEdit}
					closeModal={closeCardholderEditor}
					onSaveCardholder={onSaveCardholder}
				/>
			</Modal>

			<div className='cardholder-page'>
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
