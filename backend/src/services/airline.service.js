const Airline = require("../models/Airline");

// Lấy tất cả airlines
const getAllAirlines = async () => {
	return await Airline.find();
};

// Tạo một airline mới
const createAirline = async (data) => {
	const newAirline = new Airline(data);
	return await newAirline.save();
};

// Cập nhật một airline theo ID
const updateAirline = async (id, data) => {
	return await Airline.findByIdAndUpdate(id, data, { new: true });
};

// Xoá một airline theo ID
const deleteAirline = async (id) => {
	return await Airline.findByIdAndDelete(id);
};

module.exports = {
	getAllAirlines,
	createAirline,
	updateAirline,
	deleteAirline,
};
