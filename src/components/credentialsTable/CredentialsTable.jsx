import React, { useMemo, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useAsyncDebounce } from 'react-table';
import { fetchGet } from '../../api/fetch';
import Table from '../Table';
import Searchbar from '../forms/Searchbar';

const CredentialsTable = () => {
	const [searchbarValue, setSearchbarValue] = useState('');
	const [searchFilter, setSearchFilter] = useState('_id');
	const [credentialsCount, setCredentialsCount] = useState('firstName');

	/* =======================
            DATA FETCHING
       ======================= */

	const searchParams = useMemo(() => {
		return searchbarValue ? { filter: searchFilter, value: searchbarValue } : {};
	}, [searchbarValue, searchFilter]);

	const { data, fetchNextPage, remove, isFetching, isFetched } = useInfiniteQuery(
		['table-data', searchbarValue, searchbarValue && searchFilter],
		async ({ pageParam = 0 }) => {
			const fetchedData = await fetchGet('credentials', pageParam, searchParams);
			setCredentialsCount(fetchedData.count);

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

			if (scrollHeight - scrollTop - clientHeight < 10 && !isFetching && flatData.length < credentialsCount) {
				fetchNextPage();
			}
		}
	};

	const tableColumns = [
		{
			Header: 'Credential Number',
			accessor: '_id',
		},
		{
			Header: 'Badge Type',
			accessor: 'badgeType',
			Cell: ({ value }) => {
				if (value === 'Employee') return <span className='blue-txt'>{value}</span>;
				if (value === 'Contractor') return <span className='green-txt'>{value}</span>;
				if (value === 'Privileged Visitor') return <span className='purple-txt'>{value}</span>;
				return value;
			},
		},
		{
			Header: 'Badge Owner',
			accessor: 'badgeOwnerName',
		},
		{
			Header: 'Badge Owner ID',
			accessor: 'badgeOwnerId',
		},
	];

	/* =======================
              HANDLERS
       ======================= */

	const onChangeSearchbar = useAsyncDebounce((value) => {
		setSearchbarValue(value);
		remove(); // clear infiniteQuery data cache on search
	}, 500);

	const onChangeSearchSetting = (value) => {
		setSearchFilter(value);
	};

	const handleRowClick = (e, id) => {
		// if double clicked, open editor
		if (e.detail === 2) console.log(id);
	};

	return (
		<div className='credentials-page'>
			<div className='table-header'>
				<h1>Credentials</h1>
				<Searchbar
					containerClass={'searchbar-container'}
					onChange={onChangeSearchbar}
					setClear={setSearchbarValue}
				/>
				<select name='search' onChange={(e) => onChangeSearchSetting(e.target.value)}>
					<option value='_id'>Credential Number</option>
					<option value='badgeOwnerName'>Badge Owner</option>
					<option value='badgeOwnerId'>Badge Owner ID</option>
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
	);
};

export default CredentialsTable;
