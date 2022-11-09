import { useEffect, useState } from 'react';

import { useMemo } from 'react';

export const useColorTheme = () => {
	const [themeIndex, setThemeIndex] = useState(() => {
		const initThemeIdx = JSON.parse(localStorage.getItem('themeIdx')) || 0;
		return initThemeIdx;
	});

	const themes = useMemo(
		() =>
			[
				{ base: ['0', '0%', '17%'], accent: ['202', '100%', '70%'] },
				{ base: ['211', '17%', '17%'], accent: ['191', '57%', '50%'] },
				{ base: ['160', '57%', '17%'] },
				{ base: ['0', '57%', '17%'] },
				{ base: ['270', '57%', '17%'] },
				{ base: ['300', '57%', '17%'] },
			].map((color) =>
				color.accent ? color : { ...color, accent: [(parseInt(color.base) - 20).toString(), '57%', '50%'] }
			),
		[]
	);

	const cssRoot = useMemo(() => document.querySelector(':root'), []);

	useEffect(() => {
		const applyTheme = (idx) => {
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

		applyTheme(themeIndex);
		localStorage.setItem('themeIdx', themeIndex.toString());
	}, [themeIndex, themes, cssRoot.style]);

	return { themes, themeIndex, setThemeIndex };
};
