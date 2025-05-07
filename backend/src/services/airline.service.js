// backend/src/services/airline.service.js

const Airline = require("../models/Airline");

// Lấy tất cả hãng bay
exports.getAllAirlines = async () => {
	return await Airline.find();
};

// Tìm hãng bay theo ID
exports.getAirlineById = async (id) => {
	return await Airline.findById(id);
};

// Tạo mới hãng bay
exports.createAirline = async (data) => {
	const airline = new Airline(data);
	return await airline.save();
};

// Cập nhật hãng bay
exports.updateAirline = async (id, data) => {
	return await Airline.findByIdAndUpdate(id, data, { new: true });
};

// Xóa hãng bay
exports.deleteAirline = async (id) => {
	return await Airline.findByIdAndDelete(id);
};
