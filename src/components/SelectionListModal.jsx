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

	const flatData = useMemo(() => {
		return data?.pages?.flat() ?? [];
	}, [data]);

	useEffect(() => {
		setCheckboxes(
			flatData.map((item) => ({ label: item[dataKey], checked: selectedList.includes(item[dataKey]) }))
		);
	}, [flatData, dataKey, selectedList]);

	const fetchMoreOnBottomReached = (containerRefElement) => {
		if (containerRefElement) {
			const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
			const dataLength = data?.pages?.flat().length;

			if (scrollHeight - scrollTop - clientHeight < 10 && !isFetching && dataLength < listSize) {
				fetchNextPage();
			}
		}
	};

	const onChangeSearchbar = useAsyncDebounce((value) => {
		setSearchbar(value);
	}, 300);

	const handleChecked = (idx) => {
		setCheckboxes(
			checkboxes.map((checkbox, i) => {
				if (idx === i) return { ...checkbox, checked: !checkbox.checked };
				return checkbox;
			})
		);
	};

	const saveSelected = () => {
		setNewList(checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.label));
		toast.success(<b>Saved!</b>);
		closeModal();
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
					{checkboxes.map((checkbox, i) => (
						<div className='list-item' onClick={() => handleChecked(i)} key={i}>
							{checkbox.checked ? (
								<span className='gg-radio-checked'></span>
							) : (
								<span className='gg-radio-check'></span>
							)}

							<input type='checkbox' />
							<span>{checkbox.label}</span>
						</div>
					))}
				</div>
			</div>
			<div className='footer'>
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
