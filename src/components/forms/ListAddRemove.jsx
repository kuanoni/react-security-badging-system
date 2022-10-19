import React from 'react';

const ListAddRemove = ({ label, list, onAdd, onRemove, isEditing }) => {
	return (
		<>
			<div className='list-header'>
				<label className='label'>{label}</label>
				<button className='gg-add' onClick={onAdd} disabled={!isEditing} />
			</div>
			<ul className='list'>
				{list.map((item, i) => (
					<li className='list-item' key={i}>
						<span>{item}</span>
						<button className='gg-remove' onClick={() => onRemove(item)} disabled={!isEditing} />
					</li>
				))}
			</ul>
		</>
	);
};

export default ListAddRemove;
