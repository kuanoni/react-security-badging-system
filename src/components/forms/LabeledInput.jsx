import React, { useState } from 'react';

import { useCallback } from 'react';
import { useRef } from 'react';

const LabeledInput = ({ label, defaultValue, handleChange, checkErrors, isDisabled }) => {
	const [errors, setErrors] = useState(checkErrors(defaultValue));
	const inputRef = useRef(null);

	const onChange = useCallback(
		(value) => {
			const newErrors = checkErrors(value);
			setErrors(newErrors);
			handleChange(newErrors.length ? { label, errors: newErrors } : value);
			inputRef.current.value = value;
		},
		[setErrors, checkErrors, handleChange, label]
	);

	return (
		<div className='labeled-input'>
			<label className='label'>{label}</label>
			<input
				type='text'
				ref={inputRef}
				className={'input' + (errors.length ? ' blank' : '')}
				defaultValue={defaultValue}
				onChange={(e) => onChange(e.target.value)}
				placeholder={isDisabled ? '' : 'Enter ' + label.toLowerCase() + '...'}
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
