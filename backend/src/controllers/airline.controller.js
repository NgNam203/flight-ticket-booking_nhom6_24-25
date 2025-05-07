// backend/src/controllers/airline.controller.js

const airlineService = require("../services/airline.service");

// [GET] /api/airlines
exports.getAllAirlines = async (req, res) => {
	try {
		const airlines = await airlineService.getAllAirlines();
		res.status(200).json(airlines);
	} catch (err) {
		res.status(500).json({ message: "Lỗi server", error: err.message });
	}
};

// [POST] /api/airlines
exports.createAirline = async (req, res) => {
	try {
		const newAirline = await airlineService.createAirline(req.body);
		res.status(201).json(newAirline);
	} catch (err) {
		res.status(500).json({ message: "Lỗi tạo airline", error: err.message });
	}
};

// [PUT] /api/airlines/:id
exports.updateAirline = async (req, res) => {
	try {
		const { id } = req.params;
		const updated = await airlineService.updateAirline(id, req.body);
		if (!updated)
			return res.status(404).json({ message: "Không tìm thấy airline" });
		res.json(updated);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Lỗi cập nhật airline", error: err.message });
	}
};

// [DELETE] /api/airlines/:id
exports.deleteAirline = async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await airlineService.deleteAirline(id);
		if (!deleted)
			return res.status(404).json({ message: "Không tìm thấy airline" });
		res.json({ message: "Đã xóa thành công" });
	} catch (err) {
		res.status(500).json({ message: "Lỗi xóa airline", error: err.message });
	}
};
