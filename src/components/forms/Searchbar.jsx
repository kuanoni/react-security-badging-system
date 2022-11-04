import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';

const Searchbar = ({ containerClass, setSearchValue, autoFocus = false }) => {
	const inputRef = useRef(null);
	const [searchDebounceTimeout, setSearchDebounceTimeout] = useState(null);

	const onChangeSearchbar = (value) => {
		if (searchDebounceTimeout) clearTimeout(searchDebounceTimeout);

		const getData = setTimeout(() => {
			setSearchValue(value);
		}, 300);

		setSearchDebounceTimeout(getData);
	};

	return (
		<div className={containerClass}>
			<button
				className={inputRef?.current?.value ? 'show' : ''}
				onClick={() => {
					setSearchValue('');
					inputRef.current.value = '';
				}}
			>
				<FontAwesomeIcon icon={faXmark} />
			</button>
			<input
				type='text'
				placeholder='Search...'
				ref={inputRef}
				onChange={(e) => onChangeSearchbar(e.target.value)}
				autoFocus={autoFocus}
			/>
		</div>
	);
};

export default Searchbar;
