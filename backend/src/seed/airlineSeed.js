import mongoose from "mongoose";
import dotenv from "dotenv";
import Airline from "../models/Airline.js";

dotenv.config();

const airlines = [
	{
		name: "Vietnam Airlines",
		code: "VN",
		logo: "https://assets.deeptech.vn/airlines/logosq/vn.png",
	},
	{
		name: "Vietjet Air",
		code: "VJ",
		logo: "https://assets.deeptech.vn/airlines/logosq/vj.png",
	},
	{
		name: "Bamboo Airways",
		code: "QH",
		logo: "https://assets.deeptech.vn/airlines/logosq/qh.png",
	},
];

const seedAirlines = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		await Airline.deleteMany(); // Xóa dữ liệu cũ nếu có
		await Airline.insertMany(airlines);
		console.log("✅ Đã thêm dữ liệu mẫu cho hãng hàng không!");
		process.exit();
	} catch (error) {
		console.error("❌ Lỗi khi seed dữ liệu:", error);
		process.exit(1);
	}
};

seedAirlines();
