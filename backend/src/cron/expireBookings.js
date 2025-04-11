const cron = require("node-cron");
const mongoose = require("mongoose");
require("dotenv").config();

const Booking = require("../models/Booking");

// Hàm thực thi cập nhật đơn quá hạn
const expireOutdatedBookings = async () => {
	try {
		const now = new Date();

		const result = await Booking.updateMany(
			{
				status: "pending",
				holdUntil: { $lt: now },
			},
			{ $set: { status: "expired" } }
		);

		console.log(`✅ CronJob: Cập nhật ${result.modifiedCount} đơn đã quá hạn.`);
	} catch (err) {
		console.error("❌ Lỗi khi cập nhật đơn quá hạn:", err);
	}
};

// Kết nối DB và chạy cron
mongoose.connect(process.env.MONGO_URI).then(() => {
	console.log("✅ Đã kết nối MongoDB");

	// Chạy mỗi 5 phút
	cron.schedule("*/5 * * * *", async () => {
		console.log("🕐 CronJob: Kiểm tra đơn hết hạn giữ chỗ...");
		await expireOutdatedBookings();
	});
});
