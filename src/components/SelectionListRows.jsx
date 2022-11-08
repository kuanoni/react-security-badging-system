import React, { useCallback, useEffect, useMemo } from 'react';

import SelectableListItem from './forms/SelectableListItem';
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const rowHeight = 45;

const SelectionListRows = ({ query, dataKey, searchbarValue, onlyShowSelected, selectedList, setSelectedList }) => {
	const containerRef = useRef(null);

	const { data, fetchNextPage, hasNextPage, isFetching } = query;

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

	const { totalSize } = rowVirtualizer;
	const virtualRows = rowVirtualizer.getVirtualItems();
	const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
	const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

	return (
		<div className='list' ref={containerRef} onScroll={(e) => fetchMoreOnBottomReached(e.target)}>
			{paddingTop > 0 && <div style={{ height: `${paddingTop}px` }} />}
			{onlyShowSelected
				? selectedList.map((item) => (
						<SelectableListItem
							key={item._id}
							item={item}
							label={item[dataKey]}
							defaultChecked={checkIfSelected(item)}
							toggleSelected={toggleSelected}
						/>
				  ))
				: virtualRows.map((virtualRow) => {
						const isLoaderRow = virtualRow.index > flatData.length - 1;
						const item = flatData[virtualRow.index];
						const row = (
							<SelectableListItem
								key={item._id}
								item={item}
								label={item[dataKey]}
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
				  })}
			{paddingBottom > 0 && <div style={{ height: `${paddingBottom}px` }} />}
		</div>
	);
};

export default SelectionListRows;
