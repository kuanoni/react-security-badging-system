import '../styles/ConfirmationPopup.scss';

import Modal from './Modal';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const Popup = ({ isPopupOpen, setIsPopupOpen, onConfirm }) => {
	const [isDisabled, setIsDisabled] = useState(true);

	useEffect(() => {
		if (isPopupOpen)
			setTimeout(() => {
				setIsDisabled(false);
			}, 4000);
		else setIsDisabled(true);
	}, [isPopupOpen]);

	return (
		<Modal
			isOpen={isPopupOpen}
			closeModal={() => setIsPopupOpen(false)}
			overlayClassName={'overlay popup'}
			modalClassName={'popup'}
		>
			<div>
				Are you sure you want to <b>delete</b> this cardholder?
			</div>
			<div className='red-txt'>This action can not be undone.</div>
			<div className='btns'>
				<button className='cancel' onClick={() => setIsPopupOpen(false)}>
					Cancel
				</button>
				<button className='confirm' onClick={onConfirm} disabled={isDisabled}>
					{isDisabled ? (
						<div className='container'>
							<div className='loader'></div>
						</div>
					) : (
						'DELETE'
					)}
				</button>
			</div>
		</Modal>
	);
};

export default Popup;
