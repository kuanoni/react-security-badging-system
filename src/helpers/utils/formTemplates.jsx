import { useAccessGroups, useAvailableCredentials } from '../api/queries';

/* =======================
          VALIDATORS
    ======================= */

const lettersField = (val) => {
	const errors = [];
	if (val.length === 0) errors.push('Must not be empty.');
	if (val.length > 18) errors.push('Must be under 18 characters.');
	if (!/^[A-Za-z'\s]*$/.test(val)) errors.push('Must only contain letters.');
	return errors;
};

const numbersField = (val) => {
	const errors = [];
	if (val.length === 0) errors.push('Must not be empty.');
	if (val.length > 18) errors.push('Must be under 18 characters.');
	if (!/^[0-9]*$/.test(val)) errors.push('Must contain numbers.');
	return errors;
};

const lettersNumbersField = (val) => {
	const errors = [];
	if (val.length === 0) errors.push('Must not be empty.');
	if (val.length > 18) errors.push('Must be under 18 characters.');
	if (!/^[A-Za-z0-9'\s]*$/.test(val)) errors.push('Must contain letter or numbers.');
	return errors;
};

const emailField = (val) => {
	const errors = [];
	if (val.length === 0) errors.push('Must not be empty.');
	if (val.length > 40) errors.push('Must be under 40 characters.');
	if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val)) errors.push('Must be a valid email address.');
	return errors;
};

export const cardholderEditorForm = {
	left: [
		{
			label: 'General',
			form: [
				{
					key: '_id',
					label: 'Employee ID',
					type: 'text',
					disabledUnlessNew: true,
					error: numbersField,
				},
				{
					key: 'firstName',
					label: 'First Name',
					type: 'text',
					error: lettersField,
				},
				{
					key: 'lastName',
					label: 'Last Name',
					type: 'text',
					error: lettersField,
				},
				{
					key: 'email',
					label: 'Email',
					type: 'text',
					error: emailField,
				},
				{
					key: 'jobTitle',
					label: 'Job Title',
					type: 'text',
					error: lettersNumbersField,
				},
			],
		},
		{
			label: 'Access Rights',
			form: [
				{
					key: 'profileType',
					label: 'Profile Type',
					type: 'select',
					options: [
						{ value: 'Employee', label: 'Employee' },
						{ value: 'Contractor', label: 'Contractor' },
						{ value: 'Privileged Visitor', label: 'Privileged Visitor' },
					],
					error: () => [],
				},
				{
					key: 'accessGroups',
					label: 'Access Groups',
					type: 'list',
					listKey: 'groupName',
					selectionListLabelKeys: ['groupName'],
					queryHook: useAccessGroups,
					error: () => [],
				},
				{
					key: 'credentials',
					label: 'Badges',
					type: 'list',
					listKey: '_id',
					selectionListLabelKeys: ['_id', 'badgeType'],
					queryHook: useAvailableCredentials,
					error: () => [],
				},
			],
		},
	],
	right: [
		{
			label: 'Status',
			form: [
				{
					key: 'activationDate',
					label: 'Profile Activation',
					type: 'datepicker',
					disabledUnlessNew: true,
					maxDate: new Date(),
					error: () => [],
				},
				{
					key: 'expirationDate',
					label: 'Profile Expiration',
					type: 'datepicker',
					minDate: new Date(),
					error: () => [],
				},
				{
					key: 'profileStatus',
					label: 'Profile Status',
					type: 'select',
					options: [
						{ value: true, label: 'Active' },
						{ value: false, label: 'Inactive' },
					],
					error: () => [],
				},
			],
		},
	],
};

export const credentialsEditorForm = {
	left: [
		{
			label: 'General',
			form: [
				{
					key: '_id',
					label: 'Credential Number',
					type: 'text',

					disabledUnlessNew: true,
					error: numbersField,
				},
				{
					key: 'badgeFormat',
					label: 'Badge Format',
					type: 'select',
					options: [
						// ['HID 2000PGG', 'HID 1326LSS', 'HID 208X']
						{ value: 'HID 2000PGG', label: 'HID 2000PGG' },
						{ value: 'HID 1326LSS', label: 'HID 1326LSS' },
						{ value: 'HID 208X', label: 'HID 208X' },
					],
					error: () => [],
				},
			],
		},
		{
			label: 'Access Rights',
			form: [
				{
					key: 'partition',
					label: 'Credential Partition',
					type: 'select',
					options: [
						// ['BLR01', 'KNS01', 'KNS02', 'LA01', 'LA02', 'NYC01']
						{ value: 'BLR01', label: 'BLR01' },
						{ value: 'KNS01', label: 'KNS01' },
						{ value: 'KNS02', label: 'KNS02' },
						{ value: 'LA01', label: 'LA01' },
						{ value: 'LA02', label: 'LA02' },
						{ value: 'NYC01', label: 'NYC01' },
					],
					error: () => [],
				},
			],
		},
	],
	right: [
		{
			label: 'Status',
			form: [
				{
					key: 'activationDate',
					label: 'Credential Activation',
					type: 'datepicker',
					disabledUnlessNew: true,
					maxDate: new Date(),
					error: () => [],
				},
				{
					key: 'expirationDate',
					label: 'Credential Expiration',
					type: 'datepicker',
					minDate: new Date(),
					error: () => [],
				},
				{
					key: 'status',
					label: 'Credential Status',
					type: 'select',
					options: [
						{ value: true, label: 'Active' },
						{ value: false, label: 'Inactive' },
					],
					error: () => [],
				},
			],
		},
		{
			label: 'Owner',
			hideIfNew: true,
			form: [
				{
					key: 'badgeOwnerName',
					label: 'Badge Owner',
					type: 'text',
					disabledUnlessNew: true,
					hideIfNew: true,
					error: () => [],
				},
				{
					key: 'badgeOwnerId',
					label: 'Badge Owner ID',
					type: 'text',
					disabledUnlessNew: true,
					hideIfNew: true,
					error: () => [],
				},
			],
		},
	],
};
