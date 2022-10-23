import React from 'react';
import '../../styles/CredentialsTable.scss';

const CredentialsTable = () => {
	const tableColumns = [
		{
			Header: 'First Name',
			accessor: 'firstName',
		},
	];

	return (
		<div className='credentials-page'>
			<div className='searchbar'>
				<div className='searchbar-input-container'>
					{searchbarValue && (
						<button
							className='btn-close gg-close-o'
							onClick={() => {
								setSearchbarValue('');
								searchbarRef.current.value = '';
							}}
						/>
					)}
					<input
						type='text'
						placeholder='Search...'
						ref={searchbarRef}
						onChange={(e) => onChangeSearchbar(e.target.value)}
					/>
				</div>
				<select name='search' onChange={(e) => onChangeSearchSetting(e.target.value)}>
					<option value='firstName'>First Name</option>
					<option value='lastName'>Last Name</option>
					<option value='employeeId'>Employee ID</option>
				</select>
			</div>
		</div>
	);
};

export default CredentialsTable;
