import React, { useState } from 'react';
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SelectionListRow = React.memo(({ item, labels, getClassName, defaultChecked, toggleSelected }) => {
	const [checked, setChecked] = useState(defaultChecked);

	const handleClick = () => {
		toggleSelected(item);
		setChecked(!checked);
	};

	return (
		<div className='list-item' onClick={handleClick} key={item._id}>
			{checked ? <FontAwesomeIcon icon={faSquareCheck} /> : <FontAwesomeIcon icon={faSquare} />}
			<span className='labels'>
				{labels.map((key) => (
					<span key={key}>{item[key] || ''}</span>
				))}
			</span>
		</div>
	);
});

export default SelectionListRow;
