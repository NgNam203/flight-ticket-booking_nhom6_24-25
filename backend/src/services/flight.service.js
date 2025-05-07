// backend/src/services/flight.service.js

const axios = require("axios");
const qs = require("qs");
const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;
const AMADEUS_API_URL = process.env.AMADEUS_API_URL;
const Airline = require("../models/Airline");
const Airport = require("../models/Airport");

// Hàm lấy access token từ Amadeus
async function getAmadeusAccessToken() {
	try {
		const response = await axios.post(
			`${AMADEUS_API_URL}/v1/security/oauth2/token`,
			qs.stringify({
				grant_type: "client_credentials",
				client_id: AMADEUS_CLIENT_ID,
				client_secret: AMADEUS_CLIENT_SECRET,
			}),
			{
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
			}
		);
		return response.data.access_token;
	} catch (error) {
		console.error(
			"❌ Lỗi lấy AccessToken:",
			error.response?.data || error.message
		);
		throw new Error("Không thể lấy AccessToken từ Amadeus.");
	}
}

// Hàm gọi API Amadeus search flight
exports.fetchFlightsFromAPI = async ({ origin, destination, departure_at }) => {
	try {
		const accessToken = await getAmadeusAccessToken();

		const response = await axios.get(
			`${AMADEUS_API_URL}/v2/shopping/flight-offers`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				params: {
					originLocationCode: origin,
					destinationLocationCode: destination,
					departureDate: departure_at,
					adults: 1, // mặc định tìm vé cho 1 người lớn
					currencyCode: "VND",
					max: 10, // lấy tối đa 10 chuyến bay
				},
			}
		);
		return response.data.data;
	} catch (error) {
		console.error(
			"❌ Lỗi tìm kiếm chuyến bay:",
			error.response?.data || error.message
		);
		throw error;
	}
};

exports.enrichFlights = async (flights) => {
	const airlines = await Airline.find().lean();
	const airports = await Airport.find().lean();

	return flights.map((flight) => {
		const segment = flight.itineraries[0].segments[0];
		const carrierCode = segment.carrierCode;
		const originCode = segment.departure.iataCode;
		const destinationCode = segment.arrival.iataCode;

		const airline = airlines.find((a) => a.code === carrierCode);
		const originAirport = airports.find((a) => a.code === originCode);
		const destinationAirport = airports.find((a) => a.code === destinationCode);

		return {
			...flight,
			airlineInfo: airline || { name: carrierCode, logo: null },
			originInfo: originAirport || { name: originCode },
			destinationInfo: destinationAirport || { name: destinationCode },
		};
	});
};
