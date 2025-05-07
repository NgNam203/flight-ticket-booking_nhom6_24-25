// backend/src/controllers/airport.controller.js

const airportService = require("../services/airport.service");

// [GET] /api/airports
exports.getAllAirports = async (req, res) => {
	try {
		const airports = await airportService.getAllAirports();
		res.json(airports);
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi lấy danh sách sân bay." });
	}
};

// [POST] /api/airports
exports.createAirport = async (req, res) => {
	try {
		const { name, code, city } = req.body;
		if (!name || !code || !city) {
			return res.status(400).json({ message: "Thiếu thông tin sân bay." });
		}
		const newAirport = await airportService.createAirport({
			name,
			code,
			city,
			country,
		});
		res.status(201).json(newAirport);
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi tạo sân bay." });
	}
};

// [PUT] /api/airports/:id
exports.updateAirport = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, code, city } = req.body;
		const updated = await airportService.updateAirport(id, {
			name,
			code,
			city,
			country,
		});
		if (!updated)
			return res.status(404).json({ message: "Không tìm thấy sân bay." });
		res.json(updated);
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi cập nhật sân bay." });
	}
};

// [DELETE] /api/airports/:id
exports.deleteAirport = async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await airportService.deleteAirport(id);
		if (!deleted)
			return res.status(404).json({ message: "Không tìm thấy sân bay." });
		res.json({ message: "Đã xoá sân bay." });
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi xoá sân bay." });
	}
};
