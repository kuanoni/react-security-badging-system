import '../styles/SelectionList.scss';

import React, { useEffect, useMemo, useState } from 'react';
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Searchbar from './forms/Searchbar';
import SelectionListRows from './SelectionListRows';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

const SelectionList = ({
	label,
	queryHook,
	selectionListLabels,
	dataKey,
	initialSelected,
	saveNewList,
	closeModal,
}) => {
	const [searchbarValue, setSearchbarValue] = useState('');
	const [selectedList, setSelectedList] = useState(initialSelected.sort((a, b) => a._id - b._id));
	const [onlyShowSelected, setOnlyShowSelected] = useState(false);

	const query = queryHook(searchbarValue);

	useEffect(() => {
		return () => {
			// remove infiniteQuery cache on unmount
			query.remove();
		};
		// eslint-disable-next-line
	}, []);

	const saveSelected = () => {
		saveNewList(selectedList);
		toast.success(<b>Saved!</b>);
		closeModal();
	};

	const selectableListRowsComponent = useMemo(
		() => (
			<SelectionListRows
				query={query}
				dataKey={dataKey}
				selectionListLabels={selectionListLabels}
				searchbarValue={searchbarValue}
				onlyShowSelected={onlyShowSelected}
				selectedList={selectedList}
				setSelectedList={setSelectedList}
			/>
		),
		[query, dataKey, selectionListLabels, searchbarValue, onlyShowSelected, selectedList, setSelectedList]
	);

	return (
		<>
			<div className='header'>
				<h2>{label}</h2>
				<button className='btn-exit' onClick={() => closeModal()}>
					<FontAwesomeIcon icon={faXmark} />
				</button>
			</div>
			<Searchbar containerClass={'searchbar-container'} setSearchValue={setSearchbarValue} autoFocus={true} />
			<div className='body'>{selectableListRowsComponent}</div>

			<div className='footer'>
				<div className='show-selected' onClick={() => setOnlyShowSelected(!onlyShowSelected)}>
					{onlyShowSelected ? <FontAwesomeIcon icon={faSquareCheck} /> : <FontAwesomeIcon icon={faSquare} />}
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

export default SelectionList;
