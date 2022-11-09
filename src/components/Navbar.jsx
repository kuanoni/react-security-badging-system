import '../styles/Navbar.scss';

import { faAddressCard, faAnglesLeft, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { useState } from 'react';

const hues = [211, 160, 0, 270, 300];

const Navbar = ({ isNavbarOpen, setIsNavbarOpen, pageName }) => {
	const [theme, setTheme] = useState(211);

	return (
		<nav className={isNavbarOpen ? 'open' : 'closed'}>
			<div className='nav-btns-container'>
				<div className='nav-btn nav-toggle-btn' onClick={() => setIsNavbarOpen(!isNavbarOpen)}>
					<div className='logo-container'>
						<span className='text'>SEC</span>
						<span className='gg-shape-hexagon'></span>
					</div>

					<div className='nav-btn'>
						<span className='icon-wrapper'>
							<FontAwesomeIcon icon={faAnglesLeft} />
						</span>
					</div>
				</div>
				<div className='separator' />
				<a href='/' className={'nav-btn' + (pageName === 'cardholders' ? ' active' : '')}>
					<span className='icon-wrapper'>
						<FontAwesomeIcon icon={faUser} />
					</span>
					<label>Cardholders</label>
				</a>
				<a href='credentials' className={'nav-btn' + (pageName === 'credentials' ? ' active' : '')}>
					<span className='icon-wrapper'>
						<FontAwesomeIcon icon={faAddressCard} />
					</span>
					<label>Credentials</label>
				</a>
				<a href='access-groups' className={'nav-btn' + (pageName === 'accessGroups' ? ' active' : '')}>
					<span className='icon-wrapper'>
						<FontAwesomeIcon icon={faUsers} />
					</span>
					<label>Access Groups</label>
				</a>
				<div className='nav-footer'>
					<div className='theme-colors'>
						{hues.map((hue) => (
							<button
								className={'color-btn' + (hue === theme ? ' active' : '')}
								onClick={() => {
									document.querySelector(':root').style.setProperty('--clr-base-h', hue);
									setTheme(hue);
								}}
								style={{ backgroundColor: 'hsl(' + hue + ', 53%, 17%)' }}
							/>
						))}
					</div>
					<div className='separator' />
					<a href='https://github.com/kuanoni/react-table-security-system' className='nav-btn'>
						<span className='icon-wrapper'>
							<FontAwesomeIcon icon={fab.faGithub} />
						</span>
						<label>Github</label>
					</a>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
