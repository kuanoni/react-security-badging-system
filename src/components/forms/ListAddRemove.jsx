import '../../styles/ListAddRemove.scss';

import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const ListAddRemove = ({ label, list, listKey, onAdd, onRemove, isEditing }) => {
	return (
		<div className='list'>
			<div className='list-header'>
				<label className='label'>{label}</label>
				<button onClick={onAdd} disabled={!isEditing}>
					<FontAwesomeIcon icon={faPlus} />
				</button>
			</div>
			<ul className='list-body'>
				{list.map((item, i) => (
					<li className='list-item' key={i}>
						<span>{item[listKey]}</span>
						<button onClick={() => onRemove(item)} disabled={!isEditing}>
							<FontAwesomeIcon icon={faMinus} />
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ListAddRemove;
