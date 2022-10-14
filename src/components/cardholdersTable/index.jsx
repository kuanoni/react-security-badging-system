import React, { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useAsyncDebounce } from 'react-table';
import './index.scss';
import CardholderModal from '../cardholdersEditor/CardholderModal';
import CardholdersTable from './Table';

const Cardholders = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingCardholder, setEditingCardholder] = useState({});
	const [totalCardholders, setTotalCardholders] = useState(0);
	const [searchbar, setSearchbar] = useState('');
	const [searchSetting, setSearchSetting] = useState('firstName');

	const fetchSize = 30;
	const apiUrl = 'https://63445b7f242c1f347f84bcb2.mockapi.io/cardholders';

	const filterUrlText = useMemo(() => {
		return searchbar ? '?' + searchSetting + '=' + searchbar : '';
	}, [searchbar, searchSetting]);

	const fetchCardholders = async (page, fSize) => {
		let fetchUrl = apiUrl;

		if (filterUrlText) fetchUrl += filterUrlText;
		else fetchUrl += '?page=' + (page + 1) + '&limit=' + fSize;

		const fetchedCardholders = await fetch(fetchUrl).then((res) => res.json());

		if (fetchedCardholders) {
			setTotalCardholders(fetchedCardholders.count);
			return fetchedCardholders.cardholders;
		}
	};

	const fetchCardholder = async (id) => {
		let fetchUrl = apiUrl + '/' + id;

		const fetchedCardholder = await fetch(fetchUrl).then((res) => res.json());

		if (fetchedCardholder) {
			setEditingCardholder(fetchedCardholder);
			return fetchedCardholder;
		}
	};

	const { data, fetchNextPage, isFetching } = useInfiniteQuery(
		['table-data', searchbar, searchSetting], //adding sorting state as key causes table to reset and fetch from new beginning upon sort
		async ({ pageParam = 0 }) => {
			const fetchedData = fetchCardholders(pageParam, fetchSize);
			return fetchedData;
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

	const openCardholderEditor = (id) => {
		setIsModalOpen(true);
		fetchCardholder(id);
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
				setIsOpen={setIsModalOpen}
			/>
			<div className='container' onScroll={(e) => fetchMoreOnBottomReached(e.target)}>
				<div id='searchbar'>
					<input type='text' placeholder='Search...' onChange={(e) => onChangeSearchbar(e.target.value)} />
					<select name='search' onChange={(e) => onChangeSearchSetting(e.target.value)}>
						<option value='firstName'>First Name</option>
						<option value='lastName'>Last Name</option>
					</select>
				</div>
				<div className='table-container'>
					<CardholdersTable data={flatData} openCardholderEditor={openCardholderEditor} />
				</div>
			</div>
		</>
	);
};

export default Cardholders;
