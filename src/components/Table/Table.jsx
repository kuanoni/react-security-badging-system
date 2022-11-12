import '../../styles/Table.scss';

import React, { useCallback, useMemo, useRef } from 'react';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TableRow from './TableRow';
import { useVirtualizer } from '@tanstack/react-virtual';

const rowHeight = 48;

const Table = ({ query, columns, onRowClick, sorting, setSorting }) => {
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

	const headerComponents = useMemo(() => {
		return table.getHeaderGroups().map((headerGroup) => (
			<tr key={headerGroup.id}>
				{headerGroup.headers.map((header) => {
					return (
						<th key={header.id} colSpan={header.colSpan} style={{ width: header.getSize() }}>
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
						</th>
					);
				})}
			</tr>
		)); // eslint-disable-next-line
	}, [table, sorting]);

	const rowComponents = useMemo(() => {
		const handleRowClick = (e, id) => {
			if (e.detail === 2) onRowClick && onRowClick(id);
		};

		return virtualRows.map((virtualRow) => {
			const row = rows[virtualRow.index];
			return (
				<TableRow
					key={virtualRow.index}
					originalId={row.original._id}
					visibleCells={row.getVisibleCells()}
					height={rowHeight}
					handleRowClick={handleRowClick}
				/>
			);
		});
	}, [virtualRows, rows, onRowClick]);

	if (query.isError)
		return (
			<div className='table-container'>
				<div style={{ fontSize: '1.75em', padding: '1rem' }}>No results...</div>
			</div>
		);

	return (
		<>
			{query.isFetching && !query.isFetchingNextPage ? (
				<div className='container-overlay'>
					<div className='loader'></div>
				</div>
			) : null}
			<div
				className='table-container'
				onScroll={(e) => fetchMoreOnBottomReached(e.target)}
				ref={tableContainerRef}
			>
				<table>
					<thead>{headerComponents}</thead>
					<tbody>
						{paddingTop > 0 && (
							<tr>
								<td style={{ height: `${paddingTop}px`, backgroundColor: 'transparent' }}></td>
							</tr>
						)}
						{rowComponents}
						{paddingBottom > 0 && (
							<tr>
								<td style={{ height: `${0}px`, backgroundColor: 'transparent' }}></td>
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
