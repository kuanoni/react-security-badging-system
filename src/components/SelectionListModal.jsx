import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import { useInfiniteQuery } from 'react-query';
import { useAsyncDebounce } from 'react-table';

const SelectionListModal = ({ fetchFn, startingSelectedList, saveNewList, closeModal }) => {
	const [searchbar, setSearchbar] = useState('');
	const [listSize, setListSize] = useState(0);
	const [dataKey, setDataKey] = useState('');
	const [selectedList, setSelectedList] = useState(startingSelectedList);
	const [showSelected, setShowSelected] = useState(false);

	const filterUrlText = useMemo(() => {
		return searchbar ? '?search=' + searchbar : '';
	}, [searchbar]);

	const { data, fetchNextPage, remove, isFetching, isFetched } = useInfiniteQuery(
		['list-data', searchbar], //adding sorting state as key causes table to reset and fetch from new beginning upon sort
		async ({ pageParam = 0 }) => {
			const { data: fetchedData, dataKey, count } = await fetchFn(pageParam, filterUrlText);
			setListSize(count);
			setDataKey(dataKey);

			return fetchedData;
		},
		{
			getNextPageParam: (_lastGroup, groups) => groups.length,
			keepPreviousData: false,
			refetchOnWindowFocus: false,
		}
	);

	const fetchMoreOnBottomReached = (containerRefElement) => {
		if (containerRefElement) {
			const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
			const dataLength = data?.pages?.flat().length;

			if (scrollHeight - scrollTop - clientHeight < 10 && !isFetching && dataLength < listSize) {
				fetchNextPage();
			}
		}
	};

	const flatData = useMemo(() => {
		return data?.pages?.flat() ?? [];
	}, [data]);

	useEffect(() => {
		return () => {
			// remove query cache on unmount
			remove();
		};
		// eslint-disable-next-line
	}, []);

	const saveSelected = () => {
		saveNewList(selectedList);
		toast.success(<b>Saved!</b>);
		closeModal();
	};

	const onChangeSearchbar = useAsyncDebounce((value) => {
		setSearchbar(value);
	}, 300);

	const handleClickCheckbox = (item) => {
		// either add or remove item from selectedList
		if (!selectedList.map((i) => i.id).includes(item.id)) setSelectedList([...selectedList, item]);
		else setSelectedList(selectedList.filter((selectedListItem) => selectedListItem.id !== item.id));
	};

	return (
		<>
			<div className='header'>
				<h2>Access Groups</h2>
				<button className='btn-exit' onClick={() => closeModal()}>
					<FontAwesomeIcon icon={faXmark} />
				</button>
			</div>
			<div className='body'>
				<input
					type='text'
					className='searchbar'
					placeholder='Search...'
					onChange={(e) => onChangeSearchbar(e.target.value)}
				/>
				<div className='list' onScroll={(e) => fetchMoreOnBottomReached(e.target)}>
					{listSize === 0 && (
						<div className='loader-container'>
							{isFetched ? <h3>No results...</h3> : <div className='loader'></div>}
						</div>
					)}

					{flatData.map((item) => {
						if (showSelected && !selectedList.map((i) => i.id).includes(item.id)) return <></>;

						return (
							<div className='list-item' onClick={() => handleClickCheckbox(item)} key={item.id}>
								{selectedList.map((i) => i.id).includes(item.id) ? (
									<FontAwesomeIcon icon={faSquareCheck} />
								) : (
									<FontAwesomeIcon icon={faSquare} />
								)}
								<span>{item[dataKey]}</span>
							</div>
						);
					})}
				</div>
			</div>
			<div className='footer'>
				<div className='show-selected' onClick={() => setShowSelected(!showSelected)}>
					{showSelected ? <FontAwesomeIcon icon={faSquareCheck} /> : <FontAwesomeIcon icon={faSquare} />}
					<span>Show selected</span>
				</div>
				<button className='btn cancel' onClick={() => closeModal()}>
					Cancel
				</button>
				<button className='btn save' onClick={() => saveSelected()}>
					Save
				</button>
			</div>
		</>
	);
};

export default SelectionListModal;
