const { query } = require("express-validator");

const searchFlightValidation = [
	query("from")
		.notEmpty()
		.withMessage("Mã sân bay đi không được để trống")
		.isLength({ min: 3, max: 3 })
		.withMessage("Mã sân bay đi phải có 3 ký tự")
		.isAlpha()
		.withMessage("Mã sân bay đi chỉ chứa chữ cái"),

	query("to")
		.notEmpty()
		.withMessage("Mã sân bay đến không được để trống")
		.isLength({ min: 3, max: 3 })
		.withMessage("Mã sân bay đến phải có 3 ký tự")
		.isAlpha()
		.withMessage("Mã sân bay đến chỉ chứa chữ cái"),

	query("departureDate")
		.notEmpty()
		.withMessage("Ngày khởi hành không được để trống")
		.isISO8601()
		.withMessage("Ngày khởi hành không đúng định dạng YYYY-MM-DD"),

	query("returnDate")
		.optional()
		.isISO8601()
		.withMessage("Ngày quay về không đúng định dạng YYYY-MM-DD"),

	query("passengers")
		.notEmpty()
		.withMessage("Số lượng hành khách không được để trống")
		.isInt({ min: 1 })
		.withMessage("Số lượng hành khách phải là số nguyên dương"),
];

module.exports = {
	searchFlightValidation,
};
