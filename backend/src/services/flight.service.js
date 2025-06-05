const Flight = require("../models/Flight");
const Booking = require("../models/Booking");
const Airport = require("../models/Airport");
const mongoose = require("mongoose");
const Airline = require("../models/Airline");

const getAirportByCode = async (code) => {
	const airport = await Airport.findOne({ code: code.toUpperCase() });
	if (!airport) {
		throw new Error(`Không tìm thấy sân bay với mã ${code}`);
	}
	return airport._id;
};

const createFlight = async (data) => {
	const { departureTime, arrivalTime } = data;

	// Tính durationMinutes
	if (departureTime && arrivalTime) {
		const duration =
			(new Date(arrivalTime) - new Date(departureTime)) / (60 * 1000);
		data.durationMinutes = Math.max(Math.round(duration), 0);
	}

	const newFlight = new Flight(data);
	return await newFlight.save();
};

const getAllFlights = async () => {
	return await Flight.find()
		.populate("from", "name code")
		.populate("to", "name code")
		.populate("airline", "name code logo");
};

const getFlightById = async (id) => {
	return await Flight.findById(id).populate("from to airline");
};

const updateFlight = async (id, data) => {
	// Nếu có cập nhật thời gian → cập nhật lại duration
	if (data.departureTime && data.arrivalTime) {
		const duration =
			(new Date(data.arrivalTime) - new Date(data.departureTime)) / (60 * 1000);
		data.durationMinutes = Math.max(Math.round(duration), 0);
	}

	return await Flight.findByIdAndUpdate(id, data, { new: true });
};

const deleteFlight = async (id) => {
	return await Flight.findByIdAndDelete(id);
};

const searchFlights = async ({ from, to, departureDate, passengers = 1 }) => {
	if (!from || !to || !departureDate) {
		throw new Error("Thiếu thông tin tìm kiếm.");
	}

	const fromId = await getAirportByCode(from);
	const toId = await getAirportByCode(to);

	const departureStart = new Date(departureDate);
	departureStart.setHours(0, 0, 0, 0);
	const departureEnd = new Date(departureStart);
	departureEnd.setHours(23, 59, 59, 999);

	await autoGenerateFlights(fromId, toId, departureDate);

	const flights = await Flight.find({
		from: fromId,
		to: toId,
		departureTime: { $gte: departureStart, $lt: departureEnd },
		"seatClasses.availableSeats": { $gte: passengers },
	})
		.populate("airline")
		.populate("from to");

	return flights;
};

const autoGenerateFlights = async (from, to, date) => {
	const flightDate = new Date(date);
	const airline = await Airline.findOne({ code: "VN" });
	const existing = await Flight.find({
		from,
		to,
		departureTime: {
			$gte: new Date(flightDate.setHours(0, 0, 0, 0)),
			$lte: new Date(flightDate.setHours(23, 59, 59, 999)),
		},
	});

	if (existing.length > 0) return; // đã có thì không tạo thêm

	const newFlights = [];

	for (let i = 0; i < 3; i++) {
		const departure = new Date(date);
		departure.setHours(6 + i * 4); // bay lúc 6h, 10h, 14h

		const arrival = new Date(departure);
		arrival.setHours(arrival.getHours() + 2);

		newFlights.push({
			flightCode: `RT${Math.floor(Math.random() * 10000)}`,
			from,
			to,
			departureTime: departure,
			arrivalTime: arrival,
			status: "scheduled",
			airline: airline._id, // bạn chỉnh ID phù hợp
			aircraft: "Airbus A321",
			seatClasses: [
				/* giống trong seed */
			],
		});
	}

	await Flight.insertMany(newFlights);
};

module.exports = {
	createFlight,
	getAllFlights,
	getFlightById,
	updateFlight,
	deleteFlight,
	searchFlights,
	autoGenerateFlights,
};
