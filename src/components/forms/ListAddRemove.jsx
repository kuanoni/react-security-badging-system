import '../../styles/ListAddRemove.scss';

import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../Modal';
import React from 'react';
import SelectionList from '../SelectionListContainer';
import { useState } from 'react';

const ListAddRemove = ({ label, defaultList, listKey, handleChange, isDisabled, modalProps }) => {
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
			<Modal
				isOpen={isModalOpen}
				closeModal={() => setIsModalOpen(false)}
				overlayClassName={'overlay selection-list'}
				modalClassName={'modal'}
			>
				<SelectionList
					queryHook={modalProps.queryHook}
					dataKey={listKey}
					initialSelected={list}
					saveNewList={onAdd}
					closeModal={() => setIsModalOpen(false)}
				/>
			</Modal>
		</>
	);
};

export default ListAddRemove;
