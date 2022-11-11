import { fetchDelete, fetchPost, fetchUpdate } from './fetch';

import toast from 'react-hot-toast';

const titleCase = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

export const editorMutationOptionsBuilder = (
	collectionName,
	itemName,
	queryClient,
	queryKeysToInvalidate,
	navigate
) => {
	const postMutationOptions = {
		mutationFn: (newData) => fetchPost(collectionName, newData),
		onError: (error) => {
			if (error.message.includes('E11000'))
				toast.error(<b>{titleCase(itemName)} Number is already in use. Try another.</b>);
			else toast.error(<b>Failed to save {itemName}.</b>);
		},
		onSuccess: () => {
			toast.success(<b>{titleCase(itemName)} saved!</b>);
			queryKeysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
			navigate('../');
		},
		onSettled: () => {
			toast.remove('loadingToast');
		},
	};

	const patchMutationOptions = {
		mutationFn: ({ id, newData }) => fetchUpdate(collectionName, id, newData),
		onError: () => {
			toast.error(<b>Failed to update {itemName}.</b>);
		},
		onSuccess: async () => {
			toast.success(<b>{titleCase(itemName)} updated!</b>);
			queryKeysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
		},
		onSettled: () => {
			toast.remove('loadingToast');
		},
	};

	const deleteMutationOptions = {
		mutationFn: ({ id }) => fetchDelete(collectionName, id),
		onError: () => {
			toast.error(<b>Failed to delete {itemName}.</b>);
		},
		onSuccess: () => {
			toast.success(<b>{titleCase(itemName)} deleted!</b>);
			queryKeysToInvalidate.forEach((key) => queryClient.invalidateQueries(key));
			navigate('../');
		},
		onSettled: () => {
			toast.remove('loadingToast');
		},
	};

	return {
		post: postMutationOptions,
		patch: patchMutationOptions,
		delete: deleteMutationOptions,
	};
};
