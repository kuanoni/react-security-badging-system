import React, { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useAsyncDebounce } from 'react-table';
import { fetchCardholder, fetchCardholders } from '../../api/fetch';
import Table from '../Table';
import CardholderEditor from '../cardholderEditor/CardholderEditor';
import Modal from '../Modal';
import { Toaster } from 'react-hot-toast';
import '../../styles/CardholderTable.scss';

const CardholdersTable = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingCardholder, setEditingCardholder] = useState({});
	const [totalCardholders, setTotalCardholders] = useState(0);
	const [searchbar, setSearchbar] = useState('');
	const [searchSetting, setSearchSetting] = useState('firstName');

	const filterUrlText = useMemo(() => {
		return searchbar ? '?' + searchSetting + '=' + searchbar : '';
	}, [searchbar, searchSetting]);

	const { data, fetchNextPage, isFetching } = useInfiniteQuery(
		['table-data', searchbar, searchSetting], //adding sorting state as key causes table to reset and fetch from new beginning upon sort
		async ({ pageParam = 0 }) => {
			const fetchedData = await fetchCardholders(pageParam, filterUrlText);
			setTotalCardholders(fetchedData.count);
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

	const fetchMoreOnBottomReached = (containerRefElement) => {
		if (containerRefElement) {
			const { scrollHeight, scrollTop, clientHeight } = containerRefElement;

			if (scrollHeight - scrollTop - clientHeight < 10 && !isFetching && flatData.length < totalCardholders) {
				fetchNextPage();
			}
		}
	};

	useEffect(() => {
		fetchNextPage();
	}, [fetchNextPage]);

	const openCardholderEditor = async (id) => {
		await fetchCardholder(id).then((cardholder) => {
			setEditingCardholder(cardholder);
			setIsModalOpen(true);
		});
	};

	const closeCardholderEditor = () => {
		setIsModalOpen(false);
		setEditingCardholder({});
	};

	const cardholdersColumns = [
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
		setSearchbar(value);
	}, 300);

	const onChangeSearchSetting = (value) => {
		setSearchSetting(value);
	};

	const handleRowClick = (e, id) => {
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
					key={editingCardholder.id}
					cardholder={editingCardholder}
					closeModal={closeCardholderEditor}
				/>
			</Modal>

			<div className='cardholder-page'>
				<div className='searchbar'>
					<input type='text' placeholder='Search...' onChange={(e) => onChangeSearchbar(e.target.value)} />
					<select name='search' onChange={(e) => onChangeSearchSetting(e.target.value)}>
						<option value='firstName'>First Name</option>
						<option value='lastName'>Last Name</option>
					</select>
				</div>
				<div className='cardholder-section-container'>
					<div className='table-container' onScroll={(e) => fetchMoreOnBottomReached(e.target)}>
						{Object.keys(flatData).length ? (
							<Table data={flatData} columns={cardholdersColumns} handleRowClick={handleRowClick} />
						) : (
							<div className='no-results'>No results...</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default CardholdersTable;
