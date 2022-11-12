import React, { useCallback, useMemo } from 'react';

import SelectionListRow from './SelectionListRow';
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const rowHeight = 45;

const SelectionListRows = ({
	query,
	dataKey,
	selectionListLabels,
	onlyShowSelected,
	selectedList,
	setSelectedList,
}) => {
	const containerRef = useRef(null);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, isError } = query;

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

	const checkIfSelected = useCallback(
		(item) => {
			return selectedList.map((selectedItem) => selectedItem._id).includes(item._id);
		},
		[selectedList]
	);

	const toggleSelected = useCallback(
		(item) => {
			// either add or remove item from selectedList
			if (checkIfSelected(item))
				setSelectedList(selectedList.filter((selectedListItem) => selectedListItem._id !== item._id));
			else setSelectedList([...selectedList, item].sort((a, b) => a._id - b._id));
		},
		[selectedList, setSelectedList, checkIfSelected]
	);

	const rowVirtualizer = useVirtualizer({
		count: flatData.length,
		getScrollElement: () => containerRef.current,
		estimateSize: () => rowHeight,
		overscan: 5,
	});

	const virtualRows = rowVirtualizer.getVirtualItems();

	const listItemComponents = useMemo(() => {
		return virtualRows.map((virtualRow) => {
			const isLoaderRow = virtualRow.index > flatData.length - 1;
			const item = flatData[virtualRow.index];
			const row = (
				<SelectionListRow
					key={item._id}
					item={item}
					labels={selectionListLabels}
					defaultChecked={checkIfSelected(item)}
					toggleSelected={toggleSelected}
				/>
			);

			return (
				<div
					key={virtualRow.index}
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: `${virtualRow.size}px`,
						transform: `translateY(${virtualRow.start}px)`,
					}}
				>
					{isLoaderRow ? (hasNextPage ? 'Loading more...' : 'Nothing more to load') : row}
				</div>
			);
		});
	}, [virtualRows, flatData, selectionListLabels, checkIfSelected, hasNextPage, toggleSelected]);

	if (isError)
		return (
			<div className='list'>
				<div style={{ fontSize: '1.5em', padding: '1rem' }}>No results...</div>
			</div>
		);

	return (
		<>
			{isFetching && !isFetchingNextPage ? (
				<div className='container-overlay'>
					<div className='loader'></div>
				</div>
			) : null}
			<div className='list' ref={containerRef} onScroll={(e) => fetchMoreOnBottomReached(e.target)}>
				{onlyShowSelected
					? selectedList.map((item) => (
							<SelectionListRow
								key={item._id}
								item={item}
								label={item[dataKey]}
								defaultChecked={checkIfSelected(item)}
								toggleSelected={toggleSelected}
							/>
					  ))
					: listItemComponents}
				{isFetchingNextPage ? (
					<div
						className='container'
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: `${virtualRows[virtualRows.length - 1].size}px`,
							transform: `translateY(${virtualRows[virtualRows.length - 1].start + rowHeight}px)`,
						}}
					>
						<div className='loader-row'>
							<div className='loader'></div>
						</div>
					</div>
				) : null}
			</div>
		</>
	);
};

export default SelectionListRows;
