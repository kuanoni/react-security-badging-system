import React from 'react';

const DropdownList = ({ label, defaultValue, options, handleChange, isDisabled }) => {
	return (
		<>
			<label className='label'>{label}</label>
			<select
				className='input'
				defaultValue={defaultValue}
				onChange={(e) => handleChange(e.target.value)}
				disabled={isDisabled}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</>
	);
};

export default DropdownList;
