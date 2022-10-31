import { useInfiniteQuery } from 'react-query';
import { fetchGet, fetchGetAvailableCredentials } from './fetch';

export const useCardholders = (searchbarValue, searchFilter) =>
	useInfiniteQuery(
		['cardholders-data', searchbarValue, searchbarValue && searchFilter],
		async ({ pageParam = 0 }) => {
			const fetchedData = await fetchGet('cardholders', pageParam, {
				filter: searchFilter,
				value: searchbarValue,
			});

			if (searchbarValue !== '') {
				fetchedData.documents = fetchedData.documents.sort((a, b) =>
					a[searchFilter] < b[searchFilter] ? -1 : 1
				);
			}

			return fetchedData;
		},
		{
			getNextPageParam: (_lastGroup, groups) => groups.length,
			keepPreviousData: false,
			refetchOnWindowFocus: false,
		}
	);

export const useCredentials = (searchbarValue, searchFilter) =>
	useInfiniteQuery(
		['credentials-data', searchbarValue, searchbarValue && searchFilter],
		async ({ pageParam = 0 }) => {
			const fetchedData = await fetchGet('credentials', pageParam, {
				filter: searchFilter,
				value: searchbarValue,
			});

			if (searchbarValue) {
				fetchedData.documents = fetchedData.documents.sort((a, b) =>
					a[searchFilter] < b[searchFilter] ? -1 : 1
				);
			}

			return fetchedData;
		},
		{
			getNextPageParam: (_lastGroup, groups) => groups.length,
			keepPreviousData: false,
			refetchOnWindowFocus: false,
		}
	);

export const useAvailableCredentials = (searchbarValue) =>
	useInfiniteQuery(
		['availableCredentials-data', searchbarValue],
		async ({ pageParam = 0 }) => {
			const fetchedData = await fetchGetAvailableCredentials(pageParam, {
				filter: '_id',
				value: searchbarValue,
			});

			if (searchbarValue) {
				fetchedData.documents = fetchedData.documents.sort((a, b) => (a._id < b._id ? -1 : 1));
			}

			return fetchedData;
		},
		{
			getNextPageParam: (_lastGroup, groups) => groups.length,
			keepPreviousData: false,
			refetchOnWindowFocus: false,
		}
	);
