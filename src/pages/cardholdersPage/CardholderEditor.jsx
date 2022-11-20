import React, { useMemo } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';

import Editor from '../../components/Editor';
import ToggleButton from '../../components/forms/ToggleButton';
import { cardholderEditorForm } from '../../helpers/utils/formTemplates';
import { editorMutationOptionsBuilder } from '../../helpers/api/mutations';
import { fetchGetById } from '../../helpers/api/fetch';
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
	const isCreatingData = useLoaderData()?.isCreatingData === true;

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

	const editorMutationOptions = useMemo(() => {
		// Related query keys must be refetched/invalidated
		const queryKeysToInvalidate = [['cardholders-data'], cardholderByIdQuery(params.id).queryKey];

		const options = editorMutationOptionsBuilder(
			'cardholders',
			'cardholder',
			queryClient,
			queryKeysToInvalidate,
			navigate
		);

		// Use default options if creating new cardholder
		if (isCreatingData) return options;

		const cardholderCredentials = queryClient.getQueryData(['cardholders-id-data', params.id]).credentials;
		options.delete.onSuccess = () => {
			toast.success(<b>Cardholder deleted!</b>);
			queryKeysToInvalidate.forEach((key) => queryClient.refetchQueries({ queryKey: key, exact: true }));
			// refetch any owned credentials queries
			cardholderCredentials.forEach((credential) =>
				queryClient.refetchQueries({ key: ['credentials-id-data', credential._id], exact: true })
			);
			navigate('../');
		};

		return options;
	}, [params.id, queryClient, isCreatingData, navigate]);

	return (
		<>
			<Editor
				blankFormData={blankCardholder}
				queryOptions={cardholderByIdQuery}
				formTemplate={cardholderEditorForm}
				getHeaderComponent={getHeaderComponent}
				mutationOptions={editorMutationOptions}
			/>
		</>
	);
};

export default CardholderEditor;
