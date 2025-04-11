const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	bookingCode: { type: String, unique: true },
	flights: [
		{
			flight: { type: mongoose.Schema.Types.ObjectId, ref: "Flight" },
			seatClass: String,
			seatPrice: Number,
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
	paymentMethod: String,
	totalAmount: Number,
	status: { type: String, default: "pending" },
	holdUntil: Date,
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
