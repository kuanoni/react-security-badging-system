import React, { useState } from 'react';
import '../styles/SelectionListModal.scss';

const SelectionListModal = ({ list, closeModal }) => {
	const [checkboxes, setCheckboxes] = useState(list.map((item) => ({ label: item, checked: false })));

	const handleChecked = (idx) => {
		//infine querey for credentials
		setCheckboxes(
			checkboxes.map((checkbox, i) => {
				if (idx === i) return { ...checkbox, checked: !checkbox.checked };
				return checkbox;
			})
		);
	};

	return (
		<>
			<div className='header'>
				<h2>Access Groups</h2>
				<button className='gg-close-o' onClick={() => closeModal()}></button>
			</div>
			<div className='body'>
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
			<div className='footer'>
				<button className='btn cancel' onClick={() => closeModal()}>
					Cancel
				</button>
				<button className='btn save' onClick={() => {}}>
					Add
				</button>
			</div>
		</>
	);
};

export default SelectionListModal;
