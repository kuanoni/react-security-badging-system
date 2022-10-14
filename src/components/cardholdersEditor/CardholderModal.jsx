import React, { useState } from 'react';
import Modal from 'react-modal';
import './index.scss';

Modal.setAppElement('#root');

const CardholderModal = ({ cardholder, isOpen, setIsOpen }) => {
	const [isEditing, setIsEditing] = useState(false);

	const closeModal = () => {
		setIsOpen(false);
	};

	if (Object.keys(cardholder).length === 0) {
		return (
			<Modal isOpen={isOpen} onRequestClose={closeModal} className={'modal'} overlayClassName={'overlay'}></Modal>
		);
	}

	const onChangeEditing = (e) => {
		setIsEditing(!isEditing);
	};

	return (
		<>
			<Modal isOpen={isOpen} onRequestClose={closeModal} className={'modal'} overlayClassName={'overlay'}>
				<div className='user-info-header'>
					<div className='user-info-avatar'>
						<img src={cardholder?.avatar} alt='' />
					</div>
					<div className='user-info'>
						<h1 className='user-info-title name'>{cardholder?.firstName + ' ' + cardholder?.lastName}</h1>
						<div className='user-info-label'>Email</div>
						<div className='user-info-basic'>{cardholder?.email}</div>
						<div className='user-info-label'>Status</div>
						{cardholder?.cardholderProfile?.status ? (
							<div className='user-info-basic green-txt'>Active</div>
						) : (
							<div className='user-info-basic red-txt'>Inactive</div>
						)}
					</div>
					<label className='user-edit'>
						EDIT
						<input
							className='user-info-checkbox'
							type='checkbox'
							value={isEditing}
							onChange={onChangeEditing}
						/>
					</label>
				</div>
				<div className='user-info-body'>
					<div className='column'>
						<div className='user-info-container'>
							<h1 className='user-info-title'>General</h1>
							<label className='user-info-label'>First name</label>
							<input
								className='user-info-input'
								type='text'
								defaultValue={cardholder?.firstName}
								disabled={!isEditing}
							/>
							<label className='user-info-label'>Last name</label>
							<input
								className='user-info-input'
								type='text'
								defaultValue={cardholder?.lastName}
								disabled={!isEditing}
							/>
							<label className='user-info-label'>Email</label>
							<input
								className='user-info-input'
								type='text'
								defaultValue={cardholder?.email}
								disabled={!isEditing}
							/>
							<label className='user-info-label'>Job title</label>
							<input
								className='user-info-input'
								type='text'
								defaultValue={cardholder?.title}
								disabled={!isEditing}
							/>
							<label className='user-info-label'>Employee ID</label>
							<input
								className='user-info-input'
								type='text'
								defaultValue={cardholder?.employeeId}
								disabled={!isEditing}
							/>
						</div>
						<div className='user-info-container'>
							<h1 className='user-info-title'>Access Rights</h1>
							<label className='user-info-label'>Cardholder type</label>
							<select className='user-info-input' disabled={!isEditing}>
								<option value={'employee'}>Employee</option>
								<option value={'contractor'}>Contractor</option>
								<option value={'privledged visitor'}>Privledged Visitor</option>
							</select>
							<label className='user-info-label'>Cardholder groups</label>
							<ul className='user-info-list'>
								{cardholder?.cardholderProfile.accessGroups.map((group, i) => (
									<li className='user-info-list-item' key={i}>
										{group}
									</li>
								))}
							</ul>
							<label className='user-info-label'>Credentials</label>
							<ul className='user-info-list'>
								{cardholder?.cardholderProfile.credentials.map((credential, i) => (
									<li className='user-info-list-item' key={i}>
										{credential}
									</li>
								))}
							</ul>
						</div>
					</div>
					<div className='column'>
						<div className='user-info-container'>
							<h1 className='user-info-title'>Status</h1>
							<label className='user-info-label'>Status</label>
							<select className='user-info-input' disabled={!isEditing}>
								<option className='green-txt' value={true}>
									Active
								</option>
								<option className='red-txt' value={false}>
									Inactive
								</option>
							</select>
							<label className='user-info-label'>Activation</label>
							<input
								className='user-info-input'
								type='text'
								defaultValue={cardholder?.cardholderProfile.activation.substring(0, 10)}
								disabled={true}
							/>
							<label className='user-info-label'>Expiration</label>
							<input
								className='user-info-input'
								type='text'
								defaultValue={cardholder?.cardholderProfile.expiration.substring(0, 10)}
								disabled={!isEditing}
							/>
						</div>
						<div className='user-info-container'>
							<h1 className='user-info-title'>Additional info</h1>
							<label className='user-info-label'>Administrative notes</label>
							<textarea className='user-info-input' type='text' defaultValue={''} disabled={!isEditing} />
						</div>
					</div>
				</div>
				<div className='user-info-footer'>
					<button className='btn cancel' onClick={(_) => closeModal()}>
						Cancel
					</button>
					<button className='btn save'>Save</button>
				</div>
			</Modal>
		</>
	);
};

export default CardholderModal;
