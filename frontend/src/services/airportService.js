import axios from "axios";

const API_URL = `/api/airports`;

export const getAllAirports = async () => {
	const res = await axios.get(API_URL);
	return res.data;
};

export const createAirport = async (data, token) => {
	const res = await axios.post(API_URL, data, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};

export const updateAirport = async (id, data, token) => {
	const res = await axios.put(`${API_URL}/${id}`, data, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};

export const deleteAirport = async (id, token) => {
	const res = await axios.delete(`${API_URL}/${id}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};
