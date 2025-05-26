const bookingService = require("../services/bookingService");
const { sendBookingConfirmationEmail } = require("../services/emailService");

const getAllBookings = async (req, res) => {
	try {
		const bookings = await bookingService.getAllBookings();
		res.json(bookings);
	} catch (err) {
		console.error("Lỗi khi lấy danh sách đặt vé:", err);
		res.status(500).json({ message: "Lỗi khi lấy danh sách đặt vé." });
	}
};

const createBooking = async (req, res) => {
	try {
		const { flightId, seatClass, passengers, contact, totalAmount } = req.body;
		if (
			!flightId ||
			!seatClass ||
			!passengers?.length ||
			!contact ||
			!totalAmount
		) {
			return res.status(400).json({ message: "Thiếu thông tin đặt vé." });
		}

		const newBooking = await bookingService.createBooking({
			flightId,
			seatClass,
			passengers,
			contact,
			totalAmount,
			userId: req.user?.id,
		});

		res.status(201).json({
			message: "Đặt chỗ thành công!",
			bookingId: newBooking._id,
			bookingCode: newBooking.bookingCode,
			bookingRef: newBooking.bookingRef,
			holdUntil: newBooking.holdUntil,
		});
	} catch (err) {
		console.error("Lỗi tạo booking:", err);
		res
			.status(500)
			.json({ message: err.message || "Đã xảy ra lỗi khi tạo booking." });
	}
};

const payBooking = async (req, res) => {
	try {
		const { paymentMethod } = req.body;
		const bookingId = req.params.id;

		if (!paymentMethod) {
			return res
				.status(400)
				.json({ message: "Vui lòng chọn phương thức thanh toán." });
		}

		const booking = await bookingService.payBooking({
			bookingId,
			paymentMethod,
		});

		await sendBookingConfirmationEmail(booking.contact.email, booking);

		res.json({ message: "Thanh toán thành công.", bookingId: booking._id });
	} catch (err) {
		console.error("Lỗi thanh toán:", err);
		res
			.status(400)
			.json({ message: err.message || "Có lỗi khi xử lý thanh toán." });
	}
};

const getBookingById = async (req, res) => {
	try {
		const booking = await bookingService.getBookingById(req.params.id);
		if (!booking)
			return res.status(404).json({ message: "Không tìm thấy đơn đặt vé." });
		res.json(booking);
	} catch (err) {
		console.error("Lỗi lấy thông tin booking:", err);
		res
			.status(500)
			.json({ message: "Đã xảy ra lỗi khi lấy thông tin đặt vé." });
	}
};

module.exports = {
	getAllBookings,
	createBooking,
	payBooking,
	getBookingById,
};
