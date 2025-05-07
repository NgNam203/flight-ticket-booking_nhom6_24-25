const mongoose = require("mongoose");

const airportSchema = new mongoose.Schema({
	code: { type: String, required: true, unique: true }, // VD: HAN, SGN
	name: { type: String, required: true }, // VD: Sân bay Nội Bài
	city: { type: String, default: "" }, // VD: Hà Nội
	country: { type: String, default: "" }, // VD: Việt Nam
});

module.exports = mongoose.model("Airport", airportSchema);
