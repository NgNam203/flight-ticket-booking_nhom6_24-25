// /backend/src/controllers/booking.controller.js
const Booking = require("../models/Booking");

const getAllBookings = async (req, res) => {
	try {
		const bookings = await Booking.find()
			.populate("user", "fullName email")
			.populate(
				"flights.flight",
				"flightCode airline from to departureTime arrivalTime"
			)
			.sort({ createdAt: -1 });

		res.json(bookings);
	} catch (err) {
		console.error("Lỗi khi lấy danh sách đặt vé:", err);
		res.status(500).json({ message: "Lỗi khi lấy danh sách đặt vé." });
	}
};

module.exports = {
	getAllBookings,
};
