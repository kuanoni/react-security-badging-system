import { fetchGet, fetchGetAvailableCredentials } from './fetch';

import { useInfiniteQuery } from 'react-query';

const queryFunctionBuilder =
	(collection, fetchFn = fetchGet, search, sort) =>
	async ({ pageParam = 0 }) => {
		const data = await fetchFn({ collection, page: pageParam, search, sort });

		return data;
	};

const defaultQueryOptions = {
	getNextPageParam: (lastPage, pages) => pages.length < lastPage.totalPages && pages.length,
	keepPreviousData: false,
	refetchOnWindowFocus: false,
};

export const useCardholders = (search, sort) =>
	useInfiniteQuery(
		['cardholders-data', search.value, search.value && search.filter, sort.by, sort.by && sort.order],
		queryFunctionBuilder('cardholders', fetchGet, search, sort),
		defaultQueryOptions
	);

export const useCredentials = (search, sort) =>
	useInfiniteQuery(
		['credentials-data', search.value, search.value && search.filter, sort.by, sort.by && sort.order],
		queryFunctionBuilder('credentials', fetchGet, search, sort),
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
