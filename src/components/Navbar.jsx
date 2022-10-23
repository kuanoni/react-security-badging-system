import React from 'react';
import '../styles/Navbar.scss';

const Navbar = () => {
	return (
		<div className='navbar-container'>
			<button className='btn'>
				<span className='icon-container'>
					<i className='gg-profile'></i>
				</span>
				<span className='title'>Cardholders</span>
			</button>
			<button className='btn'>
				<span className='icon-container'>
					<i className='gg-card'></i>
				</span>
				<span className='title'>Credentials</span>
			</button>
			<button className='btn'>
				<span className='icon-container'>
					<i className='gg-tag'></i>
				</span>
				<span className='title'>Access Groups</span>
			</button>
		</div>
	);
};

export default Navbar;
