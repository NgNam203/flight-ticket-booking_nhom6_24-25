// /src/services/userService.js
import axios from "axios";

const API_URL = "http://localhost:3001/api/user";

// Lấy thông tin cá nhân
export const getProfile = async (token) => {
	const res = await axios.get(`${API_URL}/profile`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
};

// Cập nhật thông tin cá nhân
export const updateProfile = async (data, token) => {
	const res = await axios.put(`${API_URL}/profile`, data, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
};
