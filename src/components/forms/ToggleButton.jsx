import React from 'react';
import { useState } from 'react';

const ToggleButton = ({ label, onToggle, defaultToggled, isDisabled }) => {
	const [toggled, setToggled] = useState(defaultToggled);

	const handleToggle = (e) => {
		setToggled((current) => {
			onToggle(!current);
			return !current;
		});
	};

	return (
		<div className='edit-toggle'>
			<span>
				<span>{label}</span>
				<input
					type='checkbox'
					id='switch'
					defaultChecked={toggled}
					disabled={isDisabled}
					onChange={handleToggle}
				/>
				<label htmlFor='switch'></label>
			</span>
		</div>
	);
};

export default ToggleButton;
