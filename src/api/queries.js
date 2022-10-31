import { useInfiniteQuery } from 'react-query';
import { fetchGet, fetchGetAvailableCredentials } from './fetch';

const queryFunctionBuilder =
	(collectionName, fetchFn = fetchGet, searchFilter, searchValue) =>
	async ({ pageParam = 0 }) => {
		const fetchedData = await fetchFn(collectionName, pageParam, {
			filter: searchFilter,
			value: searchValue,
		});

		if (searchValue) {
			fetchedData.documents = fetchedData.documents.sort((a, b) => (a[searchFilter] < b[searchFilter] ? -1 : 1));
		}

		return fetchedData;
	};

const defaultQueryOptions = {
	getNextPageParam: (_lastGroup, groups) => groups.length,
	keepPreviousData: false,
	refetchOnWindowFocus: false,
};

export const useCardholders = (searchValue, searchFilter) =>
	useInfiniteQuery(
		['cardholders-data', searchValue, searchValue && searchFilter],
		queryFunctionBuilder('cardholders', undefined, searchFilter, searchValue),
		defaultQueryOptions
	);

export const useCredentials = (searchValue, searchFilter) =>
	useInfiniteQuery(
		['credentials-data', searchValue, searchValue && searchFilter],
		queryFunctionBuilder('credentials', undefined, searchFilter, searchValue),
		defaultQueryOptions
	);

export const useAvailableCredentials = (searchValue) =>
	useInfiniteQuery(
		['availableCredentials-data', searchValue],
		queryFunctionBuilder(null, fetchGetAvailableCredentials, '_id', searchValue),
		defaultQueryOptions
	);

	);
