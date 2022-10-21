import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useInfiniteQuery } from 'react-query';
import { useAsyncDebounce } from 'react-table';
import '../styles/SelectionListModal.scss';

const SelectionListModal = ({ fetchFn, selectedList, setNewList, closeModal }) => {
	const [searchbar, setSearchbar] = useState('');
	const [listSize, setListSize] = useState(0);
	const [dataKey, setDataKey] = useState('');
	const [checkboxes, setCheckboxes] = useState([]);
	const [showSelected, setShowSelected] = useState(false);

	const filterUrlText = useMemo(() => {
		return searchbar ? '?search=' + searchbar : '';
	}, [searchbar]);

	const { data, fetchNextPage, isFetching } = useInfiniteQuery(
		['list-data', searchbar], //adding sorting state as key causes table to reset and fetch from new beginning upon sort
		async ({ pageParam = 0 }) => {
			const { data: fetchedData, dataKey, count } = await fetchFn(pageParam, filterUrlText);
			setListSize(count);
			setDataKey(dataKey);

			return fetchedData;
		},
		{
			getNextPageParam: (_lastGroup, groups) => groups.length,
			keepPreviousData: true,
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
		setCheckboxes(
			flatData.map((item) => ({
				item,
				checked: selectedList.some((selectedItem) => selectedItem.id === item.id),
			}))
		);
	}, [flatData, dataKey, selectedList]);

	const saveSelected = () => {
		setNewList(checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.item));
		toast.success(<b>Saved!</b>);
		closeModal();
	};

	const onChangeSearchbar = useAsyncDebounce((value) => {
		setSearchbar(value);
	}, 300);

	const handleClickCheckbox = (idx) => {
		setCheckboxes(
			checkboxes.map((checkbox, i) => {
				if (idx === i) return { ...checkbox, checked: !checkbox.checked };
				return checkbox;
			})
		);
	};

	return (
		<>
			<div className='header'>
				<h2>Access Groups</h2>
				<button className='gg-close-o' onClick={() => closeModal()}></button>
			</div>
			<div className='body'>
				<input
					type='text'
					className='searchbar'
					placeholder='Search...'
					onChange={(e) => onChangeSearchbar(e.target.value)}
				/>
				<div className='list' onScroll={(e) => fetchMoreOnBottomReached(e.target)}>
					{checkboxes.map((checkbox, i) => {
						if (showSelected && !selectedList.some((selectedItem) => selectedItem.id === checkbox.item.id))
							return <></>;

						return (
							<div className='list-item' onClick={() => handleClickCheckbox(i)} key={i}>
								{checkbox.checked ? (
									<span className='gg-radio-checked'></span>
								) : (
									<span className='gg-radio-check'></span>
								)}
								<span>{checkbox.item[dataKey]}</span>
							</div>
						);
					})}
				</div>
			</div>
			<div className='footer'>
				<div className='show-selected' onClick={() => setShowSelected(!showSelected)}>
					{showSelected ? (
						<span className='gg-radio-checked'></span>
					) : (
						<span className='gg-radio-check'></span>
					)}
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
