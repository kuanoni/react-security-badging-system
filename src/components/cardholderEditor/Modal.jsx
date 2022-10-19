import React, { useRef } from 'react';

const Modal = ({ isOpen, closeModal, overlayClassName, modalClassName, children }) => {
	const overlayRef = useRef(null);

	const handleOverlayClick = (e) => {
		if (overlayRef.current === e.target) closeModal();
	};

	if (!isOpen) return <></>;

	return (
		<div className='ModalPortal'>
			<div className={overlayClassName} ref={overlayRef} onClick={handleOverlayClick}>
				<div className={modalClassName}>{children}</div>
			</div>
		</div>
	);
};

export default Modal;
