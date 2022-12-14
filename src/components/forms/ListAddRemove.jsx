import '../../styles/ListAddRemove.scss';

import React, { Suspense } from 'react';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../Modal';
import { useState } from 'react';

const SelectionList = React.lazy(() => import('../SelectionList/SelectionListContainer'));

const ListAddRemove = ({ label, defaultList, listKey, handleChange, isDisabled, selectionListProps }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [list, setList] = useState(defaultList);

	const onAdd = (newList) => {
		setList(newList);
		handleChange(newList);
	};

	const onRemove = (value) => {
		const idx = list.indexOf(value);
		const newList = [...list];

		if (idx > -1) {
			newList.splice(idx, 1);
			setList(newList);
			handleChange(newList);
		}
	};

	return (
		<>
			<div className='labeled-input'>
				<div className='list-add-remove'>
					<div className='list-header'>
						<label className='label'>{label}</label>
						<button onClick={() => setIsModalOpen(true)} disabled={isDisabled}>
							<FontAwesomeIcon icon={faPlus} />
						</button>
					</div>
					<ul className='list-body'>
						{list.map((item, i) => (
							<li className='list-item' key={i}>
								<span>{item[listKey]}</span>
								<button onClick={() => onRemove(item)} disabled={isDisabled}>
									<FontAwesomeIcon icon={faMinus} />
								</button>
							</li>
						))}
						{list.length === 0 && <span>No items...</span>}
					</ul>
				</div>
			</div>
			<Modal
				isOpen={isModalOpen}
				closeModal={() => setIsModalOpen(false)}
				overlayClassName={'overlay selection-list'}
				modalClassName={'modal'}
			>
				<Suspense
					fallback={
						<div className='container'>
							<div className='loader'></div>
						</div>
					}
				>
					<SelectionList
						{...selectionListProps}
						label={label}
						dataKey={listKey}
						initialSelected={list}
						saveNewList={onAdd}
						closeModal={() => setIsModalOpen(false)}
					/>
				</Suspense>
			</Modal>
		</>
	);
};

export default ListAddRemove;
