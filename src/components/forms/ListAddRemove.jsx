import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

const ListAddRemove = ({ label, list, listKey, onAdd, onRemove, isEditing }) => {
	return (
		<>
			<div className='list-header'>
				<label className='label'>{label}</label>
				<button onClick={onAdd} disabled={!isEditing}>
					<FontAwesomeIcon icon={faPlus} />
				</button>
			</div>
			<ul className='list'>
				{list.map((item, i) => (
					<li className='list-item' key={i}>
						<span>{item[listKey]}</span>
						<button onClick={() => onRemove(item)} disabled={!isEditing}>
							<FontAwesomeIcon icon={faMinus} />
						</button>
					</li>
				))}
			</ul>
		</>
	);
};

export default ListAddRemove;
