// backend/src/services/airport.service.js

const Airport = require("../models/Airport");

// Lấy danh sách sân bay
exports.getAllAirports = async () => {
	return await Airport.find();
};

// Tìm sân bay theo ID
exports.getAirportById = async (id) => {
	return await Airport.findById(id);
};

// Tạo sân bay mới
exports.createAirport = async (data) => {
	const newAirport = new Airport(data);
	return await newAirport.save();
};

// Cập nhật sân bay
exports.updateAirport = async (id, data) => {
	return await Airport.findByIdAndUpdate(id, data, { new: true });
};

// Xóa sân bay
exports.deleteAirport = async (id) => {
	return await Airport.findByIdAndDelete(id);
};
