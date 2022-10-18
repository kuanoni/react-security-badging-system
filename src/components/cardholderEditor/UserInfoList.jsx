import React from 'react';

const UserInfoList = ({ label, list, onAdd, onRemove, isEditing }) => {
	return (
		<>
			<div className='user-info-list-header'>
				<label className='user-info-label'>{label}</label>
				<button className='gg-add' onClick={onAdd} disabled={!isEditing} />
			</div>
			<ul className='user-info-list'>
				{list.map((item, i) => (
					<li className='user-info-list-item' key={i}>
						<span>{item}</span>
						<button className='gg-remove' onClick={() => onRemove(item)} disabled={!isEditing} />
					</li>
				))}
			</ul>
		</>
	);
};

export default UserInfoList;
