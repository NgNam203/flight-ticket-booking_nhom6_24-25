const Airport = require("../models/Airport");

const getAllAirports = async (req, res) => {
	try {
		const airports = await Airport.find();
		res.json(airports);
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi lấy danh sách sân bay." });
	}
};

module.exports = {
	getAllAirports,
};
