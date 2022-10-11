import React, { useMemo } from 'react';
import { useTable } from 'react-table';

const UsersTable = ({ data, editUser }) => {
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
				style: {
					width: '100px',
				},
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
				style: {
					width: '150px',
				},
			},
			{
				Header: 'Group',
				accessor: 'cardholderProfile.group',
			},
			{
				Header: 'WWID',
				accessor: 'wwid',
			},
			{
				accessor: 'id',
				Cell: ({ value }) => {
					return (
						<button className='btn-edit-user' onClick={(e) => editUser(value)}>
							Edit
						</button>
					);
				},
				style: {
					width: '4rem',
				},
			},
		],
		[]
	);

	const getColumnStyle = (column) => {
		if (column.style) return column.style;
		else return {};
	};

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
							<th {...column.getHeaderProps()} style={{ ...getColumnStyle(column) }}>
								{column.render('Header')}
							</th>
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
