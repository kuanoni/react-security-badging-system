import React, { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { Toaster } from 'react-hot-toast';
import CardholderEditor from './cardholdersTable/CardholderEditor';
import Modal from './Modal';
import Table from './Table';
import { fetchGet } from '../api/fetch';

const CardholdersTable = ({
	tableColumns,
	searchbarValue,
	searchFilter,
	isModalOpen,
	cardholderToEdit,
	setCardholderToEdit,
	openCardholderEditor,
	closeCardholderEditor,
	setClearDataCache,
}) => {
	const [cardholderCount, setCardholderCount] = useState(0);

	/* =======================
            DATA FETCHING
       ======================= */

	const searchParams = useMemo(() => {
		return searchbarValue ? { filter: searchFilter, value: searchbarValue } : {};
	}, [searchbarValue, searchFilter]);

	const { data, fetchNextPage, remove, isFetching, isFetched } = useInfiniteQuery(
		['table-data', searchbarValue, searchbarValue && searchFilter],
		async ({ pageParam = 0 }) => {
			const fetchedData = await fetchGet('cardholders', pageParam, searchParams);
			setCardholderCount(fetchedData.count);

			if (searchbarValue) {
				return fetchedData.documents.sort((a, b) => (a[searchFilter] < b[searchFilter] ? -1 : 1));
			}

			return fetchedData.documents;
		},
		{
			getNextPageParam: (_lastGroup, groups) => groups.length,
			keepPreviousData: false,
			refetchOnWindowFocus: false,
		}
	);

	const flatData = useMemo(() => {
		return data?.pages?.flat() ?? [];
	}, [data]);

	const fetchMoreOnBottomReached = (containerRef) => {
		if (containerRef) {
			const { scrollHeight, scrollTop, clientHeight } = containerRef;

			if (scrollHeight - scrollTop - clientHeight < 10 && !isFetching && flatData.length < cardholderCount) {
				fetchNextPage();
			}
		}
	};

	useEffect(() => {
		setClearDataCache(() => () => {
			remove();
		});
	}, [setClearDataCache, remove]);

	/* =======================
              HANDLERS
       ======================= */

	const onSaveCardholder = (newCardholder) => {
		setCardholderToEdit(newCardholder);
		remove(); // reloads infiniteQuery data cache
	};

	const handleRowClick = (e, id) => {
		// if double clicked, open editor
		if (e.detail === 2) openCardholderEditor(id);
	};

	return (
		<>
			<Toaster
				toastOptions={{
					className: 'toast',
					success: {
						iconTheme: {
							primary: '#0086c5',
							secondary: '#ffffff',
						},
					},
				}}
			/>
			<Modal
				isOpen={isModalOpen}
				closeModal={closeCardholderEditor}
				overlayClassName={'overlay cardholder-editor'}
				modalClassName={'modal'}
			>
				<CardholderEditor
					key={cardholderToEdit._id}
					cardholder={cardholderToEdit}
					closeModal={closeCardholderEditor}
					onSaveCardholder={onSaveCardholder}
				/>
			</Modal>

			<div className='cardholders'>
				<div className='table-body'>
					<div className='table-container' onScroll={(e) => fetchMoreOnBottomReached(e.target)}>
						{Object.keys(flatData).length ? (
							<Table data={flatData} columns={tableColumns} handleRowClick={handleRowClick} />
						) : (
							<div className='loader-container'>
								{isFetched ? <h3>No results...</h3> : <div className='loader'></div>}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default CardholdersTable;
