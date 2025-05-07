// backend/src/controllers/flight.controller.js

const flightService = require("../services/flight.service");

// Controller search flight
exports.searchFlights = async (req, res) => {
	try {
		const { origin, destination, departure_at } = req.query;

		if (!origin || !destination || !departure_at) {
			return res.status(400).json({ message: "Thiếu thông tin tìm kiếm." });
		}

		const rawFlights = await flightService.fetchFlightsFromAPI({
			origin,
			destination,
			departure_at,
		});
		const enrichedFlights = await flightService.enrichFlights(rawFlights);

		res.json(enrichedFlights);
	} catch (err) {
		console.error(
			"❌ Lỗi khi tìm kiếm chuyến bay:",
			err.response?.data || err.message
		);
		res.status(500).json({
			message: "Lỗi khi tìm kiếm chuyến bay.",
			error: err.response?.data || err.message,
		});
	}
};
