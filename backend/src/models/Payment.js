const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
	booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
	method: String,
	status: String, // pending, success, failed
	amount: Number,
	paidAt: Date,
});

module.exports = mongoose.model("Payment", paymentSchema);
