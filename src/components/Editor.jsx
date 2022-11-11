import '../../styles/CardholderEditor.scss';

import React, { useState } from 'react';
import { fetchDelete, fetchPost, fetchUpdate } from '../../helpers/api/fetch';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import BuildForm from '../../helpers/utils/formBuilder';
import Modal from '../../components/Modal';
import Popup from '../../components/ConfirmationPopup';
import toast from 'react-hot-toast';

const Editor = ({ blankFormData, queryOptions, formTemplate }) => {
	const params = useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const query = useQuery(queryOptions(params.id));

	const isCreatingData = useLoaderData().isCreatingData;
	const initialData = isCreatingData ? blankFormData : query.data;

	const [newData, setNewData] = useState({ ...initialData });
	const [isEditing, setIsEditing] = useState(isCreatingData);
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
			queryClient.invalidateQueries(['cardholders-data']);
			queryClient.invalidateQueries(['cardholders-id-data', params.id]);
			closeEditor();
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
		onSuccess: async (data, variables) => {
			toast.success(<b>Cardholder updated!</b>);
			queryClient.invalidateQueries(['cardholders-data']);
			await queryClient.invalidateQueries(['cardholders-id-data', params.id]);
			setIsEditing(false);
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
			queryClient.invalidateQueries(['cardholders-data']);
			queryClient.invalidateQueries(['cardholders-id-data', params.id]);
			setIsEditing(false);
			closeEditor();
		},
		onSettled: () => {
			toast.remove('loadingToast');
		},
	});

	const saveData = () => {
		setIsSaving(true);
		setIsEditing(false);
		toast.loading(<b>Waiting...</b>, { id: 'loadingToast' });

		if (isCreatingData) {
			const hasErrors = !Object.keys(newData).every((key) => !newData[key]?.errors);
			if (hasErrors) return toast.error(<b>Please fill out all fields correctly.</b>);

			postMutation.mutate({ ...newData });
		} else {
			updateMutation.mutate({ id: initialData._id, cardholder: { ...newData } });
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
			<Modal
				isOpen={true}
				closeModal={closeEditor}
				overlayClassName={'overlay cardholder-editor'}
				modalClassName={'modal'}
			>
				<Popup isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} onConfirm={deleteData} />
				{children}
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
					<button className='btn save' onClick={() => saveData()} disabled={!isEditing}>
						Save
					</button>
				</div>
			</Modal>
		</>
	);
};

export default Editor;
