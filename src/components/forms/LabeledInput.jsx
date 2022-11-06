import React, { useState } from 'react';

const LabeledInput = ({ label, defaultValue, handleChange, checkErrors, isDisabled }) => {
	const [errors, setErrors] = useState(checkErrors(''));

	const onChange = (e) => {
		const newErrors = checkErrors(e.target.value);
		setErrors(newErrors);

		handleChange(newErrors.length ? null : e.target.value);
	};

	return (
		<div className='labeled-input'>
			<label className='label'>{label}</label>
			<input
				className={'input' + (errors.length ? ' blank' : '')}
				type='text'
				defaultValue={defaultValue}
				onChange={onChange}
				placeholder={'Enter ' + label.toLowerCase() + '...'}
				disabled={isDisabled}
			/>
			<div className={'errors' + (errors.length ? '' : ' empty')}>
				{errors.map((error, i) => (
					<div key={i}>{error}</div>
				))}
			</div>
		</div>
	);
};

export default LabeledInput;
