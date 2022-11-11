import React from 'react';

const DropdownList = ({ label, defaultValue, options, handleChange, isDisabled }) => {
	return (
		<>
			<div className='labeled-input'>
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
			</div>
		</>
	);
};

export default DropdownList;
