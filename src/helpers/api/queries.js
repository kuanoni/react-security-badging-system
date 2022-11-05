import { useInfiniteQuery } from 'react-query';
import { fetchGet, fetchGetAvailableCredentials } from './fetch';

const queryFunctionBuilder =
	(collection, fetchFn = fetchGet, searchFilter, searchValue) =>
	async ({ pageParam = 0 }) => {
		const search = {
			filter: searchFilter,
			value: searchValue,
		};

		const data = await fetchFn({ collection, page: pageParam, search });

		if (searchValue) {
			data.documents = data.documents.sort((a, b) => (a[searchFilter] < b[searchFilter] ? -1 : 1));
		}

		return data;
	};

const defaultQueryOptions = {
	getNextPageParam: (lastPage, pages) => pages.length < lastPage.totalPages && pages.length,
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
