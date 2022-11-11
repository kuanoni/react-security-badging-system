import '../../styles/CardholderEditor.scss';

import BuildForm, { cardholderEditorForm } from '../../helpers/utils/formBuilder';
import React, { useState } from 'react';
import { fetchDelete, fetchGetById, fetchPost, fetchUpdate } from '../../helpers/api/fetch';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import Modal from '../../components/Modal';
import Popup from '../../components/ConfirmationPopup';
import ToggleButton from '../../components/forms/ToggleButton';
import toast from 'react-hot-toast';

const blankCardholder = {
	_id: '',
	firstName: '',
	lastName: '',
	email: '',
	jobTitle: '',
	profileStatus: true,
	activationDate: new Date(),
	expirationDate: new Date(),
	profileType: 'Employee',
	accessGroups: [],
	credentials: [],
};

const cardholderByIdQuery = (id) => ({
	queryKey: ['cardholders-id-data', id],
	queryFn: async () => fetchGetById('cardholders', id),
	options: {
		keepPreviousData: true,
		refetchOnWindowFocus: false,
	},
});

export const cardholderEditorLoader =
	(queryClient) =>
	async ({ params }) => {
		const query = cardholderByIdQuery(params.id);

		return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query));
	};

const CardholderEditor = () => {
	const params = useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const query = useQuery(cardholderByIdQuery(params.id));

	const isCreatingCardholder = useLoaderData().isCreatingCardholder;
	const initialCardholder = isCreatingCardholder ? blankCardholder : query.data;

	const [newCardholder, setNewCardholder] = useState({ ...initialCardholder });
	const [isEditing, setIsEditing] = useState(isCreatingCardholder);
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

	const saveCardholder = () => {
		setIsSaving(true);
		setIsEditing(false);
		toast.loading(<b>Waiting...</b>, { id: 'loadingToast' });

		if (isCreatingCardholder) {
			const hasErrors = !Object.keys(newCardholder).every((key) => !newCardholder[key]?.errors);
			if (hasErrors) return toast.error(<b>Please fill out all fields correctly.</b>);

			postMutation.mutate({ ...newCardholder, avatar: 'https://xsgames.co/randomusers/avatar.php?g=male' });
		} else {
			updateMutation.mutate({ id: initialCardholder._id, cardholder: { ...newCardholder } });
		}
	};

	const deleteCardholder = () => {
		if (isSaving) return;
		setIsEditing(false);
		toast.loading(<b>Waiting...</b>, { id: 'loadingToast' });

		deleteMutation.mutate({ id: initialCardholder._id });
	};

	const closeEditor = () => {
		navigate('../');
	};

	if (!Object.keys(initialCardholder).length)
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
				<Popup isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} onConfirm={deleteCardholder} />
				{!isCreatingCardholder ? (
					<div className='header'>
						<div className='avatar'>
							<img src={initialCardholder?.avatar} alt='' />
						</div>
						<div className='cardholder-info'>
							<h1 className='title'>
								{initialCardholder?.firstName + ' ' + initialCardholder?.lastName}
							</h1>
							<div className='label'>Email</div>
							<div>{initialCardholder?.email}</div>
							<div className='label'>Status</div>
							{initialCardholder?.profileStatus ? (
								<div className='green-txt'>Active</div>
							) : (
								<div className='red-txt'>Inactive</div>
							)}
						</div>
						<ToggleButton
							label={'EDIT'}
							onToggle={(toggled) => {
								if (!isSaving) setIsEditing(toggled);
							}}
							defaultToggled={isEditing}
							isDisabled={isSaving}
						/>
					</div>
				) : (
					<div className='header'>
						<h1 className='title'>New cardholder</h1>
					</div>
				)}
				<div className='body'>
					<BuildForm
						formTemplate={cardholderEditorForm}
						defaultData={initialCardholder}
						updateData={setNewCardholder}
						isDataNew={isCreatingCardholder}
						isEditing={isEditing}
						isSaving={isSaving}
					/>
				</div>
				<div className='footer'>
					{isCreatingCardholder ? (
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
					<button className='btn save' onClick={() => saveCardholder()} disabled={!isEditing}>
						Save
					</button>
				</div>
			</Modal>
		</>
	);
};

export default CardholderEditor;
