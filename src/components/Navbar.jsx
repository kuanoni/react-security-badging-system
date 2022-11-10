import '../styles/Navbar.scss';

import { Link, NavLink } from 'react-router-dom';
import { faAnglesLeft, faIdCard, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { useColorTheme } from '../hooks/useColorTheme';

const Navbar = ({ isNavbarOpen, setIsNavbarOpen, pageName }) => {
	const { themes, themeIndex, setThemeIndex } = useColorTheme();

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
				<NavLink
					to='/cardholders'
					title='Cardholders'
					className={({ isActive }) => 'nav-btn' + (isActive ? ' active' : '')}
				>
					<span className='icon-wrapper'>
						<FontAwesomeIcon icon={faUser} />
					</span>
					<label>Cardholders</label>
				</NavLink>
				<NavLink
					to='/credentials'
					title='Credentials'
					className={({ isActive }) => 'nav-btn' + (isActive ? ' active' : '')}
				>
					<span className='icon-wrapper'>
						<FontAwesomeIcon icon={faIdCard} />
					</span>
					<label>Credentials</label>
				</NavLink>
				{/* eslint-disable-next-line */}
				<NavLink
					to={'/accessGroups'}
					style={{ cursor: 'not-allowed' }}
					title='Access Groups'
					className={({ isActive }) => 'nav-btn' + (isActive ? ' active' : '')}
					onClick={(e) => e.preventDefault()}
				>
					<span className='icon-wrapper'>
						<FontAwesomeIcon icon={faUsers} />
					</span>
					<label>Access Groups</label>
				</NavLink>
				<div className='nav-footer'>
					<div className='theme-picker'>
						<div className='title'>THEMES</div>
						<div className='theme-colors'>
							{themes.map((color, i) => (
								<button
									key={i}
									className={'color-btn' + (i === themeIndex ? ' active' : '')}
									onClick={() => setThemeIndex(i)}
									style={{ backgroundColor: 'hsl(' + color.base.join(', ') + ')' }}
								/>
							))}
						</div>
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
