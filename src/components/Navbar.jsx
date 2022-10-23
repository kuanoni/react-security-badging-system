import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faAddressCard, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
	return (
		<div className='navbar-container'>
			<div className='logo-container'>
				<span className='text'>SEC</span>
				<span className='gg-shape-hexagon'></span>
			</div>
			<a href='/' className='btn'>
				<span className='icon-container'>
					<FontAwesomeIcon icon={faUser} />
				</span>
				<span className='title'>Cardholders</span>
			</a>
			<a href='credentials' className='btn'>
				<span className='icon-container'>
					<FontAwesomeIcon icon={faAddressCard} />
				</span>
				<span className='title'>Credentials</span>
			</a>
			<a href='access-groups' className='btn'>
				<span className='icon-container'>
					<FontAwesomeIcon icon={faUsers} />
				</span>
				<span className='title'>Access Groups</span>
			</a>
			<a href='access-groups' className='btn'>
				<span className='icon-container'>
					<FontAwesomeIcon icon={fab.faGithub} />
				</span>
				<span className='title'>Access Groups</span>
			</a>
		</div>
	);
};

export default Navbar;
