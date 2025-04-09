import mongoose from "mongoose";

const airlineSchema = new mongoose.Schema({
	name: { type: String, required: true },
	code: { type: String }, // ví dụ: VJ, VN, QH
	logo: { type: String }, // URL ảnh logo (tuỳ bạn)
});

export default mongoose.model("Airline", airlineSchema);
