// /backend/src/controllers/auth.controller.js
const bcrypt = require("bcrypt");
const User = require("../models/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../services/emailService");

const register = async (req, res) => {
	const { fullName, email, phone, password } = req.body;

	// Kiểm tra thông tin
	if (!fullName || !email || !phone || !password) {
		return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin." });
	}

	try {
		// Kiểm tra email/phone đã tồn tại
		const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
		if (existingUser) {
			return res
				.status(409)
				.json({ message: "Email hoặc số điện thoại đã tồn tại." });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);
		const verificationToken = crypto.randomBytes(32).toString("hex");
		const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 giờ

		// Tạo user
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

		res.status(201).json({
			message:
				"Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
		});
	} catch (err) {
		console.error("Register error:", err.message);
		res.status(500).json({ message: "Đăng ký thất bại. Vui lòng thử lại." });
	}
};

const verifyEmail = async (req, res) => {
	const { token, email } = req.query;

	try {
		const user = await User.findOne({
			email,
			verificationToken: token,
			verificationTokenExpiry: { $gt: new Date() },
		});

		if (user) {
			if (user.isVerified) {
				return res.status(200).json({ message: "Tài khoản đã được xác thực." });
			}

			user.isVerified = true;
			user.verificationToken = undefined;
			user.verificationTokenExpiry = undefined;
			await user.save();

			return res
				.status(200)
				.json({ message: "Tài khoản đã được xác thực thành công!" });
		}

		const verifiedUser = await User.findOne({ email, isVerified: true });

		if (verifiedUser) {
			return res.status(400).json({ message: "Tài khoản đã được xác thực." });
		}

		return res
			.status(400)
			.json({ message: "Link không hợp lệ hoặc đã hết hạn." });
	} catch (err) {
		console.error("Email verify error:", err.message);
		res.status(500).json({ message: "Xác thực thất bại." });
	}
};

const login = async (req, res) => {
	const { account, password } = req.body;

	if (!account || !password) {
		return res.status(400).json({ message: "Thiếu thông tin đăng nhập." });
	}

	try {
		// ✅ Tìm theo email hoặc số điện thoại
		const user = await User.findOne({
			$or: [{ email: account }, { phone: account }],
		});

		// ✅ Nếu không tồn tại hoặc sai mật khẩu → trả lỗi chung chung
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res
				.status(401)
				.json({ message: "Email/Số điện thoại hoặc mật khẩu không đúng." });
		}

		// ✅ Nếu chưa xác thực email
		if (!user.isVerified) {
			return res
				.status(403)
				.json({ message: "Tài khoản chưa được xác thực email." });
		}

		// ✅ Tạo JWT
		const token = jwt.sign(
			{ userId: user._id, email: user.email, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "2h" }
		);

		res.status(200).json({
			message: "Đăng nhập thành công!",
			token,
			user: {
				id: user._id,
				fullName: user.fullName,
				email: user.email,
				phone: user.phone,
				role: user.role,
			},
		});
	} catch (err) {
		console.error("Login error:", err.message);
		res.status(500).json({ message: "Lỗi máy chủ khi đăng nhập." });
	}
};
module.exports = { register, verifyEmail, login };
