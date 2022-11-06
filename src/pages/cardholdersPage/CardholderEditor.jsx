import '../../styles/CardholderEditor.scss';

import BuildForm, { cardholderEditorForm } from '../../helpers/utils/formBuilder';
import React, { useState } from 'react';
import { fetchPost, fetchUpdate } from '../../helpers/api/fetch';

import toast from 'react-hot-toast';
import { useMutation } from 'react-query';

const CardholderEditor = ({ cardholder, isCardholderNew, closeModal, onSaveCardholder }) => {
	const [newCardholder, setNewCardholder] = useState({ ...cardholder });
	const [isEditing, setIsEditing] = useState(isCardholderNew);
	const [isSaving, setIsSaving] = useState(false);

	const post = useMutation({
		mutationFn: (cardholder) => fetchPost('cardholders', cardholder),
		onError: (error) => {
			if (error.message.includes('E11000')) toast.error(<b>Employee ID is already in use. Try another.</b>);
			else toast.error(<b>Failed to save cardholder.</b>);
		},
		onSuccess: () => {
			toast.success(<b>Cardholder saved!</b>);
			closeModal();
		},
		onSettled: () => {
			toast.remove('loadingToast');
		},
	});

	const update = useMutation({
		mutationFn: ({ id, cardholder }) => fetchUpdate('cardholders', id, cardholder),
		onError: (error) => {
			toast.error(<b>Failed to update cardholder.</b>);
		},
		onSuccess: (data, variables) => {
			toast.success(<b>Cardholder updated!</b>);
			setIsEditing(false);
			onSaveCardholder(variables.cardholder);
		},
		onSettled: () => {
			toast.remove('loadingToast');
		},
	});

	const saveCardholder = async () => {
		setIsSaving(true);
		toast.loading(<b>Waiting...</b>, { id: 'loadingToast' });

		if (isCardholderNew) {
			const hasErrors = !Object.keys(newCardholder).every((key) => !newCardholder[key]?.errors);
			if (hasErrors) return toast.error(<b>Please fill out all fields correctly.</b>);

			await post.mutate({ ...newCardholder });
		} else {
			await update.mutate({ id: cardholder._id, cardholder: { ...newCardholder } });
		}

		setIsSaving(false);
	};

	if (!Object.keys(cardholder).length)
		return (
			<div className='loader-container'>
				<div className='loader'></div>
			</div>
		);

	return (
		<>
			{!isCardholderNew ? (
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
			) : (
				<div className='header'>
					<h1 className='title'>New cardholder</h1>
				</div>
			)}
			<div className='body'>
				<BuildForm
					formTemplate={cardholderEditorForm}
					defaultData={cardholder}
					updateData={setNewCardholder}
					isEditing={isEditing}
					isSaving={isSaving}
				/>
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
