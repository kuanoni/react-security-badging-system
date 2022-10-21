import React from 'react';
import { useTable } from 'react-table';

const Table = ({ data, columns, handleRowClick }) => {
	const getColumnStyle = (column) => {
		if (column.style) return column.style;
		else return {};
	};

	const tableInstance = useTable({
		data,
		columns,
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
						<tr {...row.getRowProps()} onClick={(e) => handleRowClick(e, row.original.id)}>
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

export default Table;
