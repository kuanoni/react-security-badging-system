import CustomDatePicker from '../../components/forms/CustomDatePicker';
import DropdownList from '../../components/forms/DropdownList';
import LabeledInput from '../../components/forms/LabeledInput';
import ListAddRemove from '../../components/forms/ListAddRemove';
import { useMemo } from 'react';

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
					selectionListProps={{
						queryHook: formItem.queryHook,
						selectionListLabels: formItem.selectionListLabels,
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
					{formTemplate[columnKey].map((section, i) => {
						if (section.hideIfNew && isDataNew) return <div key={i}></div>;
						else
							return (
								<section key={i}>
									<h1 className='title'>{section.label}</h1>
									{section.form.map((formItem) => {
										if (formItem.hideIfNew && isDataNew) return <div key={formItem.key}></div>;
										else
											return formTypeComponents[formItem.type](formItem, defaultData, !isEditing);
									})}
								</section>
							);
					})}
				</div>
			)),
		[formTemplate, formTypeComponents, defaultData, isEditing, isDataNew]
	);

	return formItems;
};

export default BuildForm;
