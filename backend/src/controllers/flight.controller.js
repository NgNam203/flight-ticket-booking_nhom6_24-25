const Flight = require("../models/Flight");
const Airport = require("../models/Airport");
const mongoose = require("mongoose");

// [GET] /api/flights
const getAllFlights = async (req, res) => {
	try {
		const flights = await Flight.find()
			.populate("from", "name code")
			.populate("to", "name code")
			.populate("airline", "name code logo");
		res.json(flights);
	} catch (err) {
		// console.error("❌ Lỗi khi lấy chuyến bay:", err);
		res.status(500).json({ message: "Lỗi khi lấy danh sách chuyến bay." });
	}
};

// [POST] /api/flights
const createFlight = async (req, res) => {
	try {
		const newFlight = new Flight(req.body);
		await newFlight.save();
		res
			.status(201)
			.json({ message: "Thêm chuyến bay thành công", flight: newFlight });
	} catch (err) {
		// console.error("❌ Lỗi tạo chuyến bay:", err);
		// console.log("📦 Dữ liệu nhận từ body:", req.body);
		res.status(500).json({ message: "Lỗi khi tạo chuyến bay." });
	}
};

// [GET] /api/flights/:id
const getFlightById = async (req, res) => {
	try {
		const flight = await Flight.findById(req.params.id).populate("from to");
		if (!flight)
			return res.status(404).json({ message: "Không tìm thấy chuyến bay." });
		res.json(flight);
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi lấy thông tin chuyến bay." });
	}
};

// [PUT] /api/flights/:id
const updateFlight = async (req, res) => {
	try {
		const updated = await Flight.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		if (!updated)
			return res.status(404).json({ message: "Chuyến bay không tồn tại." });
		res.json({ message: "Cập nhật thành công", flight: updated });
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi cập nhật." });
	}
};

// [DELETE] /api/flights/:id
const deleteFlight = async (req, res) => {
	try {
		await Flight.findByIdAndDelete(req.params.id);
		res.json({ message: "Xoá chuyến bay thành công." });
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi xoá." });
	}
};

// [GET] /api/flights/search?from=...&to=...&departureDate=...&passengers=...
const searchFlights = async (req, res) => {
	try {
		let { from, to, departureDate, passengers = 1 } = req.query;

		if (!from || !to || !departureDate) {
			return res.status(400).json({ message: "Thiếu thông tin tìm kiếm." });
		}

		const fromId = new mongoose.Types.ObjectId(from);
		const toId = new mongoose.Types.ObjectId(to);

		const departureStart = new Date(departureDate);
		departureStart.setHours(0, 0, 0, 0);

		const departureEnd = new Date(departureStart);
		departureEnd.setHours(23, 59, 59, 999);

		console.log("🔎 Tìm kiếm chuyến bay từ:", fromId, "đến:", toId);
		console.log("📅 Trong khoảng:", departureStart, "→", departureEnd);

		const flights = await Flight.find({
			from: fromId,
			to: toId,
			departureTime: { $gte: departureStart, $lt: departureEnd },
			"seatClasses.availableSeats": { $gte: passengers },
		})
			.populate("airline")
			.populate("from to");

		console.log("✅ Kết quả:", flights.length, "chuyến bay");

		res.json(flights);
	} catch (err) {
		console.error("❌ Lỗi:", err);
		res.status(500).json({ message: "Lỗi khi tìm kiếm chuyến bay." });
	}
};
module.exports = {
	getAllFlights,
	createFlight,
	getFlightById,
	updateFlight,
	deleteFlight,
	searchFlights,
};
