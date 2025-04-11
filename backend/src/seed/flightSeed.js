import mongoose from "mongoose";
import dotenv from "dotenv";
import Flight from "../models/Flight.js";

dotenv.config();

const airlines = [
	"67eb5e027edff7ac2f80eac9",
	"67eb5e027edff7ac2f80eaca",
	"67eb5e027edff7ac2f80eacb",
];

const airports = [
	"67e35e7a800221e3293e048f",
	"67e35f70800221e3293e0490",
	"67e35f88800221e3293e0491",
];

const aircraftTypes = ["Airbus A321", "Boeing 787", "Airbus A350"];

const generateRandomFlight = (i) => {
	const airline = airlines[Math.floor(Math.random() * airlines.length)];
	let airlineCode = "XX";
	switch (airline) {
		case "67eb5e027edff7ac2f80eac9":
			airlineCode = "VN";
			break;
		case "67eb5e027edff7ac2f80eaca":
			airlineCode = "VJ";
			break;
		case "67eb5e027edff7ac2f80eacb":
			airlineCode = "QH";
			break;
	}

	let from, to;
	do {
		from = airports[Math.floor(Math.random() * airports.length)];
		to = airports[Math.floor(Math.random() * airports.length)];
	} while (from === to);

	const departure = new Date();
	departure.setDate(departure.getDate() + Math.floor(Math.random() * 7));
	departure.setHours(6 + Math.floor(Math.random() * 12));
	departure.setMinutes(0);

	const arrival = new Date(departure);
	arrival.setHours(arrival.getHours() + 1 + Math.floor(Math.random() * 2));

	return {
		flightCode: `${airlineCode}${1000 + i}`,
		airline,
		from,
		to,
		departureTime: departure,
		arrivalTime: arrival,
		status: "scheduled",
		aircraft: aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)],
		seatClasses: [
			{
				name: "Economy",
				baggage: { checked: "Không bao gồm", hand: "1 kiện 07 kg" },
				price: 1900000 + Math.floor(Math.random() * 500000),
				totalSeats: 180,
				availableSeats: 180,
			},
			{
				name: "Deluxe",
				baggage: { checked: "1 kiện 20 kg", hand: "1 kiện 07 kg" },
				price: 2600000 + Math.floor(Math.random() * 600000),
				totalSeats: 30,
				availableSeats: 30,
			},
		],
	};
};

const seedFlights = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		await Flight.deleteMany();
		const flights = [];

		for (let i = 0; i < 60; i++) {
			flights.push(generateRandomFlight(i));
		}

		await Flight.insertMany(flights);
		console.log("✅ Đã seed 60 chuyến bay thành công!");
		process.exit();
	} catch (err) {
		console.error("❌ Lỗi seed:", err);
		process.exit(1);
	}
};

seedFlights();
