// /backend/src/controllers/auth.controller.js
const {
	registerUser,
	verifyUserEmail,
	loginUser,
} = require("../services/authService");
const { sendVerificationEmail } = require("../services/emailService");

const register = async (req, res) => {
	const { fullName, email, phone, password } = req.body;
	if (!fullName || !email || !phone || !password) {
		return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin." });
	}

	try {
		const { email: userEmail, verificationToken } = await registerUser({
			fullName,
			email,
			phone,
			password,
		});
		await sendVerificationEmail(userEmail, verificationToken);

		res.status(201).json({
			message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực.",
		});
	} catch (err) {
		console.error("Register error:", err.message);
		res.status(409).json({ message: err.message });
	}
};

const verifyEmail = async (req, res) => {
	const { token, email } = req.query;
	try {
		await verifyUserEmail({ token, email });
		res.status(200).json({ message: "Tài khoản đã được xác thực thành công!" });
	} catch (err) {
		console.error("Email verify error:", err.message);
		res.status(400).json({ message: err.message });
	}
};

const login = async (req, res) => {
	const { account, password } = req.body;
	if (!account || !password) {
		return res.status(400).json({ message: "Thiếu thông tin đăng nhập." });
	}

	try {
		const result = await loginUser({ account, password });
		res.status(200).json({ message: "Đăng nhập thành công!", ...result });
	} catch (err) {
		console.error("Login error:", err.message);
		res.status(401).json({ message: err.message });
	}
};

module.exports = { register, verifyEmail, login };
