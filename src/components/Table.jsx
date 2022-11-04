import { useReactTable, flexRender, getCoreRowModel } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useCallback, useEffect, useRef } from 'react';

const rowHeight = 48;

const Table = ({ flatData, columns, handleRowClick, hasNextPage, fetchNextPage, isFetching }) => {
	const tableContainerRef = useRef(null);

	const fetchMoreOnBottomReached = useCallback(
		(containerRefElement) => {
			if (containerRefElement) {
				const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
				if (scrollHeight - scrollTop - clientHeight < 100 && !isFetching && hasNextPage) {
					fetchNextPage();
				}
			}
		},
		[hasNextPage, fetchNextPage, isFetching]
	);

	//a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
	useEffect(() => {
		fetchMoreOnBottomReached(tableContainerRef.current);
	}, [fetchMoreOnBottomReached]);

	const table = useReactTable({
		data: flatData,
		columns,
		columnResizeMode: 'onChange',
		getCoreRowModel: getCoreRowModel(),
	});

	const { rows } = table.getRowModel();

	//Virtualizing is optional, but might be necessary if we are going to potentially have hundreds or thousands of rows
	const rowVirtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => tableContainerRef.current,
		estimateSize: () => rowHeight,
		overscan: 10,
	});

	const { totalSize } = rowVirtualizer;
	const virtualRows = rowVirtualizer.getVirtualItems();
	const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
	const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

	return (
		<div className='table-container' onScroll={(e) => fetchMoreOnBottomReached(e.target)} ref={tableContainerRef}>
			<table>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<th key={header.id} colSpan={header.colSpan} style={{ width: header.getSize() }}>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
										<div
											{...{
												onMouseDown: header.getResizeHandler(),
												onTouchStart: header.getResizeHandler(),
												className: `resizer ${
													header.column.getIsResizing() ? 'isResizing' : ''
												}`,
											}}
										/>
									</th>
								);
							})}
						</tr>
					))}
				</thead>
				<tbody>
					{paddingTop > 0 && (
						<tr>
							<td style={{ height: `${paddingTop}px` }} />
						</tr>
					)}
					{virtualRows.map((virtualRow) => {
						const row = rows[virtualRow.index];
						return (
							<tr key={row.id} onClick={(e) => handleRowClick(e, row.original._id)}>
								{row.getVisibleCells().map((cell) => {
									return (
										<td key={cell.id} style={{ height: rowHeight }}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</td>
									);
								})}
							</tr>
						);
					})}
					{paddingBottom > 0 && (
						<tr>
							<td style={{ height: `${paddingBottom}px` }} />
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
