import React, { useState } from 'react';

const AccessGroupModalContent = ({ groups, closeModal }) => {
	const [checkboxes, setCheckboxes] = useState(groups.map((group) => ({ label: group, checked: false })));

	const handleChecked = (idx) => {
		setCheckboxes(
			checkboxes.map((checkbox, i) => {
				if (idx === i) return { ...checkbox, checked: !checkbox.checked };
				return checkbox;
			})
		);
	};

	return (
		<>
			<div className='access-groups-header'>
				<h2>Access Groups</h2>
				<button className='gg-close-o' onClick={() => closeModal()}></button>
			</div>
			<div className='access-groups-body'>
				<input type='text' className='searchbar' placeholder='Search...' />
				<div className='list'>
					{checkboxes.map((checkbox, i) => (
						<div className='list-item' onClick={() => handleChecked(i)} key={i}>
							{checkbox.checked ? (
								<span className='gg-radio-checked'></span>
							) : (
								<span className='gg-radio-check'></span>
							)}

							<input type='checkbox' />
							<span>{checkbox.label}</span>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default AccessGroupModalContent;
