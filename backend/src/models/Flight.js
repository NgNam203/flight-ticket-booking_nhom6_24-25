const mongoose = require("mongoose");

const seatClassSchema = new mongoose.Schema(
	{
		name: String,
		baggage: {
			checked: String,
			hand: String,
		},
		price: Number,
		totalSeats: Number,
		availableSeats: Number,
	},
	{ _id: false }
); // quan trọng để tránh tạo _id thừa

const flightSchema = new mongoose.Schema({
	flightCode: { type: String, required: true, unique: true },
	airline: { type: mongoose.Schema.Types.ObjectId, ref: "Airline" },
	from: { type: mongoose.Schema.Types.ObjectId, ref: "Airport" },
	to: { type: mongoose.Schema.Types.ObjectId, ref: "Airport" },
	departureTime: Date,
	arrivalTime: Date,
	aircraft: { type: String },
	status: { type: String, default: "scheduled" },
	seatClasses: [seatClassSchema], // dùng schema phụ
	durationMinutes: Number,
});

module.exports = mongoose.model("Flight", flightSchema);
