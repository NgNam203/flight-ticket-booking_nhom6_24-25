// /frontend/src/services/bookingService.js
import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/booking`;

// 1. Lấy tất cả booking (cho admin)
export const getAllBookings = async (token) => {
	const res = await axios.get(API_URL, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};

// 2. Tạo đơn đặt vé
export const createBooking = async (data, token) => {
	try {
		const res = await axios.post(API_URL, data, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return res.data;
	} catch (err) {
		console.error("createBooking error:", err.response?.data || err.message);
		throw err;
	}
};

// 3. Cập nhật thanh toán
export const payBooking = async (bookingId, paymentMethod, token) => {
	const res = await axios.put(
		`${API_URL}/${bookingId}`,
		{ paymentMethod },
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);
	return res.data;
};

// 4. Lấy thông tin booking theo ID
export const getBookingById = async (bookingId, token) => {
	const res = await axios.get(`${API_URL}/${bookingId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};

export const getUserBookings = async (token) => {
	const res = await axios.get(`${API_URL}/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data.data;
};
