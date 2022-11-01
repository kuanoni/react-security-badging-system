import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { fetchUpdate } from '../../api/fetch';
import Modal from '../Modal';
import LabeledInput from '../forms/LabeledInput';
import ListAddRemove from '../forms/ListAddRemove';
import SelectionListModal from '../SelectionListModal';
import CustomDatePicker from '../forms/CustomDatePicker';
import { useAccessGroups, useAvailableCredentials } from '../../api/queries';
import SelectableListItem from '../forms/SelectableListItem';

const CardholderEditor = ({ cardholder, closeModal, onSaveCardholder }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const [isGroupsModalOpen, setIsGroupsModalOpen] = useState(false);
	const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);

	// editor controlled input values
	const [firstName, setFirstName] = useState(cardholder.firstName);
	const [lastName, setLastName] = useState(cardholder.lastName);
	const [email, setEmail] = useState(cardholder.email);
	const [jobTitle, setJobTitle] = useState(cardholder.jobTitle);
	const [profileStatus, setProfileStatus] = useState(cardholder.profileStatus);
	const [activationDate, setActivationDate] = useState(new Date(cardholder.activationDate));
	const [expirationDate, setExpirationDate] = useState(new Date(cardholder.expirationDate));
	const [profileType, setProfileType] = useState(cardholder.profileType);
	const [accessGroups, setAccessGroups] = useState(cardholder.accessGroups);
	const [credentials, setCredentials] = useState(cardholder.credentials);
	const [notes, setNotes] = useState('');

	const handleRemoveAccessGroup = (value) => {
		const idx = accessGroups.indexOf(value);
		const newArr = [...accessGroups];
		newArr.splice(idx, 1);

		if (idx > -1) setAccessGroups(newArr);
	};

	const handleRemoveCredential = (value) => {
		const idx = credentials.indexOf(value);
		const newArr = [...credentials];
		newArr.splice(idx, 1);

		if (idx > -1) setCredentials(newArr);
	};

	const saveCardholder = () => {
		if (!firstName || !lastName || !email || !jobTitle || !activationDate || !expirationDate) {
			toast.error(<b>Please fill all fields.</b>);
			return;
		}

		const newCardholder = {
			_id: cardholder._id,
			avatar: cardholder.avatar,
			firstName,
			lastName,
			email,
			jobTitle,
			profileStatus,
			activationDate,
			expirationDate,
			profileType,
			accessGroups,
			credentials,
		};

		setIsSaving(true);
		setIsEditing(false);

		toast.promise(
			fetchUpdate('cardholders', cardholder._id, newCardholder)
				.then((res) => {
					setIsSaving(false);
					onSaveCardholder(newCardholder);
					console.log(res);
				})
				.catch((err) => {
					console.log(err);
					setIsEditing(true);
				}),
			{
				loading: 'Saving...',
				success: <b>Cardholder saved!</b>,
				error: <b>Could not save.</b>,
			}
		);
	};

	if (!Object.keys(cardholder).length) {
		return (
			<div className='loader-container'>
				<div className='loader'></div>
			</div>
		);
	}

	return (
		<>
			<Modal
				isOpen={isGroupsModalOpen}
				closeModal={() => setIsGroupsModalOpen(false)}
				overlayClassName={'overlay selection-list'}
				modalClassName={'modal'}
			>
				<SelectionListModal
					queryHook={useAccessGroups}
					listItemComponentBuilder={(item, checkIfSelected, toggleSelected) => (
						<SelectableListItem
							key={item._id}
							item={item}
							label={item.groupName}
							defaultChecked={checkIfSelected(item)}
							toggleSelected={toggleSelected}
						/>
					)}
					initialSelected={accessGroups}
					saveNewList={setAccessGroups}
					closeModal={() => setIsGroupsModalOpen(false)}
				/>
			</Modal>
			<Modal
				isOpen={isCredentialsModalOpen}
				closeModal={() => setIsCredentialsModalOpen(false)}
				overlayClassName={'overlay selection-list'}
				modalClassName={'modal'}
			>
				<SelectionListModal
					queryHook={useAvailableCredentials}
					listItemComponentBuilder={(item, checkIfSelected, toggleSelected) => (
						<SelectableListItem
							key={item._id}
							item={item}
							label={item._id}
							defaultChecked={checkIfSelected(item)}
							toggleSelected={toggleSelected}
						/>
					)}
					initialSelected={credentials}
					saveNewList={setCredentials}
					closeModal={() => setIsCredentialsModalOpen(false)}
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
					{cardholder?.profileStatus ? (
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
							defaultValue={jobTitle}
							handleChange={setJobTitle}
							disabled={!isEditing}
						/>
						<LabeledInput label={'Employee ID'} defaultValue={cardholder._id} disabled={true} />
					</div>
					<div className='container'>
						<h1 className='title'>Access Rights</h1>
						<label className='label'>Profile type</label>
						<select
							className='input'
							disabled={!isEditing}
							defaultValue={profileType}
							onChange={(e) => setProfileType(e.target.value)}
						>
							<option value={'Employee'}>Employee</option>
							<option value={'Contractor'}>Contractor</option>
							<option value={'Privileged Visitor'}>Privileged Visitor</option>
						</select>
						<ListAddRemove
							label={'Cardholder groups'}
							list={accessGroups}
							listKey='groupName'
							onAdd={() => setIsGroupsModalOpen(true)}
							onRemove={handleRemoveAccessGroup}
							isEditing={isEditing}
						/>
						<ListAddRemove
							label={'Badges'}
							list={credentials}
							listKey='_id'
							onAdd={() => setIsCredentialsModalOpen(true)}
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
							defaultValue={profileStatus}
							onChange={(e) => setProfileStatus(e.target.value)}
						>
							<option value={true}>Active</option>
							<option value={false}>Inactive</option>
						</select>
						<CustomDatePicker
							label='Activation'
							date={activationDate}
							setDate={setActivationDate}
							disabled={true}
						/>
						<CustomDatePicker
							label='Expiration'
							date={expirationDate}
							setDate={setExpirationDate}
							minDate={new Date()}
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
