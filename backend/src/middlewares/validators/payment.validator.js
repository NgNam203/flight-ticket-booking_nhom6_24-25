const { body, param } = require("express-validator");

exports.validatePayment = [
	param("id").isMongoId().withMessage("ID đơn đặt vé không hợp lệ."),

	body("paymentMethod")
		.notEmpty()
		.withMessage("Phương thức thanh toán là bắt buộc.")
		.isIn(["bank", "atm", "international", "cod"])
		.withMessage("Phương thức thanh toán không hợp lệ."),

	body("convenienceFee")
		.notEmpty()
		.withMessage("Phí tiện ích không được để trống.")
		.isNumeric()
		.withMessage("Phí tiện ích phải là số."),

	body("totalAmount")
		.notEmpty()
		.withMessage("Tổng tiền không được để trống.")
		.isNumeric()
		.withMessage("Tổng tiền phải là số."),
];
