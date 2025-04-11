const mongoose = require("mongoose");

const airlineSchema = new mongoose.Schema({
	name: { type: String, required: true },
	code: { type: String }, // ví dụ: VJ, VN, QH
	logo: { type: String }, // URL ảnh logo (tuỳ bạn)
});

module.exports = mongoose.model("Airline", airlineSchema);
