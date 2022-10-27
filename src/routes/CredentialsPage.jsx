import React from 'react';
import Navbar from '../components/Navbar';
import CredentialsTable from '../components/credentialsTable/CredentialsTable';

const CredentialsPage = () => {
	return (
		<div className='app'>
			<Navbar />
			<CredentialsTable />
		</div>
	);
};

export default CredentialsPage;
