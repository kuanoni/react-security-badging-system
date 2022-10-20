import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { fetchAccessGroups, updateCardholder } from '../../api/fetch';
import Modal from '../Modal';
import LabeledInput from '../forms/LabeledInput';
import ListAddRemove from '../forms/ListAddRemove';
import SelectionListModal from '../SelectionListModal';
import '../../styles/CardholderEditor.scss';

const CardholderEditor = ({ cardholder, closeModal }) => {
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
	const [accessGroups, setAccessGroups] = useState(cardholder.cardholderProfile?.accessGroups);
	const [credentials, setCredentials] = useState(cardholder.cardholderProfile?.credentials);
	const [notes, setNotes] = useState('');

	const closeGroupsModal = () => {
		setIsGroupsModalOpen(false);
	};

	const openGroupsModal = () => {
		setIsGroupsModalOpen(true);
	};

	const handleRemoveAccessGroup = (value) => {
		const idx = accessGroups.indexOf(value);
		const newArr = [...accessGroups];
		newArr.splice(idx, 1);

		if (idx > -1) setAccessGroups(newArr);
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
				accessGroups: accessGroups,
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
				overlayClassName={'overlay selection-list'}
				modalClassName={'modal'}
			>
				<SelectionListModal
					fetchFn={fetchAccessGroups}
					selectedList={accessGroups}
					setNewList={setAccessGroups}
					closeModal={closeGroupsModal}
				/>
			</Modal>
			<div className='header'>
				<div className='avatar'>
					<img src={cardholder?.avatar} alt='' />
				</div>
				<div className='cardholder-info'>
					<h1 className='title'>{cardholder?.firstName + ' ' + cardholder?.lastName}</h1>
					<div className='label'>Email</div>
					<div>{cardholder?.email}</div>
					<div className='label'>Status</div>
					{cardholder?.cardholderProfile?.status ? (
						<div className='green-txt'>Active</div>
					) : (
						<div className='red-txt'>Inactive</div>
					)}
				</div>
				<label className='edit-toggle'>
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
			<div className='body'>
				<div className='column'>
					<div className='container'>
						<h1 className='title'>General</h1>
						<LabeledInput
							label={'First name'}
							defaultValue={firstName}
							handleChange={setFirstName}
							disabled={!isEditing}
						/>
						<LabeledInput
							label={'Last name'}
							defaultValue={lastName}
							handleChange={setLastName}
							disabled={!isEditing}
						/>
						<LabeledInput
							label={'Email'}
							defaultValue={email}
							handleChange={setEmail}
							disabled={!isEditing}
						/>
						<LabeledInput
							label={'Job title'}
							defaultValue={title}
							handleChange={setTitle}
							disabled={!isEditing}
						/>
						<LabeledInput
							label={'Employee ID'}
							defaultValue={employeeId}
							handleChange={setEmployeeId}
							disabled={!isEditing}
						/>
					</div>
					<div className='container'>
						<h1 className='title'>Access Rights</h1>
						<label className='label'>Cardholder type</label>
						<select
							className='input'
							disabled={!isEditing}
							defaultValue={cardholderType}
							onChange={(e) => setCardholderType(e.target.value)}
						>
							<option value={'employee'}>Employee</option>
							<option value={'contractor'}>Contractor</option>
							<option value={'privledged visitor'}>Privledged Visitor</option>
						</select>
						<ListAddRemove
							label={'Cardholder groups'}
							list={accessGroups}
							onAdd={openGroupsModal}
							onRemove={handleRemoveAccessGroup}
							isEditing={isEditing}
						/>
						<ListAddRemove
							label={'Credentials'}
							list={credentials}
							onAdd={handleAddCredential}
							onRemove={handleRemoveCredential}
							isEditing={isEditing}
						/>
					</div>
				</div>
				<div className='column'>
					<div className='container'>
						<h1 className='title'>Status</h1>
						<label className='label'>Status</label>
						<select
							className='input'
							disabled={!isEditing}
							defaultValue={status}
							onChange={(e) => setStatus(e.target.value)}
						>
							<option value={true}>Active</option>
							<option value={false}>Inactive</option>
						</select>
						<LabeledInput
							label={'Activation'}
							defaultValue={activation}
							handleChange={setActivation}
							disabled={!isEditing}
						/>
						<LabeledInput
							label={'First name'}
							defaultValue={expiration}
							handleChange={setExpiration}
							disabled={!isEditing}
						/>
					</div>
					<div className='container'>
						<h1 className='title'>Additional info</h1>
						<label className='label'>Administrative notes</label>
						<textarea
							className='input'
							type='text'
							defaultValue={notes}
							onChange={(e) => setNotes(e.target.value)}
							disabled={!isEditing}
						/>
					</div>
				</div>
			</div>
			<div className='footer'>
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

export default CardholderEditor;
