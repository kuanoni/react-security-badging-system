const fetchSize = 30;
const apiUrl = 'https://63445b7f242c1f347f84bcb2.mockapi.io/cardholders';

export const fetchCardholders = async (page, filterUrlText, cb) => {
	let fetchUrl = apiUrl;

	if (filterUrlText) fetchUrl += filterUrlText;
	else fetchUrl += '?page=' + (page + 1) + '&limit=' + fetchSize;

	const fetchedCardholders = await fetch(fetchUrl).then((res) => res.json());

	if (fetchedCardholders) return fetchedCardholders;
};

export const fetchCardholder = async (id) => {
	let fetchUrl = apiUrl + '/' + id;

	const fetchedCardholder = await fetch(fetchUrl).then((res) => res.json());

	if (fetchedCardholder) {
		return fetchedCardholder;
	}
};

export const updateCardholder = async (id, newCardholder) => {
	const response = await fetch(apiUrl + '/' + id, {
		method: 'PUT',
		body: newCardholder,
	});
	// .then((res) => res.json())
	// .then((data) => console.log(data));

	return response;
};
