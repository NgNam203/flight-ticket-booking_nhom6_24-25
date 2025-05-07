// backend/src/controllers/booking.controller.js

const bookingService = require("../services/booking.service");
const { sendBookingConfirmationEmail } = require("../services/emailService");
const crypto = require("crypto");

// Helper tạo mã đặt vé ngắn
function generateBookingCode() {
	return crypto.randomBytes(4).toString("hex").toUpperCase(); // Ví dụ: A1B2C3D4
}

// [POST] /api/bookings
exports.createBooking = async (req, res) => {
	try {
		const { flights, passengers, contact, totalAmount } = req.body;

		if (!flights || !passengers?.length || !contact || !totalAmount) {
			return res.status(400).json({ message: "Thiếu thông tin đặt vé." });
		}

		const holdUntil = new Date(Date.now() + 10 * 60 * 1000); // Giữ 10 phút

		const bookingData = {
			bookingCode: generateBookingCode(),
			flights, // giờ lưu nguyên flights từ API ngoài
			passengers,
			contact,
			totalAmount,
			status: "pending",
			holdUntil,
			user: req.user?.id,
		};

		const newBooking = await bookingService.createBooking(bookingData);

		return res.status(201).json({
			message: "Đặt vé thành công!",
			bookingId: newBooking._id,
			bookingCode: newBooking.bookingCode,
			holdUntil: newBooking.holdUntil,
		});
	} catch (err) {
		console.error("Lỗi khi đặt vé:", err.message);
		res.status(500).json({ message: "Đặt vé thất bại." });
	}
};

// [POST] /api/bookings/:id/pay
exports.payBooking = async (req, res) => {
	try {
		const bookingId = req.params.id;
		const { paymentMethod } = req.body;

		if (!paymentMethod) {
			return res.status(400).json({ message: "Thiếu phương thức thanh toán." });
		}

		const updatedBooking = await bookingService.updateBookingPayment(
			bookingId,
			paymentMethod
		);

		await sendBookingConfirmationEmail(
			updatedBooking.contact.email,
			updatedBooking
		);

		res.json({
			message: "Thanh toán thành công.",
			bookingId: updatedBooking._id,
		});
	} catch (err) {
		console.error("Lỗi khi thanh toán:", err.message);
		res.status(500).json({ message: "Thanh toán thất bại." });
	}
};

// [GET] /api/bookings
exports.getAllBookings = async (req, res) => {
	try {
		const bookings = await bookingService.getAllBookings();
		res.json(bookings);
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi lấy danh sách booking." });
	}
};

// [GET] /api/bookings/:id
exports.getBookingById = async (req, res) => {
	try {
		const booking = await bookingService.getBookingById(req.params.id);
		if (!booking)
			return res.status(404).json({ message: "Không tìm thấy booking." });
		res.json(booking);
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi lấy booking." });
	}
};

// [PUT] /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
	try {
		const booking = await bookingService.cancelBooking(req.params.id);
		res.json({
			message: "Đã huỷ đơn đặt vé thành công.",
			bookingId: booking._id,
			status: booking.status,
		});
	} catch (err) {
		console.error("Cancel booking error:", err.message);
		res.status(400).json({ message: err.message });
	}
};
