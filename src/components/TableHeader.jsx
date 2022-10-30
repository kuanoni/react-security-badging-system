import React from 'react';
import { useAsyncDebounce } from 'react-table';
import Searchbar from './forms/Searchbar';

const TableHeader = ({ setSearchbarValue, setSearchSetting, clearDataCache }) => {
	const onChangeSearchbar = useAsyncDebounce((value) => {
		setSearchbarValue(value);
		clearDataCache(); // reloads infiniteQuery data cache on search
	}, 500);

	return (
		<div className='table-header'>
			<h1>Cardholders</h1>
			<Searchbar
				containerClass={'searchbar-container'}
				onChange={onChangeSearchbar}
				setClear={setSearchbarValue}
			/>
			<select name='search' onChange={(e) => setSearchSetting(e.target.value)}>
				<option value='firstName'>First Name</option>
				<option value='lastName'>Last Name</option>
				<option value='employeeId'>Employee ID</option>
			</select>
		</div>
	);
};

export default TableHeader;
