import axios from "axios";

const API_URL = "http://localhost:3001/api/airports";

export const getAllAirports = async () => {
	const res = await axios.get(API_URL);
	return res.data;
};
