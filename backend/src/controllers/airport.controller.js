const airportService = require("../services/airportService");

const getAllAirports = async (req, res) => {
	try {
		const airports = await airportService.getAllAirports();
		res.status(200).json(airports);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Lỗi khi lấy danh sách sân bay.", error: err.message });
	}
};

const createAirport = async (req, res) => {
	try {
		const airport = await airportService.createAirport(req.body);
		res.status(201).json(airport);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Lỗi khi tạo sân bay.", error: err.message });
	}
};

const updateAirport = async (req, res) => {
	try {
		const updated = await airportService.updateAirport(req.params.id, req.body);
		res.json(updated);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Lỗi khi cập nhật sân bay.", error: err.message });
	}
};

const deleteAirport = async (req, res) => {
	try {
		await airportService.deleteAirport(req.params.id);
		res.json({ message: "Đã xoá sân bay." });
	} catch (err) {
		res
			.status(500)
			.json({ message: "Lỗi khi xoá sân bay.", error: err.message });
	}
};

module.exports = {
	getAllAirports,
	createAirport,
	updateAirport,
	deleteAirport,
};
