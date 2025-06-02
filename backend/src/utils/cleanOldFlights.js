const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Flight = require("../models/Flight");
const Booking = require("../models/Booking");

dotenv.config();

const cleanOldFlights = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("✅ Connected to MongoDB");

		const now = new Date();
		now.setHours(0, 0, 0, 0); // Lấy mốc 00:00 hôm nay

		const oldFlights = await Flight.find({
			departureTime: { $lt: now },
		});

		let deletedCount = 0;

		for (const flight of oldFlights) {
			const hasBooking = await Booking.exists({ flight: flight._id });

			if (!hasBooking) {
				await Flight.deleteOne({ _id: flight._id });
				console.log(`🗑️ Đã xóa chuyến bay cũ: ${flight.flightCode}`);
				deletedCount++;
			} else {
				console.log(`❌ Không xoá ${flight.flightCode} vì đã có booking.`);
			}
		}

		console.log(`\n🔚 Tổng số chuyến đã xoá: ${deletedCount}`);
	} catch (err) {
		console.error("❌ Lỗi khi xoá chuyến bay:", err.message);
	} finally {
		await mongoose.disconnect();
		process.exit();
	}
};

cleanOldFlights();
