import '../styles/Navbar.scss';

import { faAddressCard, faAnglesLeft, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { useEffect } from 'react';
import { useState } from 'react';

const themes = [
	{ base: ['0', '0%', '17%'], accent: ['202', '100%', '70%'] },
	{ base: ['211', '17%', '17%'], accent: ['191', '57%', '50%'] },
	{ base: ['160', '57%', '17%'] },
	{ base: ['0', '57%', '17%'] },
	{ base: ['270', '57%', '17%'] },
	{ base: ['300', '57%', '17%'] },
];

const Navbar = ({ isNavbarOpen, setIsNavbarOpen, pageName }) => {
	const [themeIndex, setThemeIndex] = useState(() => {
		const initThemeIdx = JSON.parse(localStorage.getItem('themeIdx')) || 0;
		return initThemeIdx;
	});

	const applyTheme = (idx) => {
		const cssRoot = document.querySelector(':root');
		cssRoot.style.setProperty('--clr-base-h', themes[idx].base[0]);
		cssRoot.style.setProperty('--clr-base-s', themes[idx].base[1]);
		cssRoot.style.setProperty('--clr-base-l', themes[idx].base[2]);

		if (themes[idx].accent) {
			cssRoot.style.setProperty('--clr-accent-h', themes[idx].accent[0]);
			cssRoot.style.setProperty('--clr-accent-s', themes[idx].accent[1]);
			cssRoot.style.setProperty('--clr-accent-l', themes[idx].accent[2]);
		} else {
			cssRoot.style.setProperty('--clr-accent-h', parseInt(themes[idx].base[0]) - 20);
			cssRoot.style.setProperty('--clr-accent-s', themes[idx].base[1]);
			cssRoot.style.setProperty('--clr-accent-l', themes[idx].base[1]);
		}
	};

	useEffect(() => {
		applyTheme(themeIndex);
		localStorage.setItem('themeIdx', JSON.stringify(themeIndex));
	}, [themeIndex]);

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
