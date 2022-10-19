import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { updateCardholder } from '../../api/fetch';
import Modal from './Modal';
import UserInfoLabeledInput from './UserInfoLabeledInput';
import UserInfoList from './UserInfoList';
import './index.scss';
import AccessGroupModalContent from './AccessGroupModalContent';

const creds = [78064, 91469, 13645, 65499, 65142, 78261, 74985, 98798, 21333, 36657, 78124, 89991, 78846];
const grops = ['General Access', 'Lab Access', 'Global Access', 'Tech Access', 'Roof Access'];

const CardholderModalContent = ({ cardholder, closeModal }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const [isGroupsModalOpen, setIsGroupsModalOpen] = useState(false);

	const [firstName, setFirstName] = useState(cardholder.firstName);
	const [lastName, setLastName] = useState(cardholder.lastName);
	const [email, setEmail] = useState(cardholder.email);
	const [title, setTitle] = useState(cardholder.title);
	const [employeeId, setEmployeeId] = useState(cardholder.employeeId);
	const [status, setStatus] = useState(cardholder.title);
	const [activation, setActivation] = useState(cardholder.cardholderProfile?.activation);
	const [expiration, setExpiration] = useState(cardholder.cardholderProfile?.expiration);
	const [cardholderType, setCardholderType] = useState('');
	const [cardholderGroups, setCardholderGroups] = useState(cardholder.cardholderProfile?.accessGroups);
	const [credentials, setCredentials] = useState(cardholder.cardholderProfile?.credentials);
	const [notes, setNotes] = useState('');

	const closeGroupsModal = () => {
		setIsGroupsModalOpen(false);
	};

	const handleAddAccessGroup = () => {
		setIsGroupsModalOpen(true);
	};

	const handleRemoveAccessGroup = (value) => {
		const idx = cardholderGroups.indexOf(value);
		const newArr = [...cardholderGroups];
		newArr.splice(idx, 1);

		if (idx > -1) setCardholderGroups(newArr);
	};

	const handleAddCredential = () => {};

	const handleRemoveCredential = (value) => {
		const idx = credentials.indexOf(value);
		const newArr = [...credentials];
		newArr.splice(idx, 1);

		if (idx > -1) setCredentials(newArr);
	};

	const saveCardholder = () => {
		const newCardholder = {
			firstName,
			lastName,
			email,
			employeeId,
			title,
			cardholderProfile: {
				status,
				activation,
				expiration,
				type: cardholderType,
				accessGroups: cardholderGroups,
				credentials,
			},
			id: cardholder.id,
		};

		console.log(newCardholder);

		setIsSaving(true);
		setIsEditing(false);

		toast.promise(
			updateCardholder(cardholder.id, newCardholder)
				.then((response) => {
					setIsSaving(false);
					return response.json();
				})
				.catch(() => {
					setIsEditing(true);
				}),
			{
				loading: 'Saving...',
				success: <b>Cardholder saved!</b>,
				error: <b>Could not save.</b>,
			}
		);
	};

	return (
		<>
			<Modal
				isOpen={isGroupsModalOpen}
				closeModal={closeGroupsModal}
				overlayClassName={'overlay access-groups'}
				modalClassName={'modal'}
			>
				<AccessGroupModalContent groups={grops} closeModal={closeGroupsModal} />
			</Modal>
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
				<label className='user-edit-toggle'>
					<span>
						EDIT
						<input
							type='checkbox'
							id='switch'
							checked={isEditing}
							onChange={(e) => setIsEditing(!isEditing)}
						/>
						<label htmlFor='switch'>Toggle</label>
					</span>
				</label>
			</div>
			<div className='user-info-body'>
				<div className='column'>
					<div className='user-info-container'>
						<h1 className='user-info-title'>General</h1>
						<UserInfoLabeledInput
							label={'First name'}
							defaultValue={firstName}
							handleChange={setFirstName}
							disabled={!isEditing}
						/>
						<UserInfoLabeledInput
							label={'Last name'}
							defaultValue={lastName}
							handleChange={setLastName}
							disabled={!isEditing}
						/>
						<UserInfoLabeledInput
							label={'Email'}
							defaultValue={email}
							handleChange={setEmail}
							disabled={!isEditing}
						/>
						<UserInfoLabeledInput
							label={'Job title'}
							defaultValue={title}
							handleChange={setTitle}
							disabled={!isEditing}
						/>
						<UserInfoLabeledInput
							label={'Employee ID'}
							defaultValue={employeeId}
							handleChange={setEmployeeId}
							disabled={!isEditing}
						/>
					</div>
					<div className='user-info-container'>
						<h1 className='user-info-title'>Access Rights</h1>
						<label className='user-info-label'>Cardholder type</label>
						<select
							className='user-info-input'
							disabled={!isEditing}
							defaultValue={cardholderType}
							onChange={(e) => setCardholderType(e.target.value)}
						>
							<option value={'employee'}>Employee</option>
							<option value={'contractor'}>Contractor</option>
							<option value={'privledged visitor'}>Privledged Visitor</option>
						</select>
						<UserInfoList
							label={'Cardholder groups'}
							list={cardholderGroups}
							onAdd={handleAddAccessGroup}
							onRemove={handleRemoveAccessGroup}
							isEditing={isEditing}
						/>
						<UserInfoList
							label={'Credentials'}
							list={credentials}
							onAdd={handleAddCredential}
							onRemove={handleRemoveCredential}
							isEditing={isEditing}
						/>
					</div>
				</div>
				<div className='column'>
					<div className='user-info-container'>
						<h1 className='user-info-title'>Status</h1>
						<label className='user-info-label'>Status</label>
						<select
							className='user-info-input'
							disabled={!isEditing}
							defaultValue={status}
							onChange={(e) => setStatus(e.target.value)}
						>
							<option value={true}>Active</option>
							<option value={false}>Inactive</option>
						</select>
						<UserInfoLabeledInput
							label={'Activation'}
							defaultValue={activation}
							handleChange={setActivation}
							disabled={!isEditing}
						/>
						<UserInfoLabeledInput
							label={'First name'}
							defaultValue={expiration}
							handleChange={setExpiration}
							disabled={!isEditing}
						/>
					</div>
					<div className='user-info-container'>
						<h1 className='user-info-title'>Additional info</h1>
						<label className='user-info-label'>Administrative notes</label>
						<textarea
							className='user-info-input'
							type='text'
							defaultValue={notes}
							onChange={(e) => setNotes(e.target.value)}
							disabled={!isEditing}
						/>
					</div>
				</div>
			</div>
			<div className='user-info-footer'>
				<button className='btn cancel' onClick={() => !isSaving && closeModal()} disabled={isSaving}>
					Cancel
				</button>
				<button className='btn save' onClick={() => saveCardholder()} disabled={!isEditing}>
					Save
				</button>
			</div>
		</>
	);
};

export default CardholderModalContent;
