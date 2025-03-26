// /frontend/src/services/bookingService.js
import axios from "axios";

const API_URL = "http://localhost:3001/api/booking";

// Lấy danh sách tất cả các đơn đặt vé (dành cho admin)
export const getAllBookings = async (token) => {
	const res = await axios.get(API_URL, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
};
