import React, { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useAsyncDebounce } from 'react-table';
import './index.scss';
import UserModal from './UserModal';
import UsersTable from './UsersTable';

const Cardholders = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState({});
	const [totalUsers, setTotalUsers] = useState(0);
	const [searchbar, setSearchbar] = useState('');
	const [searchSetting, setSearchSetting] = useState('firstName');

	const fetchSize = 30;
	const apiUrl = 'https://63445b7f242c1f347f84bcb2.mockapi.io/users';

	const filterUrlText = useMemo(() => {
		return searchbar ? '?' + searchSetting + '=' + searchbar : '';
	}, [searchbar, searchSetting]);

	const fetchUsers = async (page, fSize) => {
		let fetchUrl = apiUrl;

		if (filterUrlText) fetchUrl += filterUrlText;
		else fetchUrl += '?page=' + (page + 1) + '&limit=' + fSize;

		const fetchedUsers = await fetch(fetchUrl).then((res) => res.json());

		if (fetchedUsers) {
			setTotalUsers(fetchedUsers.count);
			return fetchedUsers.users;
		}
	};

	const fetchUser = async (id) => {
		let fetchUrl = apiUrl + '/' + id;

		const fetchedUser = await fetch(fetchUrl).then((res) => res.json());

		if (fetchedUser) {
			setEditingUser(fetchedUser);
			return fetchedUser;
		}
	};

	const { data, fetchNextPage, isFetching } = useInfiniteQuery(
		['table-data', searchbar, searchSetting], //adding sorting state as key causes table to reset and fetch from new beginning upon sort
		async ({ pageParam = 0 }) => {
			const fetchedData = fetchUsers(pageParam, fetchSize);
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

			if (scrollHeight - scrollTop - clientHeight < 10 && !isFetching && flatData.length < totalUsers) {
				fetchNextPage();
			}
		}
	};

	useEffect(() => {
		fetchNextPage();
	}, [fetchNextPage]);

	const openUserEditor = (id) => {
		setIsModalOpen(true);
		fetchUser(id);
	};

	const onChangeSearchbar = useAsyncDebounce((value) => {
		setSearchbar(value);
	}, 300);

	const onChangeSearchSetting = (value) => {
		setSearchSetting(value);
	};

	return (
		<>
			<UserModal user={editingUser} setUser={setEditingUser} isOpen={isModalOpen} setIsOpen={setIsModalOpen} />

			<div className='container' onScroll={(e) => fetchMoreOnBottomReached(e.target)}>
				<div id='searchbar'>
					<input type='text' placeholder='Search...' onChange={(e) => onChangeSearchbar(e.target.value)} />
					<select name='search' onChange={(e) => onChangeSearchSetting(e.target.value)}>
						<option value='firstName'>First Name</option>
						<option value='lastName'>Last Name</option>
					</select>
				</div>
				<div className='table-container'>
					<UsersTable data={flatData} openUserEditor={openUserEditor} />
				</div>
			</div>
		</>
	);
};

export default Cardholders;
