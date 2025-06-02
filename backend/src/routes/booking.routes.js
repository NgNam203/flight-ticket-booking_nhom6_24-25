// /backend/src/routes/booking.routes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const verifyToken = require("../middlewares/verifyToken");
const {
	validateCreateBooking,
} = require("../middlewares/validators/booking.validator");
const {
	validatePayment,
} = require("../middlewares/validators/payment.validator");
const validate = require("../middlewares/validators/validate"); // middleware xử lý kết quả validate

router.get("/", verifyToken, bookingController.getAllBookings);
router.post(
	"/",
	verifyToken,
	validateCreateBooking,
	validate,
	bookingController.createBooking
);
router.put("/:id", bookingController.payBooking);
router.get("/:id", bookingController.getBookingById);
module.exports = router;
