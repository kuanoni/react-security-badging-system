export const fetchSize = 30;
const apiUrl = 'https://api-security-badging.fly.dev/';
// const apiUrl = 'http://localhost:5000/';

export const fetchGet = async ({ collection, page, search, props, sort }) => {
	let fetchUrl = apiUrl + collection + '/get';

	fetchUrl += '?page=' + (page + 1) + '&limit=' + fetchSize;

	if (search.filter && search.value) fetchUrl += `&filter=${search.filter}&value=${search.value}`;
	if (sort.by && sort.order) fetchUrl += `&sortBy=${sort.by}&order=${sort.order}`;
	if (props) fetchUrl += '&props=' + props;

	// console.log(fetchUrl);

	const response = await fetch(fetchUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

	return response.json();
};

export const fetchGetAvailableCredentials = async ({ page, search }) => {
	let fetchUrl = apiUrl + 'credentials/getAvailable';
	fetchUrl += '?page=' + (page + 1) + '&limit=' + fetchSize;

	if (search.value) fetchUrl += `&filter=${search.filter}&value=${search.value}`;

	// console.log(fetchUrl);

	const response = await fetch(fetchUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

	return response.json();
};

export const fetchGetById = async (collection, id) => {
	let fetchUrl = apiUrl + collection + '/get/' + id;

	const response = await fetch(fetchUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

	return response.json();
};

export const fetchUpdate = async (collection, id, body) => {
	const response = await fetch(apiUrl + collection + '/update/' + id, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

	return response;
};

export const fetchPost = async (collection, body) => {
	const response = await fetch(apiUrl + collection + '/post', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	const resBody = await response.json();
	if (!response.ok) throw new Error(`Error ${response.status}: ${resBody.message}`);

	return resBody;
};

export const fetchDelete = async (collection, id) => {
	const response = await fetch(apiUrl + collection + '/delete/' + id, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

	return response;
};
