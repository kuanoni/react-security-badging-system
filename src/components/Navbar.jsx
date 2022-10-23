import React from 'react';

const Navbar = () => {
	return (
		<div className='navbar-container'>
			<div className='logo-container'>
				<span className='text'>SEC</span>
				<span className='gg-shape-hexagon'></span>
			</div>
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
			<a href='access-groups' className='btn'>
				<span className='icon-container'>
					<i className='gg-tag'></i>
				</span>
				<span className='title'>Access Groups</span>
			</a>
		</div>
	);
};

export default Navbar;
