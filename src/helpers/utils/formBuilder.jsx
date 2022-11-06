import { useAccessGroups, useCredentials } from '../api/queries';

import CustomDatePicker from '../../components/forms/CustomDatePicker';
import DropdownList from '../../components/forms/DropdownList';
import LabeledInput from '../../components/forms/LabeledInput';
import ListAddRemove from '../../components/forms/ListAddRemove';
import { useEffect } from 'react';
import { useState } from 'react';

const lettersField = (val) => {
	if (val.length === 0) return 'This field is required.';
	if (!/^[A-Za-z]*$/.test(val)) return 'This field can only contain letters.';
};

const numbersField = (val) => {
	if (val.length === 0) return 'This field is required.';
	if (!/^[0-9]*$/.test(val)) return 'This field can only contain numbers.';
};

const lettersNumbersField = (val) => {
	if (val.length === 0) return 'This field is required.';
	if (!/^[A-Za-z0-9]*$/.test(val)) return 'This field can only contain letter or numbers.';
};

const emailField = (val) => {
	if (val.length === 0) return 'This field is required.';
	if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(val)) return 'This field must be a valid email address.';
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
					queryHook: useAccessGroups,
					error: () => {},
				},
				{
					key: 'credentials',
					label: 'Badges',
					type: 'list',
					listKey: '_id',
					queryHook: useCredentials,
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

const BuildForm = ({ formTemplate, defaultData, isEditing, isSaving, submit }) => {
	const [formData, setFormData] = useState(defaultData);

	const formTypeComponents = {
		text: (formItem) => (
			<LabeledInput
				label={formItem.label}
				defaultValue={defaultData[formItem.key]}
				handleChange={(newValue) => onChangeHandler(formItem.key, newValue)}
				isDisabled={!isEditing}
			/>
		),
		select: (formItem) => (
			<DropdownList
				label={formItem.label}
				defaultValue={defaultData[formItem.key]}
				options={formItem.options}
				handleChange={(newValue) => onChangeHandler(formItem.key, newValue)}
				isDisabled={!isEditing}
			/>
		),
		list: (formItem) => (
			<ListAddRemove
				label={formItem.label}
				defaultList={defaultData[formItem.key]}
				listKey={formItem.listKey}
				handleChange={(newList) => onChangeHandler(formItem.key, newList)}
				isDisabled={!isEditing}
				modalProps={{
					queryHook: formItem.queryHook,
				}}
			/>
		),
		datepicker: (formItem) => (
			<CustomDatePicker
				label={formItem.label}
				defaultDate={defaultData[formItem.key]}
				handleChange={(newDate) => onChangeHandler(formItem.key, newDate)}
				minDate={formItem.minDate}
				maxDate={formItem.maxDate}
				isDisabled={!isEditing}
			/>
		),
	};

	const onChangeHandler = (key, value) => {
		if (!isSaving)
			setFormData((currentFormData) => {
				const newFormData = { ...currentFormData };
				newFormData[key] = value;
				return newFormData;
			});
	};

	useEffect(() => {
		if (isSaving) submit(formData);
	}, [isSaving, submit, formData]);

	return ['left', 'right'].map((column) => (
		<div className='column' key={column}>
			{formTemplate[column].map((section, i) => (
				<div className='container' key={i}>
					<h1 className='title'>{section.label}</h1>
					{section.form.map((formItem) => {
						return formTypeComponents[formItem.type](formItem, defaultData, onChangeHandler, !isEditing);
					})}
				</div>
			))}
		</div>
	));
};

export default BuildForm;
