// /frontend/src/services/flightService.js
import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/flights`;

// Lấy danh sách chuyến bay
export const getAllFlights = async (token) => {
	const res = await axios.get(API_URL, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};

// Lấy chi tiết 1 chuyến bay
export const getFlightById = async (id, token) => {
	const res = await axios.get(`${API_URL}/${id}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};

// Tạo chuyến bay mới
export const createFlight = async (data, token) => {
	const res = await axios.post(API_URL, data, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};

// Cập nhật chuyến bay
export const updateFlight = async (id, data, token) => {
	const res = await axios.put(`${API_URL}/${id}`, data, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};

// Xoá chuyến bay
export const deleteFlight = async (id, token) => {
	const res = await axios.delete(`${API_URL}/${id}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};

// Tìm kiếm
export const searchFlights = async ({
	from,
	to,
	departureDate,
	passengers = 1,
}) => {
	try {
		const response = await axios.get(`${API_URL}/search`, {
			params: { from, to, departureDate, passengers },
		});
		return response.data;
	} catch (err) {
		console.error("❌ Lỗi tìm kiếm chuyến bay:", err);
		throw err;
	}
};
