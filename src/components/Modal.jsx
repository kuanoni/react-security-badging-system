import '../styles/Modal.scss';

import React, { useRef } from 'react';

import { createPortal } from 'react-dom';

const Modal = ({ isOpen, closeModal, overlayClassName, modalClassName, children }) => {
	const overlayRef = useRef(null);
	const root = document.getElementById('root');

	const handleOverlayClick = (e) => {
		if (overlayRef.current === e.target) closeModal();
	};

	if (!isOpen) return <></>;

	return createPortal(
		<div className='ModalPortal'>
			<div className={overlayClassName} ref={overlayRef} onMouseDown={handleOverlayClick}>
				<div className={modalClassName}>{children}</div>
			</div>
		</div>,
		root
	);
};

export default Modal;
