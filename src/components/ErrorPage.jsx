import { useRouteError } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/Error.scss';

export default function ErrorPage() {
	const error = useRouteError();
	console.error(error);

	return (
		<>
			<div className='error-body'>
				<Navbar />
				<div className='error-page'>
					<div className='error-container'>
						<h1>Oops!</h1>
						<p>Sorry, an unexpected error has occurred.</p>
						<p>
							<i>{error.status + ': ' + error.statusText || error.message}</i>
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
