// backend/src/services/booking.service.js

const Booking = require("../models/Booking");

// Tạo mới đơn đặt vé
exports.createBooking = async (data) => {
	const newBooking = new Booking(data);
	return await newBooking.save();
};

// Lấy danh sách đơn đặt vé
exports.getAllBookings = async () => {
	return await Booking.find()
		.populate("user", "fullName email")
		.sort({ createdAt: -1 });
};

// Lấy đơn đặt vé theo ID
exports.getBookingById = async (id) => {
	return await Booking.findById(id).populate("user", "fullName email");
};

// Cập nhật trạng thái thanh toán
exports.updateBookingPayment = async (id, paymentMethod) => {
	const booking = await Booking.findById(id);
	if (!booking) throw new Error("Không tìm thấy booking.");

	booking.paymentMethod = paymentMethod;
	booking.status = paymentMethod === "Thanh toán sau" ? "pending" : "paid";

	return await booking.save();
};

// Huỷ đơn đặt vé
exports.cancelBooking = async (id) => {
	const booking = await Booking.findById(id);
	if (!booking) throw new Error("Không tìm thấy booking.");

	if (booking.status === "cancelled") throw new Error("Đơn đã huỷ trước đó.");

	// Lấy giờ bay của chuyến đầu tiên
	const flight = booking.flights[0];
	if (!flight) throw new Error("Thông tin chuyến bay không hợp lệ.");

	const departureTime = new Date(flight.departureDateTime);
	const now = new Date();
	const diffHours = (departureTime - now) / (1000 * 60 * 60); // chuyển ms thành giờ

	if (diffHours < 6) {
		throw new Error(
			"Không thể huỷ đơn vì chuyến bay sẽ khởi hành trong vòng 6 giờ tới."
		);
	}

	booking.status = "cancelled";
	await booking.save();

	return booking;
};
