import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Searchbar from './forms/Searchbar';
import SelectionListRows from './SelectionListRows';

const SelectionList = ({ queryHook, dataKey, initialSelected, saveNewList, closeModal }) => {
	const [searchbarValue, setSearchbarValue] = useState('');
	const [onlyShowSelected, setOnlyShowSelected] = useState(false);

	const query = queryHook(searchbarValue);

	useEffect(() => {
		return () => {
			// remove infiniteQuery cache on unmount
			query.remove();
		};
		// eslint-disable-next-line
	}, []);

	const saveSelected = (selectedList) => {
		saveNewList(selectedList);
		toast.success(<b>Saved!</b>);
		closeModal();
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
				<Searchbar containerClass={'searchbar-container'} setSearchValue={setSearchbarValue} autoFocus={true} />
				{query.isFetched ? (
					<SelectionListRows
						query={query}
						dataKey={dataKey}
						initialSelected={initialSelected}
						onlyShowSelected={onlyShowSelected}
						searchbarValue={searchbarValue}
					/>
				) : (
					<div className='loader-container'>
						<div className='loader' />
					</div>
				)}
			</div>

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
