import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import CredentialsTable from '../components/credentialsTable/CredentialsTable';

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
