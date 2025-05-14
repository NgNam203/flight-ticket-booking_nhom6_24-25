// backend/src/controllers/flight.controller.js

const flightService = require("../services/flight.service");

// Controller search flight
exports.searchFlights = async (req, res) => {
	try {
		const { origin, destination, departure_at, return_at, adults } = req.query;

		if (!origin || !destination || !departure_at) {
			return res.status(400).json({ message: "Thiếu thông tin tìm kiếm." });
		}

		// Xử lý tìm kiếm khứ hồi nếu có return_at
		const [departFlights, returnFlights] = await Promise.all([
			flightService.fetchFlightsFromAPI({
				origin,
				destination,
				departure_at,
				adults,
			}),
			return_at
				? flightService.fetchFlightsFromAPI({
						origin: destination,
						destination: origin,
						departure_at: return_at,
						adults,
				  })
				: Promise.resolve([]),
		]);

		const enrichedDepart = await flightService.enrichFlights(departFlights);
		const enrichedReturn = await flightService.enrichFlights(returnFlights);

		return res.json({
			depart: enrichedDepart,
			return: enrichedReturn,
		});
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
