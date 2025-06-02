const bookingService = require("../services/bookingService");
const { sendBookingConfirmationEmail } = require("../services/emailService");
const { successResponse, errorResponse } = require("../utils/response");

const getAllBookings = async (req, res) => {
	try {
		const bookings = await bookingService.getAllBookings();
		return successResponse(res, "Lấy danh sách đặt vé thành công", bookings);
	} catch (err) {
		console.error("getAllBookings error:", err);
		return errorResponse(res, 500, "Lỗi khi lấy danh sách đặt vé.");
	}
};

const createBooking = async (req, res) => {
	try {
		const {
			flightId,
			seatClass,
			passengers,
			contact,
			totalAmount,
			paymentMethod,
		} = req.body;

		const newBooking = await bookingService.createBooking({
			flightId,
			seatClass,
			passengers,
			contact,
			totalAmount,
			userId: req.user?.id,
			paymentMethod,
		});

		return successResponse(
			res,
			"Đặt chỗ thành công!",
			{
				bookingId: newBooking._id,
				bookingCode: newBooking.bookingCode,
				bookingRef: newBooking.bookingRef,
				holdUntil: newBooking.holdUntil,
			},
			201
		);
	} catch (err) {
		console.error("createBooking error:", err);
		return errorResponse(
			res,
			500,
			err.message || "Đã xảy ra lỗi khi tạo booking."
		);
	}
};

const payBooking = async (req, res) => {
	try {
		console.log("🔧 BODY:", req.body);
		console.log("🔧 PARAMS:", req.params);
		const { paymentMethod } = req.body;
		const bookingId = req.params.id;

		if (!paymentMethod) {
			return errorResponse(res, 400, "Vui lòng chọn phương thức thanh toán.");
		}

		const booking = await bookingService.payBooking({
			bookingId,
			paymentMethod,
		});

		await sendBookingConfirmationEmail(booking.contact.email, booking);

		return successResponse(res, "Thanh toán thành công", {
			bookingId: booking._id,
		});
	} catch (err) {
		console.error("payBooking error:", err);
		return errorResponse(
			res,
			400,
			err.message || "Có lỗi khi xử lý thanh toán."
		);
	}
};

const getBookingById = async (req, res) => {
	try {
		const booking = await bookingService.getBookingById(req.params.id);
		if (!booking) {
			return errorResponse(res, 404, "Không tìm thấy đơn đặt vé.");
		}
		return successResponse(res, "Lấy thông tin đặt vé thành công", booking);
	} catch (err) {
		console.error("getBookingById error:", err);
		return errorResponse(res, 500, "Đã xảy ra lỗi khi lấy thông tin đặt vé.");
	}
};

module.exports = {
	getAllBookings,
	createBooking,
	payBooking,
	getBookingById,
};
