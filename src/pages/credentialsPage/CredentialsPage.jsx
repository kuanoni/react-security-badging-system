import '../../styles/TablePage.scss';

import { Outlet, useNavigate } from 'react-router-dom';
import React, { Suspense, useCallback, useMemo, useState } from 'react';
import { faPenToSquare, faSquarePlus } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Searchbar from '../../components/forms/Searchbar';
import { faIdCard } from '@fortawesome/free-regular-svg-icons';
import { useCredentials } from '../../helpers/api/queries';

const Table = React.lazy(() => import('../../components/Table'));

const CredentialsPage = () => {
	const [searchbarValue, setSearchbarValue] = useState('');
	const [searchFilter, setSearchFilter] = useState('_id');
	const [sorting, setSorting] = useState([]);

	const query = useCredentials(
		{ value: searchbarValue, filter: searchFilter },
		sorting.length ? { by: sorting[0].id, order: sorting[0].desc ? 'desc' : 'asc' } : { by: '', order: '' }
	);

	const navigate = useNavigate();

	/* =======================
              HANDLERS
       ======================= */

	const openCredentialsEditorNew = () => {
		navigate('./newCredential');
	};

	const openCredentialEditor = useCallback(
		(id) => {
			navigate('./' + id);
		},
		[navigate]
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
			{
				header: '',
				id: 'editBtn',
				accessorKey: '_id',
				size: 60,
				enableResizing: false,
				enableSorting: false,
				cell: (info) => {
					return (
						<button className='btn-edit-user' onClick={() => openCredentialEditor(info.getValue())}>
							<FontAwesomeIcon icon={faPenToSquare} />
						</button>
					);
				},
			},
		],
		[openCredentialEditor]
	);

	const tableComponent = useMemo(
		() => (
			<Table
				query={query}
				columns={tableColumns}
				sorting={sorting}
				setSorting={setSorting}
				onRowClick={openCredentialEditor}
			/>
		),
		[query, tableColumns, sorting, setSorting, openCredentialEditor]
	);

	return (
		<>
			<Suspense
				fallback={
					<div className='container'>
						<div className='loader'></div>
					</div>
				}
			>
				<Outlet />
			</Suspense>
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
							<option value='partition'>Partition</option>
						</select>
						<button className='add-btn' onClick={openCredentialsEditorNew}>
							<span>Create Credential</span>
							<div className='icon'>
								<FontAwesomeIcon icon={faSquarePlus} />
							</div>
						</button>
					</div>
					<div className='table-body'>
						<Suspense
							fallback={
								<div className='container'>
									<div className='loader'></div>
								</div>
							}
						>
							{tableComponent}
						</Suspense>
					</div>
				</div>
			</div>
		</>
	);
};

export default CredentialsPage;
