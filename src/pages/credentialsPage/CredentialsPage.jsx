import '../../styles/TablePage.scss';

import React, { useMemo, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Searchbar from '../../components/forms/Searchbar';
import Table from '../../components/Table';
import { faIdCard } from '@fortawesome/free-regular-svg-icons';
import { useCredentials } from '../../helpers/api/queries';

const CredentialsPage = () => {
	const [searchbarValue, setSearchbarValue] = useState('');
	const [searchFilter, setSearchFilter] = useState('_id');
	const [sorting, setSorting] = useState([]);

	const query = useCredentials(
		{ value: searchbarValue, filter: searchFilter },
		sorting.length ? { by: sorting[0].id, order: sorting[0].desc ? 'desc' : 'asc' } : { by: '', order: '' }
	);

	const tableColumns = useMemo(
		() => [
			{
				header: 'Credential Number',
				accessorKey: '_id',
				cell: (info) => (
					<>
						<FontAwesomeIcon icon={faIdCard} />
						<span style={{ marginLeft: '.5rem' }}>{info.getValue()}</span>
					</>
				),
			},
			{
				header: 'Badge Type',
				accessorKey: 'badgeType',
				cell: (info) => {
					const value = info.getValue();
					if (value === 'Employee') return <span className='blue-txt'>{value}</span>;
					if (value === 'Contractor') return <span className='green-txt'>{value}</span>;
					if (value === 'Privileged Visitor') return <span className='purple-txt'>{value}</span>;
					return value;
				},
			},
			{
				header: 'Status',
				accessorKey: 'status',
				cell: (info) => {
					return info.getValue() ? (
						<div className='badge green-txt'>Active</div>
					) : (
						<div className='badge red-txt'>Inactive</div>
					);
				},
			},
			{
				header: 'Badge Owner',
				accessorKey: 'badgeOwnerName',
			},
			{
				header: 'Badge Owner ID',
				accessorKey: 'badgeOwnerId',
			},
			{
				header: 'Partition',
				accessorKey: 'partition',
			},
		],
		[]
	);

	return (
		<>
			<div className={'table-page'}>
				<div className='table-page-container'>
					<div className='table-header'>
						<h1>Credentials</h1>
						<Searchbar containerClass={'searchbar-container'} setSearchValue={setSearchbarValue} />
						<select name='search' onChange={(e) => setSearchFilter(e.target.value)}>
							<option value='_id'>Credential Number</option>
							<option value='badgeType'>Badge Type</option>
							<option value='badgeOwnerName'>Badge Owner</option>
							<option value='badgeOwnerId'>Badge Owner ID</option>
						</select>
					</div>
					<div className='table-body'>
						<Table query={query} columns={tableColumns} sorting={sorting} setSorting={setSorting} />
					</div>
				</div>
			</div>
		</>
	);
};

export default CredentialsPage;
