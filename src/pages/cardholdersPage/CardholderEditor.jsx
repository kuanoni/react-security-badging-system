import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { fetchDelete, fetchGetById, fetchPost, fetchUpdate } from '../../helpers/api/fetch';

import Editor from '../../components/Editor';
import React from 'react';
import ToggleButton from '../../components/forms/ToggleButton';
import { cardholderEditorForm } from '../../helpers/utils/formTemplates';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';

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
	const navigate = useNavigate();
	const params = useParams();
	const queryClient = useQueryClient();

	const postMutationOptions = (setIsEditing, setIsSaving) => ({
		mutationFn: (newData) => fetchPost('cardholders', newData),
		onError: (error) => {
			if (error.message.includes('E11000')) toast.error(<b>Employee ID is already in use. Try another.</b>);
			else toast.error(<b>Failed to save cardholder.</b>);
			setIsEditing(true);
		},
		onSuccess: () => {
			toast.success(<b>Cardholder saved!</b>);
			queryClient.invalidateQueries(['cardholders-data']);
			queryClient.invalidateQueries(['cardholders-id-data', params.id]);
			navigate('../');
		},
		onSettled: () => {
			toast.remove('loadingToast');
			setIsSaving(false);
		},
	});

	const patchMutationOptions = (setIsEditing, setIsSaving) => ({
		mutationFn: ({ id, newData }) => fetchUpdate('cardholders', id, newData),
		onError: (error) => {
			toast.error(<b>Failed to update cardholder.</b>);
			setIsEditing(true);
		},
		onSuccess: async (data, variables) => {
			toast.success(<b>Cardholder updated!</b>);
			queryClient.invalidateQueries(['cardholders-data']);
			queryClient.invalidateQueries(['cardholders-id-data', params.id]);
			setIsEditing(false);
		},
		onSettled: () => {
			toast.remove('loadingToast');
			setIsSaving(false);
		},
	});

	const deleteMutationOptions = (setIsEditing, setIsSaving) => ({
		mutationFn: ({ id }) => fetchDelete('cardholders', id),
		onError: (error) => {
			toast.error(<b>Failed to delete cardholder.</b>);
			setIsEditing(true);
		},
		onSuccess: () => {
			toast.success(<b>Cardholder deleted!</b>);
			queryClient.invalidateQueries(['cardholders-data']);
			queryClient.invalidateQueries(['cardholders-id-data', params.id]);
			navigate('../');
		},
		onSettled: () => {
			toast.remove('loadingToast');
		},
	});

	const getHeaderComponent = (cardholder, isNew, isSaving, isEditing, setIsEditing) => {
		if (isNew) return <h1 className='title'>New cardholder</h1>;
		else
			return (
				<>
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
					<ToggleButton
						label={'EDIT'}
						onToggle={(checked) => {
							if (!isSaving) setIsEditing(checked);
						}}
						toggled={isEditing}
						isDisabled={isSaving}
					/>
				</>
			);
	};

	return (
		<>
			<Editor
				blankFormData={blankCardholder}
				queryOptions={cardholderByIdQuery}
				formTemplate={cardholderEditorForm}
				getHeaderComponent={getHeaderComponent}
				postMutationOptions={postMutationOptions}
				patchMutationOptions={patchMutationOptions}
				deleteMutationOptions={deleteMutationOptions}
			/>
		</>
	);
};

export default CardholderEditor;
