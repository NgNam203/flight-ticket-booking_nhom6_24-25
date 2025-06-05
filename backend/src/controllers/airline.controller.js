const airlineService = require("../services/airline.service");

const getAllAirlines = async (req, res) => {
	try {
		const airlines = await airlineService.getAllAirlines();
		res.status(200).json(airlines);
	} catch (err) {
		res.status(500).json({ message: "Lỗi server", error: err.message });
	}
};

const createAirline = async (req, res) => {
	try {
		const { name, code, logo } = req.body;
		const newAirline = await airlineService.createAirline({ name, code, logo });
		res.status(201).json(newAirline);
	} catch (err) {
		res.status(500).json({ message: "Lỗi tạo airline", error: err.message });
	}
};

const updateAirline = async (req, res) => {
	try {
		const updated = await airlineService.updateAirline(req.params.id, req.body);
		res.json(updated);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Lỗi cập nhật airline", error: err.message });
	}
};

const deleteAirline = async (req, res) => {
	try {
		await airlineService.deleteAirline(req.params.id);
		res.json({ message: "Đã xóa thành công" });
	} catch (err) {
		res.status(500).json({ message: "Lỗi xóa airline", error: err.message });
	}
};

module.exports = {
	getAllAirlines,
	createAirline,
	updateAirline,
	deleteAirline,
};
