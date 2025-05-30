// /services/bookingService.js
const Booking = require("../models/Booking");
const Flight = require("../models/Flight");
const crypto = require("crypto");

const generateBookingCode = () =>
	crypto.randomBytes(4).toString("hex").toUpperCase();
const generateBookingRef = (flightCode) => {
	const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
	return `${flightCode}-${suffix}`;
};

// Phí tiện ích theo phương thức thanh toán
const getConvenienceFee = (method) => {
	switch (method) {
		case "bank":
			return 2200;
		case "atm":
			return 23024;
		case "international":
			return 85119;
		case "cod":
		default:
			return 0;
	}
};

const createBooking = async ({
	flightId,
	seatClass,
	passengers,
	contact,
	totalAmount,
	userId,
}) => {
	const flight = await Flight.findById(flightId);
	if (!flight) throw new Error("Không tìm thấy chuyến bay.");

	const selectedClass = flight.seatClasses.find((sc) => sc.name === seatClass);
	if (!selectedClass || selectedClass.availableSeats < passengers.length) {
		throw new Error("Vé đã bán hết.");
	}

	const holdUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 phút giữ chỗ
	const bookingRef = generateBookingRef(flight.flightCode);

	const newBooking = new Booking({
		bookingCode: generateBookingCode(),
		bookingRef,
		flights: [
			{
				flight: flightId,
				seatClass,
				seatPrice: selectedClass.price,
			},
		],
		passengers,
		contact,
		totalAmount,
		status: "pending",
		holdUntil,
		user: userId,
	});

	await newBooking.save();
	return newBooking;
};

const getAllBookings = async () => {
	return Booking.find()
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
};

const getBookingById = async (id) => {
	return Booking.findById(id)
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
		.lean();
};

const payBooking = async ({ bookingId, paymentMethod }) => {
	const booking = await Booking.findById(bookingId).populate({
		path: "flights.flight",
		select: "flightCode from to airline departureTime arrivalTime",
		populate: [
			{ path: "airline", select: "name logo" },
			{ path: "from", select: "name city" },
			{ path: "to", select: "name city" },
		],
	});

	if (!booking) throw new Error("Không tìm thấy đơn đặt vé.");
	if (booking.status === "paid") throw new Error("Đơn đã được thanh toán.");

	const isImmediate = paymentMethod !== "cod";
	if (isImmediate) {
		const flightId = booking.flights[0].flight;
		const seatClassName = booking.flights[0].seatClass;
		const passengersCount = booking.passengers.length;

		await Flight.updateOne(
			{ _id: flightId, "seatClasses.name": seatClassName },
			{ $inc: { "seatClasses.$.availableSeats": -passengersCount } }
		);
	}

	booking.paymentMethod = paymentMethod;
	booking.convenienceFee = getConvenienceFee(paymentMethod);
	booking.status = isImmediate ? "paid" : "pending";
	await booking.save();

	return booking;
};

module.exports = {
	createBooking,
	getAllBookings,
	getBookingById,
	payBooking,
};
