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
	airline: String,
	from: { type: mongoose.Schema.Types.ObjectId, ref: "Airport" },
	to: { type: mongoose.Schema.Types.ObjectId, ref: "Airport" },
	departureTime: Date,
	arrivalTime: Date,
	status: { type: String, default: "scheduled" },
	seatClasses: [seatClassSchema], // dùng schema phụ
});

module.exports = mongoose.model("Flight", flightSchema);
