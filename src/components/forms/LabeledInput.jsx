import React, { useEffect, useState } from 'react';

const LabeledInput = ({ label, defaultValue, handleChange, checkErrors, isDisabled }) => {
	const [errors, setErrors] = useState(checkErrors(defaultValue));

	const onChange = (value) => {
		const newErrors = checkErrors(value);
		setErrors(newErrors);

		handleChange(newErrors.length ? { label, errors: newErrors } : value);
	};

	useEffect(() => {
		onChange(defaultValue);
		// eslint-disable-next-line
	}, []);

	return (
		<div className='labeled-input'>
			<label className='label'>{label}</label>
			<input
				className={'input' + (errors.length ? ' blank' : '')}
				type='text'
				defaultValue={defaultValue}
				onChange={(e) => onChange(e.target.value)}
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
