import '../../styles/CardholderEditor.scss';

import BuildForm, { cardholderEditorForm } from '../../helpers/utils/formBuilder';
import React, { useState } from 'react';

import { fetchUpdate } from '../../helpers/api/fetch';
import toast from 'react-hot-toast';

const CardholderEditor = ({ cardholder, closeModal, onSaveCardholder }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const saveCardholder = (newCardholder) => {
		console.log(newCardholder);
		setIsSaving(false);
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
				<BuildForm
					formTemplate={cardholderEditorForm}
					defaultData={cardholder}
					isEditing={isEditing}
					isSaving={isSaving}
					submit={saveCardholder}
				/>
			</div>
			<div className='footer'>
				<button className='btn cancel' onClick={() => !isSaving && closeModal()} disabled={isSaving}>
					Cancel
				</button>
				<button className='btn save' onClick={() => setIsSaving(true)} disabled={!isEditing}>
					Save
				</button>
			</div>
		</>
	);
};

export default CardholderEditor;
