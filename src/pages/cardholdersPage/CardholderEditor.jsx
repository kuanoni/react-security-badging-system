import { useNavigate, useParams } from 'react-router-dom';

import Editor from '../../components/Editor';
import React from 'react';
import ToggleButton from '../../components/forms/ToggleButton';
import { cardholderEditorForm } from '../../helpers/utils/formTemplates';
import { editorMutationOptionsBuilder } from '../../helpers/api/mutations';
import { fetchGetById } from '../../helpers/api/fetch';
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
				mutationOptions={editorMutationOptionsBuilder(
					'cardholders',
					'cardholder',
					queryClient,
					[['cardholders-data'], cardholderByIdQuery(params.id).queryKey],
					navigate
				)}
			/>
		</>
	);
};

export default CardholderEditor;
