const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Booking = require("../models/Booking");

dotenv.config();

const deleteAllBookings = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		const result = await Booking.deleteMany({});
		console.log(`✅ Đã xoá ${result.deletedCount} booking`);
	} catch (err) {
		console.error("❌ Lỗi xoá booking:", err.message);
	} finally {
		await mongoose.disconnect();
		process.exit();
	}
};

deleteAllBookings();
