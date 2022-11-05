import '../styles/Error.scss';

import Navbar from '../components/Navbar';
import { useRouteError } from 'react-router-dom';
import { useState } from 'react';

export default function ErrorPage() {
	const [isNavbarOpen, setIsNavbarOpen] = useState(false);
	const error = useRouteError();
	console.error(error);

	return (
		<>
			<div className='app'>
				<Navbar isNavbarOpen={isNavbarOpen} setIsNavbarOpen={setIsNavbarOpen} pageName={'error'} />
				<div className={'error-page' + (isNavbarOpen ? '' : ' navbar-closed')}>
					<div className='error-container'>
						<h1>Oops!</h1>
						<i>Sorry, an unexpected error has occurred.</i>
						<div className='error'>
							<span className='status'>{error.status}</span>:{' '}
							<span className='status-text'>{error.statusText}</span>
							<div className='status-text'>{error.message}</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
