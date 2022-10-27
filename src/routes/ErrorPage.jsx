import { useRouteError } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ErrorPage() {
	const error = useRouteError();
	console.error(error);

	return (
		<>
			<div className='app'>
				<Navbar />
				<div className='error-page'>
					<div className='error-container'>
						<h1>Oops!</h1>
						<i>Sorry, an unexpected error has occurred.</i>
						<p className='error'>
							<span className='status'>{error.status}</span>:{' '}
							<span className='status-text'>{error.statusText}</span>
							<div className='status-text'>{error.message}</div>
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
