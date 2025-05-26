// /backend/src/services/authService.js
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async ({ fullName, email, phone, password }) => {
	const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
	if (existingUser) throw new Error("Email hoặc số điện thoại đã tồn tại.");

	const hashedPassword = await bcrypt.hash(password, 10);
	const verificationToken = crypto.randomBytes(32).toString("hex");
	const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 giờ

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
	return { email, verificationToken };
};

const verifyUserEmail = async ({ email, token }) => {
	const user = await User.findOne({
		email,
		verificationToken: token,
		verificationTokenExpiry: { $gt: new Date() },
	});

	if (!user) {
		const verifiedUser = await User.findOne({ email, isVerified: true });
		if (verifiedUser) throw new Error("Tài khoản đã được xác thực.");
		throw new Error("Link không hợp lệ hoặc đã hết hạn.");
	}

	if (user.isVerified) return;

	user.isVerified = true;
	user.verificationToken = undefined;
	user.verificationTokenExpiry = undefined;
	await user.save();
};

const loginUser = async ({ account, password }) => {
	const user = await User.findOne({
		$or: [{ email: account }, { phone: account }],
	});
	if (!user || !(await bcrypt.compare(password, user.password))) {
		throw new Error("Email/Số điện thoại hoặc mật khẩu không đúng.");
	}
	if (!user.isVerified) {
		throw new Error("Tài khoản chưa được xác thực email.");
	}

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

module.exports = { registerUser, verifyUserEmail, loginUser };
