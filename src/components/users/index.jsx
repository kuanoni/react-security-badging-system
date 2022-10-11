import React, { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useAsyncDebounce, useTable } from 'react-table';
import './index.scss';

const UsersTable = () => {
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

		if (fetchedUsers) return fetchedUsers;
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

	const usersColumns = useMemo(
		() => [
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
			{
				Header: 'Status',
				accessor: 'cardholderProfile.status',
				Cell: ({ value }) => {
					return value ? (
						<div className='badge green-txt'>Active</div>
					) : (
						<div className='badge red-txt'>Expired</div>
					);
				},
			},
			{
				Header: 'Group',
				accessor: 'cardholderProfile.group',
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
