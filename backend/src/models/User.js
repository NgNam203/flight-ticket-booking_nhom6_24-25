// /backend/src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		fullName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		phone: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		isVerified: { type: Boolean, default: false },
		verificationToken: String,
		verificationTokenExpiry: Date,

		// Phân quyền
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},

		// Thông tin cá nhân
		gender: { type: String, enum: ["Nam", "Nữ"], default: null },
		birthdate: { type: Date, default: null },
		nationality: { type: String, default: null },
		passportNumber: { type: String, default: null },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
