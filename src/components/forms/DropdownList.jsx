import React from 'react';
import { useEffect } from 'react';

const DropdownList = ({ label, defaultValue, options, handleChange, isDisabled }) => {
	useEffect(() => {
		if (!defaultValue) handleChange(options[0].value);
	}, [defaultValue, handleChange, options]);

	return (
		<>
			<div className='labeled-input'>
				<label className='label'>{label}</label>
				<select
					className='input'
					defaultValue={defaultValue ? defaultValue : options[0].value}
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
