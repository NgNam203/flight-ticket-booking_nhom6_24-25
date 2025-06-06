// /src/services/userService.js
import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/profile`;

// Lấy thông tin cá nhân
export const getProfile = async (token) => {
	const res = await axios.get(`${API_URL}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
};

// Cập nhật thông tin cá nhân
export const updateProfile = async (data, token) => {
	const res = await axios.put(`${API_URL}`, data, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
};
