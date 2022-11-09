import { useAccessGroups, useAvailableCredentials } from '../api/queries';

import CustomDatePicker from '../../components/forms/CustomDatePicker';
import DropdownList from '../../components/forms/DropdownList';
import LabeledInput from '../../components/forms/LabeledInput';
import ListAddRemove from '../../components/forms/ListAddRemove';
import { useMemo } from 'react';

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
					queryHook: useAccessGroups,
					error: () => {},
				},
				{
					key: 'credentials',
					label: 'Badges',
					type: 'list',
					listKey: '_id',
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

const BuildForm = ({ formTemplate, defaultData, updateData, isDataNew, isEditing, isSaving }) => {
	const formTypeComponents = useMemo(() => {
		const onChangeHandler = (key, value) => {
			if (!isSaving)
				updateData((currentData) => {
					const newFormData = { ...currentData };
					newFormData[key] = value;
					return newFormData;
				});
		};

		return {
			text: (formItem) => (
				<LabeledInput
					key={formItem.key}
					label={formItem.label}
					defaultValue={defaultData[formItem.key]}
					handleChange={(newValue) => onChangeHandler(formItem.key, newValue)}
					checkErrors={formItem.error}
					isDisabled={formItem.disabledUnlessNew ? !isDataNew : !isEditing}
				/>
			),
			select: (formItem) => (
				<DropdownList
					key={formItem.key}
					label={formItem.label}
					defaultValue={defaultData[formItem.key]}
					options={formItem.options}
					handleChange={(newValue) => onChangeHandler(formItem.key, newValue)}
					isDisabled={formItem.disabledUnlessNew ? !isDataNew : !isEditing}
				/>
			),
			list: (formItem) => (
				<ListAddRemove
					key={formItem.key}
					label={formItem.label}
					defaultList={defaultData[formItem.key]}
					listKey={formItem.listKey}
					handleChange={(newList) => onChangeHandler(formItem.key, newList)}
					isDisabled={formItem.disabledUnlessNew ? !isDataNew : !isEditing}
					modalProps={{
						queryHook: formItem.queryHook,
					}}
				/>
			),
			datepicker: (formItem) => (
				<CustomDatePicker
					key={formItem.key}
					label={formItem.label}
					defaultDate={defaultData[formItem.key]}
					handleChange={(newDate) => onChangeHandler(formItem.key, newDate)}
					minDate={formItem.minDate}
					maxDate={formItem.maxDate}
					isDisabled={formItem.disabledUnlessNew ? !isDataNew : !isEditing}
				/>
			),
		};
	}, [defaultData, isDataNew, isEditing, isSaving, updateData]);

	const formItems = useMemo(
		() =>
			['left', 'right'].map((columnKey) => (
				<div className='column' key={columnKey}>
					{formTemplate[columnKey].map((section, i) => (
						<section key={i}>
							<h1 className='title'>{section.label}</h1>
							{section.form.map((formItem) =>
								formTypeComponents[formItem.type](formItem, defaultData, !isEditing)
							)}
						</section>
					))}
				</div>
			)),
		[formTemplate, formTypeComponents, defaultData, isEditing]
	);

	return formItems;
};

export default BuildForm;
