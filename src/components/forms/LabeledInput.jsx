import React from 'react';

const LabeledInput = ({ label, defaultValue, handleChange, isDisabled }) => {
	return (
		<>
			<label className='label'>{label}</label>
			<input
				// key={dataKey}
				className='input'
				type='text'
				defaultValue={defaultValue}
				onChange={(e) => handleChange(e.target.value)}
				placeholder={'Enter ' + label.toLowerCase() + '...'}
				disabled={isDisabled}
			/>
		</>
	);
};

export default LabeledInput;
