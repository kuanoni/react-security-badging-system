import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import React, { useState } from 'react';

const SelectableListItem = ({ item, label, defaultChecked, toggleSelected }) => {
	const [checked, setChecked] = useState(defaultChecked);

	const handleClick = () => {
		toggleSelected(item);
		setChecked(!checked);
	};

	return (
		<div className='list-item' onClick={handleClick} key={item._id}>
			{checked ? <FontAwesomeIcon icon={faSquareCheck} /> : <FontAwesomeIcon icon={faSquare} />}
			<span>{label}</span>
		</div>
	);
};

export default SelectableListItem;
