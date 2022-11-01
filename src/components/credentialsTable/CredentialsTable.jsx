import React, { useMemo, useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import Table from '../Table';
import Searchbar from '../forms/Searchbar';
import { useCredentials } from '../../api/queries';
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CredentialsTable = ({ isNavbarOpen }) => {
	const [searchbarValue, setSearchbarValue] = useState('');
	const [searchFilter, setSearchFilter] = useState('_id');

	/* =======================
            DATA FETCHING
       ======================= */

	const { data, fetchNextPage, hasNextPage, refetch, isFetching, isFetched } = useCredentials(
		searchbarValue,
		searchFilter
	);

	const flatData = useMemo(() => {
		return data?.pages?.flatMap((page) => page.documents) ?? [];
	}, [data]);

	const fetchMoreOnBottomReached = (containerRef) => {
		if (containerRef) {
			const { scrollHeight, scrollTop, clientHeight } = containerRef;

			if (scrollHeight - scrollTop - clientHeight < 10 && !isFetching && hasNextPage) {
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
		refetch(); // clear infiniteQuery data cache on search
	}, 500);

	const onChangeSearchSetting = (value) => {
		setSearchFilter(value);
	};

	const handleRowClick = (e, id) => {
		// if double clicked, open editor
		if (e.detail === 2) console.log(id);
	};

	return (
		<div className={'table-page' + (isNavbarOpen ? ' navbar-open' : ' navbar-closed')}>
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
					{hasNextPage && (
						<div className='load-more-container'>
							{!isFetching ? (
								<FontAwesomeIcon icon={faAngleDoubleDown} />
							) : (
								<div className='loader-container'>
									<div className='loader'></div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CredentialsTable;
