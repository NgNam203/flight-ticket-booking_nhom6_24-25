// services/flightService.js
const Flight = require("../models/Flight");
const mongoose = require("mongoose");

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

	const fromId = new mongoose.Types.ObjectId(from);
	const toId = new mongoose.Types.ObjectId(to);

	const departureStart = new Date(departureDate);
	departureStart.setHours(0, 0, 0, 0);
	const departureEnd = new Date(departureStart);
	departureEnd.setHours(23, 59, 59, 999);

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

module.exports = {
	createFlight,
	getAllFlights,
	getFlightById,
	updateFlight,
	deleteFlight,
	searchFlights,
};
