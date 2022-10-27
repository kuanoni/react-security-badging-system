const fetchSize = 30;
// const apiUrl = 'https://security-system-api.herokuapp.com/';
const apiUrl = 'http://localhost:5000/';

export const fetchGet = async (collection, page, search, props) => {
	let fetchUrl = apiUrl + collection + '/get';

	if (search.filter) fetchUrl += `?filter=${search.filter}&value=${search.value}`;
	else fetchUrl += '?page=' + (page + 1) + '&limit=' + fetchSize;

	if (props) fetchUrl += '&props=' + props;

	const data = await fetch(fetchUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((res) => res.json());

	return { documents: data.documents, count: data.count };
};

export const fetchGetById = async (collection, id) => {
	let fetchUrl = apiUrl + collection + '/get/' + id;

	const data = await fetch(fetchUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((res) => res.json());

	return data;
};

export const fetchUpdate = async (collection, id, body) => {
	const response = await fetch(apiUrl + collection + '/update/' + id, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	return response;
};

export const updateCardholder = async (id, newCardholder) => {
	const response = await fetch(apiUrl + 'cardholders/' + id, {
		method: 'PUT',
		body: newCardholder,
	});

	return response;
};

export const fetchAccessGroups = async (page, filterUrlText) => {
	let fetchUrl = apiUrl + 'access-groups';

	if (filterUrlText) fetchUrl += filterUrlText;
	else fetchUrl += '?page=' + (page + 1) + '&limit=' + fetchSize;

	const fetchedAccessGroups = await fetch(fetchUrl).then((res) => res.json());

	if (fetchedAccessGroups)
		return {
			data: fetchedAccessGroups.accessGroups,
			dataKey: 'accessGroup',
			count: fetchedAccessGroups.count,
		};
};

export const fetchCredentials = async (page, filterUrlText) => {
	let fetchUrl = apiUrl + 'credentials';

	if (filterUrlText) fetchUrl += filterUrlText;
	else fetchUrl += '?page=' + (page + 1) + '&limit=' + fetchSize;

	const fetchedCredentials = await fetch(fetchUrl).then((res) => res.json());

	if (fetchedCredentials)
		return {
			data: fetchedCredentials.credentials,
			dataKey: 'badgeNumber',
			count: fetchedCredentials.count,
		};
};
