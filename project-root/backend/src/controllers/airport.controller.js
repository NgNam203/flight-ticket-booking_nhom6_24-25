const Airport = require("../models/Airport");

const getAllAirports = async (req, res) => {
	try {
		const airports = await Airport.find();
		res.json(airports);
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi lấy danh sách sân bay." });
	}
};

const createAirport = async (req, res) => {
	try {
		const { name, code, city } = req.body;
		if (!name || !code || !city) {
			return res.status(400).json({ message: "Thiếu thông tin sân bay." });
		}
		const newAirport = new Airport({ name, code, city });
		await newAirport.save();
		res.status(201).json(newAirport);
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi tạo sân bay." });
	}
};

const updateAirport = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, code, city } = req.body;
		const updated = await Airport.findByIdAndUpdate(
			id,
			{ name, code, city },
			{ new: true }
		);
		if (!updated)
			return res.status(404).json({ message: "Không tìm thấy sân bay." });
		res.json(updated);
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi cập nhật sân bay." });
	}
};

const deleteAirport = async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await Airport.findByIdAndDelete(id);
		if (!deleted)
			return res.status(404).json({ message: "Không tìm thấy sân bay." });
		res.json({ message: "Đã xoá sân bay." });
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi xoá sân bay." });
	}
};

module.exports = {
	getAllAirports,
	createAirport,
	updateAirport,
	deleteAirport,
};
