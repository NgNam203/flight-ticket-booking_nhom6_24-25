const mongoose = require("mongoose");

const airportSchema = new mongoose.Schema({
	code: { type: String, unique: true }, // VD: HAN, SGN
	name: String, // VD: Sân bay Nội Bài
	city: String, // VD: Hà Nội
	country: String, // VD: Việt Nam
});

module.exports = mongoose.model("Airport", airportSchema);
