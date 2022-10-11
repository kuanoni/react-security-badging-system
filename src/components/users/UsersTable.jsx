import React, { useMemo } from 'react';
import { useTable } from 'react-table';

const UsersTable = ({ data }) => {
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
		data,
		columns: usersColumns,
	});

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

	return (
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
						<tr {...row.getRowProps()}>
							{row.cells.map((cell, idx) => (
								<td {...cell.getCellProps()}>{cell.render('Cell')}</td>
							))}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export default UsersTable;
