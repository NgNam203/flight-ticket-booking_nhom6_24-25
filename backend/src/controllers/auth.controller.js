// /backend/src/controllers/auth.controller.js

const {
	registerUser,
	verifyUserEmail,
	loginUser,
} = require("../services/authService");
const { sendVerificationEmail } = require("../services/emailService");
const { successResponse, errorResponse } = require("../utils/response");

const register = async (req, res) => {
	const { fullName, email, phone, password } = req.body;
	try {
		const { email: userEmail, verificationToken } = await registerUser({
			fullName,
			email,
			phone,
			password,
		});
		await sendVerificationEmail(userEmail, verificationToken);

		return successResponse(
			res,
			"Đăng ký thành công! Vui lòng kiểm tra email để xác thực."
		);
	} catch (err) {
		console.error("Register error:", err.message);
		return errorResponse(res, 409, err.message);
	}
};

const verifyEmail = async (req, res) => {
	const { token, email } = req.query;
	try {
		await verifyUserEmail({ token, email });
		return successResponse(res, "Tài khoản đã được xác thực thành công!");
	} catch (err) {
		console.error("Email verify error:", err.message);
		return errorResponse(res, 400, err.message);
	}
};

const login = async (req, res) => {
	const { account, password } = req.body;

	try {
		const result = await loginUser({ account, password });
		return successResponse(res, "Đăng nhập thành công!", result);
	} catch (err) {
		console.error("Login error:", err.message);
		return errorResponse(res, 401, err.message);
	}
};

module.exports = { register, verifyEmail, login };
