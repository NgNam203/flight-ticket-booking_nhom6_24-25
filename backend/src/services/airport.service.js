// services/airportService.js
const Airport = require("../models/Airport");

const getAllAirports = async () => {
	return await Airport.find();
};

const createAirport = async ({ name, code, city, country }) => {
	if (!name || !code || !city) {
		throw new Error("Thiếu thông tin sân bay.");
	}
	const airport = new Airport({ name, code, city, country });
	return await airport.save();
};

const updateAirport = async (id, { name, code, city, country }) => {
	const updated = await Airport.findByIdAndUpdate(
		id,
		{ name, code, city, country },
		{ new: true }
	);
	if (!updated) throw new Error("Không tìm thấy sân bay.");
	return updated;
};

const deleteAirport = async (id) => {
	const deleted = await Airport.findByIdAndDelete(id);
	if (!deleted) throw new Error("Không tìm thấy sân bay.");
	return deleted;
};

module.exports = {
	getAllAirports,
	createAirport,
	updateAirport,
	deleteAirport,
};
