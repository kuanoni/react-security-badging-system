import React, { useState } from 'react';

import CredentialsTable from './CredentialsTable';
import Navbar from '../../components/Navbar';

const CredentialsPage = () => {
	const [isNavbarOpen, setIsNavbarOpen] = useState(false);

	return (
		<div className='app'>
			<Navbar isNavbarOpen={isNavbarOpen} setIsNavbarOpen={setIsNavbarOpen} pageName={'credentials'} />
			<CredentialsTable isNavbarOpen={isNavbarOpen} />
		</div>
	);
};

export default CredentialsPage;
