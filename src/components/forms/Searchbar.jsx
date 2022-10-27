import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef } from 'react';

const Searchbar = ({ containerClass, onChange, setClear, autoFocus = false }) => {
	const inputRef = useRef(null);

	return (
		<div className={containerClass}>
			<button
				className={inputRef?.current?.value ? 'show' : ''}
				onClick={() => {
					setClear('');
					inputRef.current.value = '';
				}}
			>
				<FontAwesomeIcon icon={faXmark} />
			</button>
			<input
				type='text'
				placeholder='Search...'
				ref={inputRef}
				onChange={(e) => onChange(e.target.value)}
				autoFocus={autoFocus}
			/>
		</div>
	);
};

export default Searchbar;
