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
	paymentMethod: {
		type: String,
		enum: ["bank", "atm", "international", "cod"], // cod = pay later
		required: true,
	},

	convenienceFee: {
		type: Number,
		required: true,
		default: 0, // được tính tùy vào paymentMethod
	},
	totalAmount: Number,
	status: {
		type: String,
		enum: ["pending", "paid", "cancelled", "expired"],
		default: "pending",
	},
	holdUntil: Date,
	bookingRef: { type: String, unique: true },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
