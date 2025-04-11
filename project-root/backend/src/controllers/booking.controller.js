// /backend/src/controllers/booking.controller.js
const Booking = require("../models/Booking");
const Flight = require("../models/Flight");
const crypto = require("crypto");
const { sendBookingConfirmationEmail } = require("../services/emailService");
// Helper tạo bookingCode ngắn
function generateBookingCode() {
	return crypto.randomBytes(4).toString("hex").toUpperCase(); // VD: A3F7C2B1
}
const getAllBookings = async (req, res) => {
	try {
		const bookings = await Booking.find()
			.populate("user", "fullName email")
			.populate({
				path: "flights.flight",
				select: "flightCode airline from to departureTime arrivalTime",
				populate: [
					{ path: "airline", select: "name logo" },
					{ path: "from", select: "name city code" },
					{ path: "to", select: "name city code" },
				],
			})
			.sort({ createdAt: -1 });

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

		// Kiểm tra chuyến bay có tồn tại không
		const flight = await Flight.findById(flightId);
		if (!flight) {
			return res.status(404).json({ message: "Không tìm thấy chuyến bay." });
		}
		const selectedClass = flight.seatClasses.find(
			(sc) => sc.name === seatClass
		);
		if (!selectedClass || selectedClass.availableSeats < passengers.length) {
			return res.status(400).json({ message: "Vé đã bán hết." });
		}
		// Tính thời gian giữ chỗ: giữ trong 10 phút
		const holdUntil = new Date(Date.now() + 10 * 60 * 1000);

		const newBooking = new Booking({
			bookingCode: generateBookingCode(),
			flights: [
				{
					flight: flightId,
					seatClass: seatClass,
					seatPrice: selectedClass.price,
				},
			],
			passengers,
			contact,
			totalAmount,
			status: "pending",
			holdUntil,
			user: req.user?.id,
		});

		await newBooking.save();

		return res.status(201).json({
			message: "Đặt chỗ thành công!",
			bookingId: newBooking._id,
			bookingCode: newBooking.bookingCode,
			holdUntil: newBooking.holdUntil,
		});
	} catch (err) {
		console.error("Lỗi tạo booking:", err);
		return res.status(500).json({ message: "Đã xảy ra lỗi khi tạo booking." });
	}
};

const payBooking = async (req, res) => {
	try {
		const bookingId = req.params.id;
		const { paymentMethod } = req.body;

		if (!paymentMethod) {
			return res
				.status(400)
				.json({ message: "Vui lòng chọn phương thức thanh toán." });
		}

		const booking = await Booking.findById(bookingId).populate({
			path: "flights.flight",
			select: "from to airline departureTime arrivalTime",
			populate: [
				{ path: "airline", select: "name logo" },
				{ path: "from", select: "name city" },
				{ path: "to", select: "name city" },
			],
		});

		if (!booking) {
			return res.status(404).json({ message: "Không tìm thấy đơn đặt vé." });
		}

		if (booking.status === "paid") {
			return res
				.status(400)
				.json({ message: "Đơn đã được thanh toán trước đó." });
		}

		if (paymentMethod !== "Thanh toán sau") {
			const flightId = booking.flights[0].flight;
			const seatClassName = booking.flights[0].seatClass;
			const passengersCount = booking.passengers.length;

			await Flight.updateOne(
				{ _id: flightId, "seatClasses.name": seatClassName },
				{ $inc: { "seatClasses.$.availableSeats": -passengersCount } }
			);
		}

		booking.paymentMethod = paymentMethod;
		booking.status = paymentMethod === "Thanh toán sau" ? "pending" : "paid";
		await booking.save();
		await sendBookingConfirmationEmail(booking.contact.email, booking);

		res.json({ message: "Thanh toán thành công.", bookingId: booking._id });
	} catch (err) {
		console.error("Lỗi khi cập nhật thanh toán:", err);
		res.status(500).json({ message: "Có lỗi khi xử lý thanh toán." });
	}
};

const getBookingById = async (req, res) => {
	try {
		const booking = await Booking.findById(req.params.id)
			.populate("user", "fullName email")
			.populate({
				path: "flights.flight",
				select: "flightCode airline from to departureTime arrivalTime aircraft",
				populate: [
					{ path: "airline", select: "name logo" },
					{ path: "from", select: "name city" },
					{ path: "to", select: "name city" },
				],
			})
			.populate("flights.seatClass") // ✅ THÊM DÒNG NÀY
			.lean();

		if (!booking) {
			return res.status(404).json({ message: "Không tìm thấy đơn đặt vé." });
		}

		res.json(booking);
	} catch (err) {
		console.error("Lỗi khi lấy thông tin booking:", err);
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
