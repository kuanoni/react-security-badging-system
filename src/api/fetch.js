const fetchSize = 30;
const apiUrl = 'https://63445b7f242c1f347f84bcb2.mockapi.io/';

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
	// .then((res) => res.json())
	// .then((data) => console.log(data));

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
