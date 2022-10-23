import React from 'react';
import Navbar from '../components/Navbar';
import CredentialsTable from '../components/credentialsTable/CredentialsTable';

const CredentialsPage = () => {
	return (
		<div className='credentials-body'>
			<Navbar />
			<CredentialsTable />
		</div>
	);
};

export default CredentialsPage;
