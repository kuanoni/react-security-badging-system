import { fetchDelete, fetchGetById, fetchPost, fetchUpdate } from '../../helpers/api/fetch';
import { useMutation, useQueryClient } from 'react-query';

import Editor from '../../components/Editor';
import React from 'react';
import ToggleButton from '../../components/forms/ToggleButton';
import { cardholderEditorForm } from '../../helpers/utils/formTemplates';
import toast from 'react-hot-toast';

const cardholderByIdQuery = (id) => ({
	queryKey: ['cardholders-id-data', id],
	queryFn: async () => fetchGetById('cardholders', id),
	options: {
		keepPreviousData: true,
		refetchOnWindowFocus: false,
	},
});

const CardholderEditor2 = () => {
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
		<Editor
			blankFormData={cardholderEditorForm}
			queryOptions={cardholderByIdQuery}
			formTemplate={cardholderEditorForm}
			getHeaderComponent={getHeaderComponent}
		></Editor>
	);
};

export default CardholderEditor2;
