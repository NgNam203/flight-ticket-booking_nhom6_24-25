// backend/src/services/auth.service.js

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendVerificationEmail } = require("./emailService");

// Đăng ký user mới
exports.registerUser = async ({ fullName, email, phone, password }) => {
	const hashedPassword = await bcrypt.hash(password, 10);
	const verificationToken = crypto.randomBytes(32).toString("hex");
	const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1h

	const newUser = new User({
		fullName,
		email,
		phone,
		password: hashedPassword,
		verificationToken,
		verificationTokenExpiry: expiry,
		role: "user",
	});
	await newUser.save();

	await sendVerificationEmail(email, verificationToken);

	return {
		message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực.",
	};
};

// Xác thực email user
exports.verifyUserEmail = async (email, token) => {
	const user = await User.findOne({
		email,
		verificationToken: token,
		verificationTokenExpiry: { $gt: new Date() },
	});

	if (!user) {
		// Check nếu đã verify trước đó
		const verifiedUser = await User.findOne({ email, isVerified: true });
		if (verifiedUser) {
			throw new Error("Tài khoản đã được xác thực.");
		}
		throw new Error("Link không hợp lệ hoặc đã hết hạn.");
	}

	if (user.isVerified) {
		throw new Error("Tài khoản đã được xác thực.");
	}

	user.isVerified = true;
	user.verificationToken = undefined;
	user.verificationTokenExpiry = undefined;
	await user.save();

	return { message: "Tài khoản đã xác thực thành công!" };
};

// Đăng nhập user
exports.loginUser = async (account, password) => {
	const user = await User.findOne({
		$or: [{ email: account }, { phone: account }],
	});
	if (!user) throw new Error("Thông tin đăng nhập không chính xác.");

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) throw new Error("Thông tin đăng nhập không chính xác.");

	if (!user.isVerified) throw new Error("Tài khoản chưa xác thực email.");

	const token = jwt.sign(
		{ userId: user._id, email: user.email, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: "2h" }
	);

	return {
		token,
		user: {
			id: user._id,
			fullName: user.fullName,
			email: user.email,
			phone: user.phone,
			role: user.role,
		},
	};
};
