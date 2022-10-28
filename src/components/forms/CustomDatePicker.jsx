import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getYear, getMonth } from 'date-fns';

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

const CustomDatePicker = ({ label, date, setDate, minDate, disabled }) => {
	return (
		<>
			<label className='label'>{label}</label>
			<div className='datepicker-container'>
				<DatePicker
					selected={date}
					onChange={(date) => setDate(date)}
					onChangeRaw={(e) => {
						e.preventDefault();
					}}
					minDate={minDate}
					renderCustomHeader={customHeader}
					className='input'
					popperClassName='datepicker-popper'
					disabled={disabled}
				/>
			</div>
		</>
	);
};

export default CustomDatePicker;
