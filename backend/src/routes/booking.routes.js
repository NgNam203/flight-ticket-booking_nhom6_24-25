// /backend/src/routes/booking.routes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const verifyToken = require("../middlewares/verifyToken");
router.get("/", verifyToken, bookingController.getAllBookings);
router.post("/", verifyToken, bookingController.createBooking);
router.put("/:id", bookingController.payBooking);
router.get("/:id", bookingController.getBookingById);
module.exports = router;
