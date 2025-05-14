// backend/src/services/flight.service.js

const axios = require("axios");
const qs = require("qs");
const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;
const AMADEUS_API_URL = process.env.AMADEUS_API_URL;
const Airline = require("../models/Airline");
const Airport = require("../models/Airport");
const flightSeatCache = new Map(); // Cache
const { parseISODuration, formatMinutesToText } = require("../utils/timeUtils");
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
exports.fetchFlightsFromAPI = async ({
	origin,
	destination,
	departure_at,
	adults = 1,
}) => {
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
					adults: adults, // mặc định tìm vé cho 1 người lớn
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
	const aircraftMap = {
		320: "Airbus A320",
		321: "Airbus A321",
		319: "Airbus A319",
		330: "Airbus A330",
		738: "Boeing 737-800",
		739: "Boeing 737-900",
		777: "Boeing 777",
		787: "Boeing 787 Dreamliner",
		ATR: "ATR 72",
		E90: "Embraer 190",
		CR9: "CRJ-900",
		"32S": "Airbus A320 (Sharklet)",
	};

	return flights.map((flight) => {
		const segments = flight.itineraries[0].segments || [];
		const carrierCode = segments[0]?.carrierCode;
		const originCode = segments[0]?.departure?.iataCode;
		const destinationCode = segments[segments.length - 1]?.arrival?.iataCode;

		const airline = airlines.find((a) => a.code === carrierCode);
		const originAirport = airports.find((a) => a.code === originCode) || {
			code: originCode,
			name: originCode,
		};
		const destinationAirport = airports.find(
			(a) => a.code === destinationCode
		) || { code: destinationCode, name: destinationCode };
		const aircraftCodes = segments.map((s) => s.aircraft?.code).filter(Boolean);
		const aircraftNames = aircraftCodes.map(
			(code) => aircraftMap[code] || code
		);

		// Stop type
		const segmentCount = segments.length;
		let stopType = "unknown";
		if (segmentCount === 1) stopType = "direct";
		else if (segmentCount === 2) stopType = "one-stop";
		else if (segmentCount > 2) stopType = "multi-stop";

		// Transit info
		let transitDuration = 0;
		let transitInfo = null;
		const isoDuration = flight.itineraries?.[0]?.duration || "PT0M";
		const totalFlightMinutes = parseISODuration(isoDuration);
		const formattedDuration = formatMinutesToText(totalFlightMinutes);

		if (segments.length >= 2) {
			const arrivalAtFirst = new Date(segments[0].arrival.at);
			const departureAtSecond = new Date(segments[1].departure.at);
			const diffMs = departureAtSecond - arrivalAtFirst;
			if (diffMs > 0) {
				const diffMinutes = Math.floor(diffMs / 60000);
				transitDuration = diffMinutes;
			}
			const transitAirportCode = segments[0].arrival.iataCode;
			const transitAirport = airports.find(
				(a) => a.code === transitAirportCode
			);
			transitInfo = transitAirport || {
				code: transitAirportCode,
				name: transitAirportCode,
			};
		}

		// Giá và hành lý từ Amadeus travelerPricings
		const traveler = flight.travelerPricings?.[0];
		const travelerPrice = Number(
			traveler?.price?.total || flight.price?.total || 1000000
		);

		const fareDetails = traveler?.fareDetailsBySegment?.[0];
		const checkedBags = fareDetails?.includedCheckedBags;
		const cabinBags = fareDetails?.includedCabinBags;

		const baggageText = {
			hand: cabinBags?.weight
				? `1 kiện ${cabinBags.weight}${cabinBags.weightUnit || "KG"}`
				: "1 kiện 7kg",
			checked: checkedBags?.weight
				? `1 kiện ${checkedBags.weight}${checkedBags.weightUnit || "KG"}`
				: "1 kiện 20kg",
		};

		const seatClasses = [
			{
				name: "Economy",
				price: travelerPrice,
				baggage: baggageText,
				availableSeats: Math.floor(Math.random() * 5) + 5,
			},
			{
				name: "Business",
				price: Math.round(travelerPrice * 1.25),
				baggage: {
					hand: "1 kiện 10kg",
					checked: "1 kiện 30kg",
				},
				availableSeats: Math.floor(Math.random() * 3) + 3,
			},
			{
				name: "First Class",
				price: Math.round(travelerPrice * 1.5),
				baggage: {
					hand: "2 kiện 7kg",
					checked: "2 kiện 23kg",
				},
				availableSeats: Math.floor(Math.random() * 2) + 2,
			},
		];

		return {
			...flight,
			airlineInfo: airline || { name: carrierCode, logo: null },
			originInfo: originAirport,
			destinationInfo: destinationAirport,
			transitInfo,
			transitDuration: formatMinutesToText(transitDuration),
			totalFlightMinutes,
			duration: formattedDuration,
			seatClasses,
			stopType,
			aircraftNames,
		};
	});
};
