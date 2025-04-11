import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/user`;

// Lấy danh sách tất cả người dùng
export const getAllUsers = async (token) => {
	const res = await axios.get(API_URL, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
};

// Lấy chi tiết người dùng theo ID
export const getUserById = async (id, token) => {
	const res = await axios.get(`${API_URL}/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
};

// Cập nhật người dùng theo ID
export const updateUser = async (id, data, token) => {
	const res = await axios.put(`${API_URL}/${id}`, data, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
};

// Xóa người dùng theo ID
export const deleteUser = async (id, token) => {
	const res = await axios.delete(`${API_URL}/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
};
