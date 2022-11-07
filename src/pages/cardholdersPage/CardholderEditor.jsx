import '../../styles/CardholderEditor.scss';

import BuildForm, { cardholderEditorForm } from '../../helpers/utils/formBuilder';
import React, { useState } from 'react';
import { fetchDelete, fetchPost, fetchUpdate } from '../../helpers/api/fetch';

import Popup from '../../components/ConfirmationPopup';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';

const CardholderEditor = ({ cardholder, isCardholderNew, closeModal, onUpdateCardholder }) => {
	const [newCardholder, setNewCardholder] = useState({ ...cardholder });
	const [isEditing, setIsEditing] = useState(isCardholderNew);
	const [isSaving, setIsSaving] = useState(false);
	const [isPopupOpen, setIsPopupOpen] = useState(false);

	const postMutation = useMutation({
		mutationFn: (cardholder) => fetchPost('cardholders', cardholder),
		onError: (error) => {
			if (error.message.includes('E11000')) toast.error(<b>Employee ID is already in use. Try another.</b>);
			else toast.error(<b>Failed to save cardholder.</b>);
			setIsEditing(true);
		},
		onSuccess: () => {
			toast.success(<b>Cardholder saved!</b>);
			closeModal();
		},
		onSettled: () => {
			toast.remove('loadingToast');
			setIsSaving(false);
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, cardholder }) => fetchUpdate('cardholders', id, cardholder),
		onError: (error) => {
			toast.error(<b>Failed to update cardholder.</b>);
			setIsEditing(true);
		},
		onSuccess: (data, variables) => {
			toast.success(<b>Cardholder updated!</b>);
			setIsEditing(false);
			onUpdateCardholder(variables.cardholder);
		},
		onSettled: () => {
			toast.remove('loadingToast');
			setIsSaving(false);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: ({ id }) => fetchDelete('cardholders', id),
		onError: (error) => {
			toast.error(<b>Failed to delete cardholder.</b>);
			setIsEditing(true);
		},
		onSuccess: () => {
			toast.success(<b>Cardholder deleted!</b>);
			setIsEditing(false);
			onUpdateCardholder();
			closeModal();
		},
		onSettled: () => {
			toast.remove('loadingToast');
		},
	});

	const saveCardholder = async () => {
		setIsSaving(true);
		setIsEditing(false);
		toast.loading(<b>Waiting...</b>, { id: 'loadingToast' });

		if (isCardholderNew) {
			const hasErrors = !Object.keys(newCardholder).every((key) => !newCardholder[key]?.errors);
			if (hasErrors) return toast.error(<b>Please fill out all fields correctly.</b>);

			await postMutation.mutate({ ...newCardholder });
		} else {
			await updateMutation.mutate({ id: cardholder._id, cardholder: { ...newCardholder } });
		}
	};

	const deleteCardholder = async () => {
		if (isSaving) return;
		setIsEditing(false);
		toast.loading(<b>Waiting...</b>, { id: 'loadingToast' });

		await deleteMutation.mutate({ id: cardholder._id });
	};

	if (!Object.keys(cardholder).length)
		return (
			<div className='loader-container'>
				<div className='loader'></div>
			</div>
		);

	return (
		<>
			<Popup isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} onConfirm={deleteCardholder} />
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
								disabled={isSaving}
								onChange={(e) => {
									if (!isSaving) setIsEditing(!isEditing);
								}}
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
					isDataNew={isCardholderNew}
					isEditing={isEditing}
					isSaving={isSaving}
				/>
			</div>
			<div className='footer'>
				{isCardholderNew ? (
					''
				) : (
					<button
						className='btn delete'
						onClick={() => !isSaving && setIsPopupOpen(true)}
						disabled={!isEditing}
					>
						Delete
					</button>
				)}
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
