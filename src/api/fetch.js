const fetchSize = 30;
const apiUrl = 'https://security-system-api.herokuapp.com/';

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
	}).then((res) => res.json());

	return response;
};
