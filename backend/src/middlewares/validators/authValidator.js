// middlewares/validators/authValidator.js
const { query, body } = require("express-validator");

exports.registerValidation = [
	body("fullName")
		.notEmpty()
		.withMessage("Họ tên không được để trống")
		.isLength({ min: 3 })
		.withMessage("Họ tên quá ngắn"),

	body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail(),

	body("phone")
		.isMobilePhone("vi-VN")
		.withMessage("Số điện thoại không hợp lệ"),

	body("password")
		.isLength({ min: 6, max: 50 })
		.withMessage("Mật khẩu phải từ 6 đến 50 ký tự"),
];

exports.loginValidation = [
	body("account").notEmpty().withMessage("Email/SĐT không được để trống"),
	body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
];

exports.verifyEmailValidation = [
	query("email").isEmail().withMessage("Email không hợp lệ"),
	query("token").notEmpty().withMessage("Token xác thực là bắt buộc"),
];
