import '../../styles/CustomDatepicker.scss';
import 'react-datepicker/dist/react-datepicker.css';

import React, { useEffect, useRef } from 'react';
import { getMonth, getYear } from 'date-fns';

import DatePicker from 'react-datepicker';
import { useState } from 'react';

const customHeader = ({
	date,
	changeYear,
	changeMonth,
	decreaseMonth,
	increaseMonth,
	prevMonthButtonDisabled,
	nextMonthButtonDisabled,
}) => {
	// const years = range(1990, new Date().getFullYear() + 1, 1);
	const today = new Date();
	const years = Array(50)
		.fill('')
		.map((_, i) => today.getFullYear() + i);
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	return (
		<div className='react-datepicker__header-custom-container'>
			<button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
				{'<'}
			</button>
			<select className='input' value={getYear(date)} onChange={({ target: { value } }) => changeYear(value)}>
				{years.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>

			<select
				className='input'
				value={months[getMonth(date)]}
				onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
			>
				{months.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>

			<button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
				{'>'}
			</button>
		</div>
	);
};

const CustomDatePicker = ({ label, defaultDate, handleChange, minDate, maxDate, isDisabled }) => {
	const pickerRef = useRef(null);
	const [selectedDate, setSelectedDate] = useState(Date.parse(defaultDate));

	const onChange = (newDate) => {
		setSelectedDate(newDate);
		handleChange(newDate);
	};

	// prevents typing in datepicker input
	useEffect(() => {
		if (pickerRef.current !== null) {
			pickerRef.current.input.readOnly = true;
		}
	}, [pickerRef]);

	return (
		<>
			<label className='label'>{label}</label>
			<div className='datepicker-container'>
				<DatePicker
					ref={pickerRef}
					selected={selectedDate}
					onChange={(date) => onChange(date)}
					onChangeRaw={(e) => {
						e.preventDefault();
					}}
					minDate={minDate}
					maxDate={maxDate}
					renderCustomHeader={customHeader}
					className='input'
					popperClassName='custom-datepicker-popper'
					popperPlacement='top'
					fixedHeight
					disabled={isDisabled}
				/>
			</div>
		</>
	);
};

export default CustomDatePicker;
