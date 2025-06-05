import axios from "axios";

const API_URL = `/api/airlines`;

export const getAllAirlines = async () => {
	const res = await axios.get(API_URL);
	return res.data;
};

export const updateAirline = async (id, data, token) => {
	const res = await axios.put(`${API_URL}/${id}`, data, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};

export const deleteAirline = async (id, token) => {
	const res = await axios.delete(`${API_URL}/${id}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};

export const createAirline = async (data, token) => {
	const res = await axios.post(API_URL, data, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};
