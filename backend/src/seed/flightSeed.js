const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Flight = require("../models/Flight.js");

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

	// Tạo ngày bay trong 30 ngày tới
	const daysToAdd = Math.floor(Math.random() * 14);
	const departure = new Date();
	departure.setDate(departure.getDate() + daysToAdd);

	// Giờ bay từ 6h sáng đến 20h tối (14 tiếng)
	const hour = 6 + Math.floor(Math.random() * 14);
	departure.setHours(hour);
	departure.setMinutes(Math.random() > 0.5 ? 0 : 30); // 0 hoặc 30 phút

	const arrival = new Date(departure);
	// Thời gian bay từ 1-4 tiếng tùy loại máy bay
	const flightDuration = 1 + Math.floor(Math.random() * 4);
	arrival.setHours(arrival.getHours() + flightDuration);

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

		for (let i = 0; i < 150; i++) {
			flights.push(generateRandomFlight(i));
		}

		await Flight.insertMany(flights);
		console.log("✅ Đã seed 100 chuyến bay trong 1 tháng tới thành công!");
		process.exit();
	} catch (err) {
		console.error("❌ Lỗi seed:", err);
		process.exit(1);
	}
};

seedFlights();
