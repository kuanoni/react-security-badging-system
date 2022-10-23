import { faker } from '@faker-js/faker';
import fs from 'fs';

const makeCredentials = (count) => {
	let creds = [];
	for (let i = 0; i < count; i++) {
		creds.push({
			id: i + 1,
			badgeNumber: faker.datatype.number({ min: 10000, max: 99999 }),
			badgeType: pickRandomOutOfList(['Employee', 'Contractor', 'Privileged Visitor']),
			badgeOwnerId: '',
			badgeOwnerName: '',
		});
	}

	return creds;
};

const makeAccessGroups = () => {
	const groups = [
		'Global Access',
		'General Access',
		'Lab Access',
		'Lab 2 Access',
		'Fabrication Access',
		'Fabrication 2 Access',
		'Tech Access',
		'Custodian Access',
		'Cafeteria Access',
		'Bar Access',
	];

	return groups.map((group, i) => ({ accessGroup: group, id: i + 1 }));
};

const makeCardholders = (count) => {
	const accessGroups = makeAccessGroups();
	const tempCreds = makeCredentials(80);
	const assignedCreds = [];
	const cardholders = [];

	const cardholdersIdsWithCreds = getUniqueRandomNumbers(count * 0.75, count + 1);

	for (let i = 0; i < count; i++) {
		const avatar = faker.image.avatar();
		const firstName = faker.name.firstName();
		const lastName = faker.name.lastName();
		const email = `${firstName}.${lastName}@company.com`;
		const employeeId = faker.datatype.number(1000000, 9999999);
		const title = faker.name.jobType();
		const activation = faker.date.past(2);
		const expiration = faker.date.between(activation, new Date().setFullYear(new Date().getFullYear() + 2));
		const status = new Date(expiration) > Date.now();
		const type = pickRandomOutOfList(['Employee', 'Contractor', 'Privileged Visitor']);

		const cholderCreds = [];
		const cholderGroups = getUniqueRandomNumbers(Math.floor(Math.random() * 3 + 1), accessGroups.length).map(
			(num) => accessGroups[num]
		);

		if (cardholdersIdsWithCreds.includes(i)) {
			for (let j = 0; j < Math.floor(Math.random() * 3); j++) {
				const cred = {
					...tempCreds.shift(),
					badgeOwnerId: (i + 1).toString(),
					badgeOwnerName: firstName + ' ' + lastName,
				};
				cholderCreds.push(cred);
				assignedCreds.push(cred);
			}
		}

		cardholders.push({
			id: (i + 1).toString(),
			avatar,
			firstName,
			lastName,
			email,
			employeeId,
			title,

			cardholderProfile: {
				status,
				activation,
				expiration,
				type,
				credentials: cholderCreds,
				accessGroups: cholderGroups,
			},
		});
	}

	const credentials = [...assignedCreds, ...tempCreds].sort((a, b) => a.id > b.id);

	return { cardholders, credentials, accessGroups };
};

const pickRandomOutOfList = (list) => {
	const r = Math.floor(Math.random() * list.length);
	return list[r];
};

const getUniqueRandomNumbers = (amt, max, min = 0) => {
	const arr = [];
	while (arr.length < amt) {
		const r = Math.floor(Math.random() * max + min);
		if (!arr.includes(r)) arr.push(r);
	}

	return arr;
};

const writeJson = (fileName, obj) => {
	fs.writeFile(`${fileName}.json`, JSON.stringify(obj), 'utf8', () => {});
};

const { cardholders, credentials, accessGroups } = makeCardholders(60);

writeJson('credentials', credentials);
writeJson('accessGroups', accessGroups);
writeJson('cardholders', cardholders);
