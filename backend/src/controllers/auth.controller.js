// backend/src/controllers/auth.controller.js

const authService = require("../services/auth.service");

// [POST] /api/auth/register
const register = async (req, res) => {
	const { fullName, email, phone, password } = req.body;

	if (!fullName || !email || !phone || !password) {
		return res.status(400).json({ message: "Vui lòng điền đủ thông tin." });
	}

	try {
		const result = await authService.registerUser({
			fullName,
			email,
			phone,
			password,
		});
		res.status(201).json(result);
	} catch (err) {
		console.error("Register error:", err.message);
		res.status(500).json({ message: "Đăng ký thất bại.", error: err.message });
	}
};

// [GET] /api/auth/verify
const verifyEmail = async (req, res) => {
	const { token, email } = req.query;
	if (!token || !email) {
		return res.status(400).json({ message: "Thiếu token hoặc email." });
	}

	try {
		const result = await authService.verifyUserEmail(email, token);
		res.status(200).json(result);
	} catch (err) {
		console.error("Verify email error:", err.message);
		res.status(400).json({ message: err.message });
	}
};

// [POST] /api/auth/login
const login = async (req, res) => {
	const { account, password } = req.body;
	if (!account || !password) {
		return res.status(400).json({ message: "Thiếu thông tin đăng nhập." });
	}

	try {
		const result = await authService.loginUser(account, password);
		res.status(200).json({
			message: "Đăng nhập thành công!",
			...result,
		});
	} catch (err) {
		console.error("Login error:", err.message);
		res.status(401).json({ message: err.message });
	}
};

module.exports = { register, verifyEmail, login };
