import React, { useState } from 'react';

import CredentialsTable from './CredentialsTable';
import Navbar from '../../components/Navbar';

const CredentialsPage = () => {
	const [isNavbarOpen, setIsNavbarOpen] = useState(false);

	return (
		<div className='app'>
			<Navbar isNavbarOpen={isNavbarOpen} setIsNavbarOpen={setIsNavbarOpen} pageName={'credentials'} />
			<div className={'table-page' + (isNavbarOpen ? ' navbar-open' : ' navbar-closed')}>
				<div className='table-page-container'>
					<CredentialsTable />
				</div>
			</div>
		</div>
	);
};

export default CredentialsPage;
