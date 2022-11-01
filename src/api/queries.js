import { useInfiniteQuery } from 'react-query';
import { fetchGet, fetchGetAvailableCredentials } from './fetch';

const queryFunctionBuilder =
	(collection, fetchFn = fetchGet, searchFilter, searchValue) =>
	async ({ page = 0 }) => {
		const search = {
			filter: searchFilter,
			value: searchValue,
		};
		const fetchedData = await fetchFn({ collection, page, search });

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
		queryFunctionBuilder('cardholders', fetchGet, searchFilter, searchValue),
		defaultQueryOptions
	);

export const useCredentials = (searchValue, searchFilter) =>
	useInfiniteQuery(
		['credentials-data', searchValue, searchValue && searchFilter],
		queryFunctionBuilder('credentials', fetchGet, searchFilter, searchValue),
		defaultQueryOptions
	);

export const useAccessGroups = (searchValue) =>
	useInfiniteQuery(
		['accessGroups-data', searchValue],
		queryFunctionBuilder('accessGroups', fetchGet, 'groupName', searchValue),
		defaultQueryOptions
	);

export const useAvailableCredentials = (searchValue) =>
	useInfiniteQuery(
		['availableCredentials-data', searchValue],
		queryFunctionBuilder(null, fetchGetAvailableCredentials, '_id', searchValue),
		defaultQueryOptions
	);
