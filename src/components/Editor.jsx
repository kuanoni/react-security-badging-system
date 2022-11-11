import '../styles/CardholderEditor.scss';

import React, { useState } from 'react';
import { useLoaderData, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';

import BuildForm from '../helpers/utils/formBuilder';
import Modal from './Modal';
import Popup from './ConfirmationPopup';
import toast from 'react-hot-toast';

const Editor = ({
	blankFormData,
	queryOptions,
	formTemplate,
	getHeaderComponent,
	postMutationOptions,
	patchMutationOptions,
	deleteMutationOptions,
}) => {
	const params = useParams();
	const navigate = useNavigate();

	const query = useQuery(queryOptions(params.id));

	const isCreatingData = useLoaderData()?.isCreatingData === true;
	const initialData = isCreatingData ? blankFormData : query.data;

	const [newData, setNewData] = useState({ ...initialData });
	const [isEditing, setIsEditing] = useState(isCreatingData);
	const [isSaving, setIsSaving] = useState(false);
	const [isPopupOpen, setIsPopupOpen] = useState(false);

	const postMutation = useMutation(postMutationOptions(setIsEditing, setIsSaving));
	const patchMutation = useMutation(patchMutationOptions(setIsEditing, setIsSaving));
	const deleteMutation = useMutation(deleteMutationOptions(setIsEditing, setIsSaving));

	const saveData = () => {
		setIsSaving(true);
		setIsEditing(false);
		toast.loading(<b>Waiting...</b>, { id: 'loadingToast' });

		if (isCreatingData) {
			const hasErrors = !Object.keys(newData).every((key) => !newData[key]?.errors);
			if (hasErrors) return toast.error(<b>Please fill out all fields correctly.</b>);

			postMutation.mutate({ ...newData });
		} else {
			patchMutation.mutate({ id: initialData._id, newData: { ...newData } });
		}
	};

	const deleteData = () => {
		if (isSaving) return;
		setIsEditing(false);
		toast.loading(<b>Waiting...</b>, { id: 'loadingToast' });

		deleteMutation.mutate({ id: initialData._id });
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
