import { useAccessGroups, useAvailableCredentials } from '../api/queries';

/* =======================
          VALIDATORS
    ======================= */

const lettersField = (val) => {
	const errors = [];
	if (val.length === 0) errors.push('This field must not be empty.');
	if (!/^[A-Za-z\s]*$/.test(val)) errors.push('This field can only contain letters.');
	return errors;
};

const numbersField = (val) => {
	const errors = [];
	if (val.length === 0) errors.push('This field must not be empty.');
	if (!/^[0-9]*$/.test(val)) errors.push('This field can only contain numbers.');
	return errors;
};

const lettersNumbersField = (val) => {
	const errors = [];
	if (val.length === 0) errors.push('This field must not be empty.');
	if (!/^[A-Za-z0-9\s]*$/.test(val)) errors.push('This field can only contain letter or numbers.');
	return errors;
};

const emailField = (val) => {
	const errors = [];
	if (val.length === 0) errors.push('This field must not be empty.');
	if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val))
		errors.push('This field must be a valid email address.');
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
					error: () => {},
				},
				{
					key: 'accessGroups',
					label: 'Access Groups',
					type: 'list',
					listKey: 'groupName',
					selectionListLabels: ['groupName'],
					queryHook: useAccessGroups,
					error: () => {},
				},
				{
					key: 'credentials',
					label: 'Badges',
					type: 'list',
					listKey: '_id',
					selectionListLabels: ['_id', 'badgeType'],
					queryHook: useAvailableCredentials,
					error: () => {},
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
					error: () => {},
				},
				{
					key: 'expirationDate',
					label: 'Profile Expiration',
					type: 'datepicker',
					minDate: new Date(),
					error: () => {},
				},
				{
					key: 'profileStatus',
					label: 'Profile Status',
					type: 'select',
					options: [
						{ value: true, label: 'Active' },
						{ value: false, label: 'Inactive' },
					],
					error: () => {},
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
			],
		},
	],
	right: [],
};
