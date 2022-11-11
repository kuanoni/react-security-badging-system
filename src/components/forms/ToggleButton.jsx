import React from 'react';

const ToggleButton = ({ label, onToggle, toggled, isDisabled }) => {
	const handleToggle = (e) => {
		onToggle(e.target.checked);
	};

	return (
		<div className='edit-toggle'>
			<span>
				<span>{label}</span>
				<input type='checkbox' id='switch' checked={toggled} disabled={isDisabled} onChange={handleToggle} />
				<label htmlFor='switch'></label>
			</span>
		</div>
	);
};

export default ToggleButton;
