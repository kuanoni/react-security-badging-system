import React from 'react';

const LabeledInput = ({ label, defaultValue, handleChange, errors, isDisabled }) => {
	const onChange = (e) => {
		if (e.target.value === '') e.target.className = 'input blank';
		else e.target.className = 'input';

		handleChange(e.target.value);
	};

	return (
		<>
			<label className='label'>{label}</label>
			<input
				className={'input'}
				type='text'
				defaultValue={defaultValue}
				onChange={onChange}
				placeholder={'Enter ' + label.toLowerCase() + '...'}
				disabled={isDisabled}
			/>
			<span className='errors'></span>
		</>
	);
};

export default LabeledInput;
