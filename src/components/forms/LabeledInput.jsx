import React, { useState } from 'react';

const LabeledInput = ({ label, defaultValue, handleChange, checkErrors, isDisabled }) => {
	const [errors, setErrors] = useState([]);

	const onChange = (e) => {
		const newErrors = checkErrors(e.target.value);

		handleChange(newErrors.length ? null : e.target.value);

		setErrors(newErrors);
	};

	return (
		<>
			<label className='label'>{label}</label>
			<input
				className={'input' + (errors.length ? ' blank' : '')}
				type='text'
				defaultValue={defaultValue}
				onChange={onChange}
				placeholder={'Enter ' + label.toLowerCase() + '...'}
				disabled={isDisabled}
			/>
			<div className='errors'>
				{errors.map((error, i) => (
					<div key={i}>{error}</div>
				))}
			</div>
		</>
	);
};

export default LabeledInput;
