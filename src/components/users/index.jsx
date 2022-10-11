import React, { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useAsyncDebounce, useTable } from 'react-table';
import './index.scss';
import UsersTable from './UsersTable';

const Cardholders = () => {
	const [totalUsers, setTotalUsers] = useState(0);
	const [searchbar, setSearchbar] = useState('');
	const [searchSetting, setSearchSetting] = useState('firstName');

	const fetchSize = 20;

	const filterUrlText = useMemo(() => {
		return searchbar ? '?' + searchSetting + '=' + searchbar : '';
	}, [searchbar, searchSetting]);

	const fetchData = async (page, fSize) => {
		let fetchUrl = 'https://63445b7f242c1f347f84bcb2.mockapi.io/users';

		if (filterUrlText) fetchUrl += filterUrlText;
		else fetchUrl += '?page=' + (page + 1) + '&limit=' + fSize;

		const fetchedUsers = await fetch(fetchUrl).then((res) => res.json());

		console.log(fetchUrl);

		if (fetchedUsers) {
			setTotalUsers(fetchedUsers.count);
			return fetchedUsers.users;
		}
	};

	const { data, fetchNextPage, isFetching } = useInfiniteQuery(
		['table-data', searchbar, searchSetting], //adding sorting state as key causes table to reset and fetch from new beginning upon sort
		async ({ pageParam = 0 }) => {
			const fetchedData = fetchData(pageParam, fetchSize);
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

			if (scrollHeight - scrollTop - clientHeight < 100 && !isFetching && flatData.length < totalUsers) {
				fetchNextPage();
			}
		}
	};

	const onChangeSearchbar = useAsyncDebounce((value) => {
		setSearchbar(value);
	}, 300);

	const onChangeSearchSetting = (value) => {
		setSearchSetting(value);
	};

	useEffect(() => {
		fetchNextPage();
	}, [fetchNextPage]);

	return (
		<>
			<div id='searchbar'>
				<input type='text' placeholder='Search...' onChange={(e) => onChangeSearchbar(e.target.value)} />
				<select name='search' onChange={(e) => onChangeSearchSetting(e.target.value)}>
					<option value='firstName'>First Name</option>
					<option value='lastName'>Last Name</option>
				</select>
			</div>
			<div className='container' onScroll={(e) => fetchMoreOnBottomReached(e.target)}>
				<UsersTable data={flatData} />
			</div>
		</>
	);
};

export default Cardholders;
