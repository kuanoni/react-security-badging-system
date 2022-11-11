import { faIdBadge, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { fetchDelete, fetchGetById, fetchPost, fetchUpdate } from '../../helpers/api/fetch';
import { useNavigate, useParams } from 'react-router-dom';

import Editor from '../../components/Editor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import ToggleButton from '../../components/forms/ToggleButton';
import { credentialsEditorForm } from '../../helpers/utils/formTemplates';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';

const blankCredential = {
	_id: '',
	badgeType: 'Employee',
	badgeOwnerName: '',
	badgeOwnerId: '',
	partition: '',
	status: true,
	activationDate: new Date(),
	expirationDate: new Date(),
};

const credentialByIdQuery = (id) => ({
	queryKey: ['credentials-id-data', id],
	queryFn: async () => fetchGetById('credentials', id),
	options: {
		keepPreviousData: true,
		refetchOnWindowFocus: false,
	},
});

export const credentialEditorLoader =
	(queryClient) =>
	async ({ params }) => {
		const query = credentialByIdQuery(params.id);

		return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query));
	};

const CredentialEditor = () => {
	const navigate = useNavigate();
	const params = useParams();
	const queryClient = useQueryClient();

	const postMutationOptions = (setIsEditing, setIsSaving) => ({
		mutationFn: (newData) => fetchPost('cardholders', newData),
		onError: (error) => {
			if (error.message.includes('E11000')) toast.error(<b>Credential Number is already in use. Try another.</b>);
			else toast.error(<b>Failed to save credential.</b>);
			setIsEditing(true);
		},
		onSuccess: () => {
			toast.success(<b>Credential saved!</b>);
			queryClient.invalidateQueries(['credentials-data']);
			queryClient.invalidateQueries(['credentials-id-data', params.id]);
			navigate('../');
		},
		onSettled: () => {
			toast.remove('loadingToast');
			setIsSaving(false);
		},
	});

	const patchMutationOptions = (setIsEditing, setIsSaving) => ({
		mutationFn: ({ id, newData }) => fetchUpdate('credentials', id, newData),
		onError: (error) => {
			toast.error(<b>Failed to update credential.</b>);
			setIsEditing(true);
		},
		onSuccess: async (data, variables) => {
			toast.success(<b>Credential updated!</b>);
			queryClient.invalidateQueries(['credentials-data']);
			queryClient.invalidateQueries(['credentials-id-data', params.id]);
			setIsEditing(false);
		},
		onSettled: () => {
			toast.remove('loadingToast');
			setIsSaving(false);
		},
	});

	const deleteMutationOptions = (setIsEditing, setIsSaving) => ({
		mutationFn: ({ id }) => fetchDelete('credentials', id),
		onError: (error) => {
			toast.error(<b>Failed to delete credential.</b>);
			setIsEditing(true);
		},
		onSuccess: () => {
			toast.success(<b>Credential deleted!</b>);
			queryClient.invalidateQueries(['credentials-data']);
			queryClient.invalidateQueries(['credentials-id-data', params.id]);
			navigate('../');
		},
		onSettled: () => {
			toast.remove('loadingToast');
		},
	});

	const getHeaderComponent = (credential, isNew, isSaving, isEditing, setIsEditing) => {
		if (isNew) return <h1 className='title'>New credential</h1>;
		else
			return (
				<>
					<div className='avatar'>
						<FontAwesomeIcon icon={faIdCard} />
					</div>
					<div className='cardholder-info'>
						<h1 className='title'>{credential?._id}</h1>
						<div className='label'>Status</div>
						{credential?.status ? (
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
				blankFormData={blankCredential}
				queryOptions={credentialByIdQuery}
				formTemplate={credentialsEditorForm}
				getHeaderComponent={getHeaderComponent}
				postMutationOptions={postMutationOptions}
				patchMutationOptions={patchMutationOptions}
				deleteMutationOptions={deleteMutationOptions}
			/>
		</>
	);
};

export default CredentialEditor;
