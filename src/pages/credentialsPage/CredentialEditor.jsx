import { useLoaderData, useNavigate, useParams } from 'react-router-dom';

import Editor from '../../components/Editor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import ToggleButton from '../../components/forms/ToggleButton';
import { credentialsEditorForm } from '../../helpers/utils/formTemplates';
import { editorMutationOptionsBuilder } from '../../helpers/api/mutations';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';
import { fetchGetById } from '../../helpers/api/fetch';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
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
	const isCreatingData = useLoaderData()?.isCreatingData === true;

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

	const editorMutationOptions = useMemo(() => {
		// Related query keys must be refetched/invalidated
		const queryKeysToInvalidate = [['credentials-data'], ['credentials-id-data', params.id]];
		const credentialOwnerQueryKey = ['cardholders-id-data', credentialOwnerId];

		const options = editorMutationOptionsBuilder(
			'credentials',
			'credential',
			queryClient,
			queryKeysToInvalidate,
			navigate
		);

		// Use default options if creating new cardholder
		if (isCreatingData) return options;

		const credentialOwnerId = queryClient.getQueryData(['credentials-id-data', params.id]).badgeOwnerId;
		options.delete.onSuccess = () => {
			toast.success(<b>Credential deleted!</b>);
			queryKeysToInvalidate.forEach((key) => queryClient.invalidateQueries({ queryKey: key, exact: true }));
			// refetch any cardholder owner queries
			queryClient.refetchQueries({ key: credentialOwnerQueryKey, exact: true });
			navigate('../');
		};

		return options;
	}, [params.id, queryClient, navigate]);

	return (
		<>
			<Editor
				blankFormData={blankCredential}
				queryOptions={credentialByIdQuery}
				formTemplate={credentialsEditorForm}
				getHeaderComponent={getHeaderComponent}
				mutationOptions={editorMutationOptions}
			/>
		</>
	);
};

export default CredentialEditor;
