// /frontend/src/services/authService.js
import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/auth`;

export const registerUser = async (data) => {
	const res = await axios.post(`${API_URL}/register`, data);
	return res.data;
};

export const verifyEmail = async (token, email) => {
	const res = await axios.get(
		`${API_URL}/verify-email?token=${token}&email=${email}`
	);
	return res.data;
};

export const loginUser = async (data) => {
	const res = await axios.post(`${API_URL}/login`, data);
	return res.data.data;
};
