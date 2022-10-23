import React from 'react';
import '../styles/Navbar.scss';

const Navbar = () => {
	return (
		<div className='navbar-container'>
			<a href='/' className='btn'>
				<span className='icon-container'>
					<i className='gg-profile'></i>
				</span>
				<span className='title'>Cardholders</span>
			</a>
			<a href='credentials' className='btn'>
				<span className='icon-container'>
					<i className='gg-card'></i>
				</span>
				<span className='title'>Credentials</span>
			</a>
			<a className='btn'>
				<span className='icon-container'>
					<i className='gg-tag'></i>
				</span>
				<span className='title'>Access Groups</span>
			</a>
		</div>
	);
};

export default Navbar;
