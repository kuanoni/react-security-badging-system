import '../styles/Navbar.scss';

import { faAddressCard, faAnglesLeft, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { useEffect } from 'react';
import { useState } from 'react';

const colors = [
	{ base: ['0', '0%', '17%'], accent: ['202', '100%', '70%'] },
	{ base: ['211', '57%', '17%'] },
	{ base: ['160', '57%', '17%'] },
	{ base: ['0', '57%', '17%'] },
	{ base: ['270', '57%', '17%'] },
	{ base: ['300', '57%', '17%'] },
];

const Navbar = ({ isNavbarOpen, setIsNavbarOpen, pageName }) => {
	const [baseTheme, setBaseTheme] = useState(colors[0].base);

	const setTheme = (color) => {
		setBaseTheme(color.base);
		document.querySelector(':root').style.setProperty('--clr-base-h', color.base[0]);
		document.querySelector(':root').style.setProperty('--clr-base-s', color.base[1]);
		document.querySelector(':root').style.setProperty('--clr-base-l', color.base[2]);

		if (color.accent) {
			document.querySelector(':root').style.setProperty('--clr-accent-h', color.accent[0]);
			document.querySelector(':root').style.setProperty('--clr-accent-s', color.accent[1]);
			document.querySelector(':root').style.setProperty('--clr-accent-l', color.accent[2]);
		} else {
			document.querySelector(':root').style.setProperty('--clr-accent-h', parseInt(color.base[0]) - 20);
			document.querySelector(':root').style.setProperty('--clr-accent-s', color.base[1]);
			document.querySelector(':root').style.setProperty('--clr-accent-l', color.base[1]);
		}
	};

	useEffect(() => {
		setTheme(colors[0]);
	}, []);

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
					<div className='theme-picker'>
						<div className='title'>THEMES</div>
						<div className='theme-colors'>
							{colors.map((color, i) => (
								<button
									key={i}
									className={'color-btn' + (color.base === baseTheme ? ' active' : '')}
									onClick={() => setTheme(color)}
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
