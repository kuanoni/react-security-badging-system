import '../styles/Table.scss';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { useVirtualizer } from '@tanstack/react-virtual';

const rowHeight = 48;

const Table = ({ query, columns, handleRowClick, searchbarValue, sorting, setSorting }) => {
	const tableContainerRef = useRef(null);

	const { data, hasNextPage, fetchNextPage, isFetching } = query;

	const flatData = useMemo(() => {
		return data?.pages?.flatMap((page) => page.documents) ?? [];
	}, [data]);

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

	const table = useReactTable({
		data: flatData,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		manualSorting: true,
		columnResizeMode: 'onChange',
		getCoreRowModel: getCoreRowModel(),
	});

	const { rows } = table.getRowModel();

	const rowVirtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => tableContainerRef.current,
		estimateSize: () => rowHeight,
		overscan: 5,
	});

	const { totalSize } = rowVirtualizer;
	const virtualRows = rowVirtualizer.getVirtualItems();
	const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
	const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

	/*  This is a horrible hack to manually update the rowVirtualizer count after a search.
        rowVirtualizer.measure() is supposed to do this, but it doesn't.
        
        https://github.com/TanStack/virtual/issues/363 */
	useEffect(() => {
		if (searchbarValue !== '') return;

		for (let i = virtualRows.length; i < rows.length; i++) {
			virtualRows.push({
				index: i,
				size: rowHeight,
				start: i * rowHeight,
				end: i * rowHeight + rowHeight,
				key: i,
				measureElement: (element, instance) => {
					return element.getBoundingClientRect()[instance.options.horizontal ? 'width' : 'height'];
				},
			});
		} // eslint-disable-next-line
	}, [searchbarValue]);

	return (
		<div className='table-container' onScroll={(e) => fetchMoreOnBottomReached(e.target)} ref={tableContainerRef}>
			<table>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<th key={header.id} colSpan={header.colSpan} style={{ width: header.getSize() }}>
										{header.isPlaceholder ? null : (
											<div
												{...{
													className: header.column.getCanSort()
														? 'cursor-pointer select-none'
														: '',
													onClick: header.column.getToggleSortingHandler(),
												}}
											>
												{flexRender(header.column.columnDef.header, header.getContext())}
												{{
													asc: ' 🔼',
													desc: ' 🔽',
												}[header.column.getIsSorted()] ?? null}
											</div>
										)}
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
				{rows.length ? (
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
				) : (
					<tbody>
						<tr className='loader-container' style={{ width: '100%', height: '100%' }}>
							<td>
								<div className='loader'></div>
							</td>
						</tr>
					</tbody>
				)}
			</table>
		</div>
	);
};

export default Table;
