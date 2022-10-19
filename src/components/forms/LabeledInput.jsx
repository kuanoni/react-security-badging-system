import React from 'react';

const LabeledInput = ({ label, defaultValue, handleChange, disabled }) => {
	return (
		<>
			<label className='user-info-label'>{label}</label>
			<input
				className='user-info-input'
				type='text'
				defaultValue={defaultValue}
				onChange={(e) => handleChange(e.target.value)}
				disabled={disabled}
			/>
		</>
	);
};

export default LabeledInput;
