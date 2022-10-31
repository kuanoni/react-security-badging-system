import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faAddressCard, faAnglesLeft, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ isNavbarOpen, setIsNavbarOpen }) => {
	return (
		<nav className={isNavbarOpen ? 'open' : 'closed'}>
			<div className='logo-container'>
				<span className='text'>SEC</span>
				<span className='gg-shape-hexagon'></span>
			</div>
			<div className='nav-btns-container'>
				<div className='separator' />
				<div className='nav-btn nav-toggle-btn' onClick={() => setIsNavbarOpen(!isNavbarOpen)}>
					<span className='icon-wrapper'>
						<FontAwesomeIcon icon={faAnglesLeft} />
					</span>
				</div>
				<div className='separator' />
				<a href='/' className='nav-btn'>
					<span className='icon-wrapper'>
						<FontAwesomeIcon icon={faUser} />
					</span>
					<label>Cardholders</label>
				</a>
				<a href='credentials' className='nav-btn'>
					<span className='icon-wrapper'>
						<FontAwesomeIcon icon={faAddressCard} />
					</span>
					<label>Credentials</label>
				</a>
				<a href='access-groups' className='nav-btn'>
					<span className='icon-wrapper'>
						<FontAwesomeIcon icon={faUsers} />
					</span>
					<label>Access Groups</label>
				</a>
				<div className='separator' />
				<a href='https://github.com/kuanoni/react-table-security-system' className='nav-btn'>
					<span className='icon-wrapper'>
						<FontAwesomeIcon icon={fab.faGithub} />
					</span>
					<label>Github</label>
				</a>
			</div>
		</nav>
	);
};

export default Navbar;
