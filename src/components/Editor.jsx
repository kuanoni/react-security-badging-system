import '../styles/CardholderEditor.scss';

import React, { useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';

import BuildForm from '../helpers/utils/formBuilder';
import Modal from './Modal';
import Popup from './ConfirmationPopup';
import toast from 'react-hot-toast';

const Editor = ({ blankFormData, queryOptions, formTemplate, getHeaderComponent, mutationOptions }) => {
	const params = useParams();
	const navigate = useNavigate();

	const query = useQuery(queryOptions(params.id));

	const isCreatingData = useLoaderData()?.isCreatingData === true;
	const initialData = isCreatingData ? blankFormData : query.data;

	const [newData, setNewData] = useState({ ...initialData });
	const [isEditing, setIsEditing] = useState(isCreatingData);
	const [isSaving, setIsSaving] = useState(false);
	const [isPopupOpen, setIsPopupOpen] = useState(false);

	const postMutation = useMutation(mutationOptions.post);
	const patchMutation = useMutation(mutationOptions.patch);
	const deleteMutation = useMutation(mutationOptions.delete);

	const saveData = () => {
		setIsSaving(true);
		setIsEditing(false);
		toast.loading(<b>Waiting...</b>, { id: 'loadingToast' });

		if (isCreatingData) {
			const hasErrors = !Object.keys(newData).every((key) => !newData[key]?.errors);
			if (hasErrors) return toast.error(<b>Please fill out all fields correctly.</b>);

			postMutation
				.mutateAsync({ ...newData })
				.then(() => {
					setIsEditing(false);
					setIsSaving(false);
				})
				.catch(() => {
					setIsEditing(true);
					setIsSaving(false);
				});
		} else {
			patchMutation
				.mutateAsync({ id: initialData._id, newData: { ...newData } })
				.then(() => {
					setIsEditing(false);
					setIsSaving(false);
				})
				.catch(() => {
					setIsEditing(true);
					setIsSaving(false);
				});
		}
	};

	const deleteData = () => {
		if (isSaving) return;
		setIsEditing(false);
		toast.loading(<b>Waiting...</b>, { id: 'loadingToast' });

		deleteMutation
			.mutateAsync({ id: initialData._id })
			.then(() => {
				setIsEditing(false);
				setIsSaving(false);
			})
			.catch(() => {
				setIsEditing(true);
				setIsSaving(false);
			});
	};

	const closeEditor = () => {
		navigate('../');
	};

	if (!Object.keys(initialData).length)
		return (
			<div className='container'>
				<div className='loader'></div>
			</div>
		);

	return (
		<>
			<Modal isOpen={true} closeModal={closeEditor} overlayClassName={'overlay editor'} modalClassName={'modal'}>
				<Popup isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} onConfirm={deleteData} />
				<div className='header'>
					{getHeaderComponent(initialData, isCreatingData, isSaving, isEditing, setIsEditing)}
				</div>
				<div className='body'>
					<BuildForm
						formTemplate={formTemplate}
						defaultData={initialData}
						updateData={setNewData}
						isDataNew={isCreatingData}
						isEditing={isEditing}
						isSaving={isSaving}
					/>
				</div>
				<div className='footer'>
					{isCreatingData ? (
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
					<button className='btn cancel' onClick={() => !isSaving && closeEditor()} disabled={isSaving}>
						Cancel
					</button>
					<button type='submit' className='btn save' onClick={() => saveData()} disabled={!isEditing}>
						Save
					</button>
				</div>
			</Modal>
		</>
	);
};

export default Editor;
