const fetchSize = 30;
const apiUrl = 'https://security-system-api.herokuapp.com/';

export const fetchGet = async (collection, page, search) => {
	let fetchUrl = apiUrl + collection + '/get';

	if (search.searchBy) fetchUrl += `?searchBy=${search.searchBy}&value=${search.value}`;
	else fetchUrl += '?page=' + (page + 1) + '&limit=' + fetchSize;

	const data = await fetch(fetchUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((res) => res.json());

	return { documents: data.documents, count: data.count };
};

export const fetchCardholders = async (page, filterUrlText, cb) => {
	let fetchUrl = apiUrl + 'cardholders';

	if (filterUrlText) fetchUrl += filterUrlText;
	else fetchUrl += '?page=' + (page + 1) + '&limit=' + fetchSize;

	const fetchedCardholders = await fetch(fetchUrl).then((res) => res.json());

	if (fetchedCardholders) return fetchedCardholders;
};

export const fetchCardholder = async (id) => {
	let fetchUrl = apiUrl + 'cardholders/' + id;

	const fetchedCardholder = await fetch(fetchUrl).then((res) => res.json());

	if (fetchedCardholder) {
		return fetchedCardholder;
	}
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
