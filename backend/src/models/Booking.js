const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	bookingCode: { type: String, unique: true },
	flights: [
		{
			origin: String, // SGN
			destination: String, // HAN
			departureDateTime: Date, // 2025-05-10T13:20:00
			arrivalDateTime: Date, // 2025-05-10T15:25:00
			tripClass: String, // "ECONOMY", "BUSINESS"
			carrierCode: String, // VJ
			flightNumber: String, // 140
			aircraftCode: String, // 320
			durationMinutes: Number, // 125 phút
			priceBase: Number, // 1546000
			priceTotal: Number, // 1789000
			currency: String, // VND
			baggage: {
				checked: { weight: Number, unit: String }, // 20 KG
				cabin: { weight: Number, unit: String }, // 7 KG
			},
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
