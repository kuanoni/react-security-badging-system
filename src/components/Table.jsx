import React, { useMemo, useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useTable } from 'react-table';
import { fetchSize } from '../api/fetch';

const rowHeight = 64;

const Table = ({ pages, columns, handleRowClick, fetchNextPage, isFetching }) => {
	const [topRowIdx, setTopRowIdx] = useState(0);
	const [bottomRowIdx, setBottomRowIdx] = useState(0);

	const [topRowPageIdx, setTopRowPageIdx] = useState(0);
	const [bottomRowPageIdx, setBottomRowPageIdx] = useState(0);

	const [topRowHeight, setTopRowHeight] = useState(0);
	const [bottomRowHeight, setBottomRowHeight] = useState(128);

	const [omit, setOmit] = useState(0);

	const getColumnStyle = (column) => {
		if (column.style) return column.style;
		else return {};
	};

	const tableContainerRef = useRef(null);

	const handleScroll = (container) => {
		if (container) {
			const { scrollTop, clientHeight, scrollHeight } = container;
			const topRowIdx = Math.floor(scrollTop / rowHeight);
			const bottomRowIdx = Math.floor(clientHeight / rowHeight) + topRowIdx;

			setTopRowIdx(topRowIdx);
			setBottomRowIdx(bottomRowIdx);

			if (scrollTop + clientHeight === scrollHeight && !isFetching) fetchNextPage();

			const newTopRowPageIdx = Math.floor(topRowIdx / fetchSize);
			const newBottomRowPageIdx = Math.floor(bottomRowIdx / fetchSize);
			// const newTopRowPageIdx = Math.floor(topRowIdx / fetchSize) - topRowHeight / (rowHeight * fetchSize);
			// const newBottomRowPageIdx = Math.floor(bottomRowIdx / fetchSize) - topRowHeight / (rowHeight * fetchSize);

			setTopRowPageIdx(newTopRowPageIdx);
			setBottomRowPageIdx(newBottomRowPageIdx);
		}
	};

	// useEffect(() => {
	// 	setOmit(bottomRowPageIdx - 1);
	// }, [topRowHeight]);

	const visibleDocuments = useMemo(() => {
		let documents = [];

		if (bottomRowPageIdx >= 2) {
			setTopRowHeight((bottomRowPageIdx - 1) * (rowHeight * fetchSize));
			setOmit(bottomRowPageIdx - 1);
		}

		documents = pages.map((page, i) => (i >= omit ? page.documents : [])).flat();

		return documents;
	}, [pages, omit, topRowPageIdx, bottomRowPageIdx]);

	useEffect(() => {
		// console.log(visibleDocuments);
	}, [visibleDocuments]);

	const handleClick = (e) => {
		fetchNextPage();
	};

	const tableInstance = useTable({
		data: visibleDocuments,
		columns,
	});

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

	return (
		<>
			<button onClick={handleClick} style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 1000 }}>
				PRERER
			</button>
			<div className='table-container' ref={tableContainerRef} onScroll={(e) => handleScroll(e.target)}>
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
						<tr
							style={{
								// topRowPageIdx > 0 && visiblePagesDocuments.length === 1 ? rowHeight * fetchSize : 0,
								height: topRowHeight,
							}}
						></tr>
						{rows.map((row, idxRow) => {
							prepareRow(row);
							return (
								<tr
									{...row.getRowProps()}
									style={{ height: rowHeight }}
									onClick={(e) => handleRowClick(e, row.original._id)}
								>
									{row.cells.map((cell, idx) => (
										<td {...cell.getCellProps()}>{cell.render('Cell')}</td>
									))}
								</tr>
							);
						})}
						<tr style={{ height: bottomRowHeight }}></tr>
					</tbody>
				</table>
			</div>
		</>
	);
};

export default Table;
