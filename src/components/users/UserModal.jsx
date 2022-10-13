import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const UserModal = ({ user, setUser, isOpen, setIsOpen }) => {
	const [isEditing, setIsEditing] = useState(false);

	const closeModal = () => {
		setUser({});
		setIsOpen(false);
	};

	if (Object.keys(user).length === 0) {
		return (
			<Modal isOpen={isOpen} onRequestClose={closeModal} className={'modal'} overlayClassName={'overlay'}></Modal>
		);
	}

	return (
		<>
			<Modal isOpen={isOpen} onRequestClose={closeModal} className={'modal'} overlayClassName={'overlay'}>
				<div className='user-info-header'>
					<div className='user-info-avatar'>
						<img src={user?.avatar} alt='' />
					</div>
					<div className='user-info'>
						<h1 className='user-info-title name'>{user?.firstName + ' ' + user?.lastName}</h1>
						<div className='user-info-label'>Email</div>
						<div className='user-info-basic'>{user?.email}</div>
						<div className='user-info-label'>Status</div>
						{user?.cardholderProfile?.status ? (
							<div className='user-info-basic green-txt'>Active</div>
						) : (
							<div className='user-info-basic red-txt'>Inactive</div>
						)}
					</div>
				</div>
				<div className='user-info-body'>
					<div className='user-info-container'>
						<h1 className='user-info-title'>General</h1>
						<label className='user-info-label'>First name</label>
						<input className='user-info-input' type='text' value={user?.firstName} disabled={true} />
						<label className='user-info-label'>Last name</label>
						<input className='user-info-input' type='text' value={user?.lastName} disabled={true} />
						<label className='user-info-label'>Email</label>
						<input className='user-info-input' type='text' value={user?.email} disabled={true} />
					</div>
					<div className='user-info-container'>
						<h1 className='user-info-title'>Status</h1>
						<div className='user-info-label'>Status</div>
						<div className='user-info-basic'>{user?.cardholderProfile.status}</div>
						{user?.cardholderProfile?.status ? (
							<div className='user-info-basic green-txt'>Active</div>
						) : (
							<div className='user-info-basic red-txt'>Inactive</div>
						)}
					</div>
				</div>
				<div className='user-info-footer'>
					<button className='btn-cancel'>Cancel</button>
					<button className='btn-save'>Save</button>
				</div>
			</Modal>
		</>
	);
};

export default UserModal;
