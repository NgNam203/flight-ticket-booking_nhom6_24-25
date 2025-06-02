const { body } = require("express-validator");

exports.validateCreateBooking = [
	// flightId và seatClass là hidden field phía frontend gửi kèm
	body("flightId").notEmpty().withMessage("Chuyến bay không được để trống."),
	body("seatClass").notEmpty().withMessage("Hạng ghế không được để trống."),

	// Thông tin liên hệ
	body("contact")
		.notEmpty()
		.withMessage("Thông tin liên hệ không được để trống."),
	body("contact.fullName")
		.notEmpty()
		.withMessage("Tên liên hệ không được để trống."),
	body("contact.email").isEmail().withMessage("Email liên hệ không hợp lệ."),
	body("contact.phone")
		.notEmpty()
		.withMessage("Số điện thoại liên hệ không được để trống."),

	// Danh sách hành khách
	body("passengers")
		.isArray({ min: 1 })
		.withMessage("Cần ít nhất 1 hành khách."),
	body("passengers.*.fullName")
		.notEmpty()
		.withMessage("Họ tên hành khách không được để trống."),
	body("passengers.*.gender")
		.isIn(["male", "female", "other"])
		.withMessage("Giới tính không hợp lệ."),
	body("passengers.*.birthDate")
		.isISO8601()
		.withMessage("Ngày sinh không hợp lệ."),
	body("passengers.*.nationality")
		.notEmpty()
		.withMessage("Quốc tịch không được để trống."),
];
