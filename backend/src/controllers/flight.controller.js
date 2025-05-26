const flightService = require("../services/flightService");

const getAllFlights = async (req, res) => {
	try {
		const flights = await flightService.getAllFlights();
		res.json(flights);
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi lấy danh sách chuyến bay." });
	}
};

const createFlight = async (req, res) => {
	try {
		const flight = await flightService.createFlight(req.body);
		res.status(201).json({ message: "Thêm chuyến bay thành công", flight });
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi tạo chuyến bay." });
	}
};

const getFlightById = async (req, res) => {
	try {
		const flight = await flightService.getFlightById(req.params.id);
		if (!flight)
			return res.status(404).json({ message: "Không tìm thấy chuyến bay." });
		res.json(flight);
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi lấy thông tin chuyến bay." });
	}
};

const updateFlight = async (req, res) => {
	try {
		const updated = await flightService.updateFlight(req.params.id, req.body);
		if (!updated)
			return res.status(404).json({ message: "Chuyến bay không tồn tại." });
		res.json({ message: "Cập nhật thành công", flight: updated });
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi cập nhật." });
	}
};

const deleteFlight = async (req, res) => {
	try {
		await flightService.deleteFlight(req.params.id);
		res.json({ message: "Xoá chuyến bay thành công." });
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi xoá." });
	}
};

const searchFlights = async (req, res) => {
	try {
		const flights = await flightService.searchFlights(req.query);
		res.json(flights);
	} catch (err) {
		res
			.status(400)
			.json({ message: err.message || "Lỗi khi tìm kiếm chuyến bay." });
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
