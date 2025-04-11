// /frontend/src/services/bookingService.js
import axios from "axios";

const API_URL = "http://localhost:3001/api/booking";

// 1. Lấy tất cả booking (cho admin)
export const getAllBookings = async (token) => {
	const res = await axios.get(API_URL, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};

// 2. Tạo đơn đặt vé
export const createBooking = async (data, token) => {
	const res = await axios.post(API_URL, data, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
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
