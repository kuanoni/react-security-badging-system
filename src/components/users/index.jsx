import React, { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useAsyncDebounce, useTable } from 'react-table';
import './index.scss';

const UsersTable = () => {
	const [searchbar, setSearchbar] = useState('');
	const [searchSetting, setSearchSetting] = useState('firstName');

	const fetchSize = 20;

	const filterUrlText = useMemo(() => {
		return searchbar ? '/filter?key=' + searchSetting + '&value=' + searchbar : '';
	}, [searchbar, searchSetting]);

	const fetchData = async (start, fSize) => {
		let fetchUrl = 'https://dummyjson.com/users';

		if (filterUrlText) fetchUrl += filterUrlText;
		else fetchUrl += '?limit=' + fSize + '&skip=' + start;

		const fetchedUsers = await fetch(fetchUrl).then((res) => res.json());

		console.log(fetchUrl);

		if (fetchedUsers) return fetchedUsers.users;
	};

	const { data, fetchNextPage, isFetching } = useInfiniteQuery(
		['table-data', searchbar, searchSetting], //adding sorting state as key causes table to reset and fetch from new beginning upon sort
		async ({ pageParam = 0 }) => {
			const start = pageParam * fetchSize;
			const fetchedData = fetchData(start, fetchSize);
			return fetchedData;
		},
		{
			getNextPageParam: (_lastGroup, groups) => groups.length,
			keepPreviousData: true,
			refetchOnWindowFocus: false,
		}
	);

	const flatData = useMemo(() => {
		return data?.pages.flat() ?? [];
	}, [data]);

	const usersColumns = useMemo(
		() => [
			{
				Header: '',
				accessor: 'image',
				Cell: ({ value }) => (
					<img
						src={value ? value : 'https://robohash.org/hicveldicta.png?size=50x50&set=set1'}
						alt=''
						className='table-thumbnail'
					/>
				),
			},
			{
				Header: 'Id',
				accessor: 'id',
			},
			{
				Header: 'First Name',
				accessor: 'firstName',
			},
			{
				Header: 'Last Name',
				accessor: 'lastName',
			},
		],
		[]
	);

	const tableInstance = useTable({
		data: flatData,
		columns: usersColumns,
	});

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

	useEffect(() => {
		fetchNextPage();
	}, [fetchNextPage]);

	const isEven = (idx) => idx % 2 === 0;

	const fetchMoreOnBottomReached = (containerRefElement) => {
		if (containerRefElement) {
			const { scrollHeight, scrollTop, clientHeight } = containerRefElement;

			if (scrollHeight - scrollTop - clientHeight < 100 && !isFetching) {
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

	return (
		<>
			<div className='container' onScroll={(e) => fetchMoreOnBottomReached(e.target)}>
				<div id='searchbar'>
					<input type='text' placeholder='Search...' onChange={(e) => onChangeSearchbar(e.target.value)} />
					<select name='search' onChange={(e) => onChangeSearchSetting(e.target.value)}>
						<option value='firstName'>First Name</option>
						<option value='lastName'>Last Name</option>
					</select>
				</div>
				<table {...getTableProps()}>
					<thead>
						{headerGroups.map((headerGroup) => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column) => (
									<th {...column.getHeaderProps()}>{column.render('Header')}</th>
								))}
							</tr>
						))}
					</thead>
					<tbody {...getTableBodyProps()}>
						{rows.map((row, idx) => {
							prepareRow(row);

							return (
								<tr {...row.getRowProps()} className={isEven(idx) ? 'dark' : 'light'}>
									{row.cells.map((cell, idx) => (
										<td {...cell.getCellProps()}>{cell.render('Cell')}</td>
									))}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default UsersTable;
