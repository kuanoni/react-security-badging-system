import React, { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useAsyncDebounce } from 'react-table';
import { fetchCardholder, fetchCardholders } from '../../api/fetch';
import './index.scss';
import CardholderModal from '../cardholdersEditor/CardholderModal';
import CardholdersTable from './Table';

const Cardholders = () => {
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
			keepPreviousData: true,
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
		setIsModalOpen(true);
		const cardholder = await fetchCardholder(id);
		setEditingCardholder(cardholder);
	};

	const closeCardholderEditor = () => {
		setIsModalOpen(false);
		setEditingCardholder({});
	};

	const onChangeSearchbar = useAsyncDebounce((value) => {
		setSearchbar(value);
	}, 300);

	const onChangeSearchSetting = (value) => {
		setSearchSetting(value);
	};

	return (
		<>
			<CardholderModal
				cardholder={editingCardholder}
				setCardholder={setEditingCardholder}
				isOpen={isModalOpen}
				closeModal={closeCardholderEditor}
			/>
			<div className='cardholder-page'>
				<div id='searchbar'>
					<input type='text' placeholder='Search...' onChange={(e) => onChangeSearchbar(e.target.value)} />
					<select name='search' onChange={(e) => onChangeSearchSetting(e.target.value)}>
						<option value='firstName'>First Name</option>
						<option value='lastName'>Last Name</option>
					</select>
				</div>
				<div className='cardholder-section-container'>
					<div className='table-container' onScroll={(e) => fetchMoreOnBottomReached(e.target)}>
						{Object.keys(flatData).length ? (
							<CardholdersTable data={flatData} openCardholderEditor={openCardholderEditor} />
						) : (
							<div className='no-results'>No results...</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Cardholders;
