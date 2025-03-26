const Flight = require("../models/Flight");
const Airport = require("../models/Airport");
// [GET] /api/flights
const getAllFlights = async (req, res) => {
	try {
		const flights = await Flight.find().populate("from to");
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

module.exports = {
	getAllFlights,
	createFlight,
	getFlightById,
	updateFlight,
	deleteFlight,
};
