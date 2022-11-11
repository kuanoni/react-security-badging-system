import React, { useEffect, useState } from 'react';

import { useCallback } from 'react';

const LabeledInput = ({ label, defaultValue, handleChange, checkErrors, isDisabled }) => {
	const [value, setValue] = useState(checkErrors(defaultValue));
	const [errors, setErrors] = useState(checkErrors(defaultValue));

	const onChange = useCallback(
		(value) => {
			const newErrors = checkErrors(value);
			setErrors(newErrors);

			handleChange(newErrors.length ? { label, errors: newErrors } : value);
		},
		[setErrors, checkErrors, handleChange, label]
	);

	useEffect(() => {
		onChange(value);
	}, [onChange, value]);

	useEffect(() => {
		onChange(defaultValue);
	}, [onChange, defaultValue]);

	return (
		<div className='labeled-input'>
			<label className='label'>{label}</label>
			<input
				className={'input' + (errors.length ? ' blank' : '')}
				type='text'
				defaultValue={defaultValue}
				onChange={(e) => setValue(e.target.value)}
				placeholder={'Enter ' + label.toLowerCase() + '...'}
				disabled={isDisabled}
			/>
			<div
				className='errors'
				style={{ height: (2 * errors.length).toString() + 'em', padding: errors.length ? '.25rem' : 0 }}
			>
				{errors.map((error, i) => (
					<div key={i}>{error}</div>
				))}
			</div>
		</div>
	);
};

export default LabeledInput;
