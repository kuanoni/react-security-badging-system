import React, { useRef } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, closeModal, overlayClassName, modalClassName, children }) => {
	const overlayRef = useRef(null);
	const root = document.getElementById('root');

	const handleOverlayClick = (e) => {
		if (overlayRef.current === e.target) closeModal();
	};

	if (!isOpen) return <></>;

	return ReactDOM.createPortal(
		<div className='ModalPortal'>
			<div className={overlayClassName} ref={overlayRef} onClick={handleOverlayClick}>
				<div className={modalClassName}>{children}</div>
			</div>
		</div>,
		root
	);
};

export default Modal;
