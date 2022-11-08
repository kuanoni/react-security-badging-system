import '../styles/Table.scss';

import React, { useCallback, useMemo, useRef } from 'react';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useVirtualizer } from '@tanstack/react-virtual';

const rowHeight = 48;

const Table = ({ query, columns, handleRowClick, sorting, setSorting }) => {
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
		onSortingChange: (sort) => {
			rowVirtualizer.scrollToIndex(0);
			setSorting(sort);
		},
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

	const totalSize = rowVirtualizer.getTotalSize();
	const virtualRows = rowVirtualizer.getVirtualItems();
	const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
	const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

	const loadingOverlay =
		query.isFetching && !query.isFetchingNextPage ? (
			<div className='container-overlay'>
				<div className='loader'></div>
			</div>
		) : null;

	if (query.isError) return <div className='table-container'></div>;

	return (
		<>
			{loadingOverlay}
			<div
				className='table-container'
				onScroll={(e) => fetchMoreOnBottomReached(e.target)}
				ref={tableContainerRef}
			>
				<table>
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<th
											key={header.id}
											colSpan={header.colSpan}
											style={{ width: header.getSize() }}
										>
											{header.isPlaceholder ? null : (
												<div
													{...{
														className: header.column.getCanSort() ? 'inner-header' : '',
														onClick: header.column.getToggleSortingHandler(),
													}}
												>
													{flexRender(header.column.columnDef.header, header.getContext())}
													{header.column.getCanSort() ? (
														header.column.getIsSorted() === 'asc' ? (
															<FontAwesomeIcon icon={faSortUp} />
														) : header.column.getIsSorted() === 'desc' ? (
															<FontAwesomeIcon icon={faSortDown} />
														) : (
															<FontAwesomeIcon icon={faSort} />
														)
													) : null}
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
					<tbody>
						{paddingTop > 0 && (
							<tr>
								<td style={{ height: `${paddingTop}px`, backgroundColor: 'transparent' }}></td>
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
								<td style={{ height: `${paddingBottom}px`, backgroundColor: 'transparent' }}></td>
							</tr>
						)}
					</tbody>
				</table>
				{query.isFetchingNextPage ? (
					<div className='container' style={{ height: rowHeight }}>
						<div className='container loader-row'>
							<div className='loader'></div>
						</div>
					</div>
				) : null}
			</div>
		</>
	);
};

export default Table;
