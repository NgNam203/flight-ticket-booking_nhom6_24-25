const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	flights: [
		{
			flight: { type: mongoose.Schema.Types.ObjectId, ref: "Flight" },
			seatClass: String, // VD: "Economy"
		},
	],
	passengers: [
		{
			fullName: String,
			gender: String,
			nationality: String,
			birthDate: Date,
		},
	],
	contact: {
		fullName: String,
		phone: String,
		email: String,
	},
	paymentMethod: String, // chuyển khoản, ATM, quốc tế
	totalAmount: Number,
	status: { type: String, default: "pending" }, // pending | paid | cancelled
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
