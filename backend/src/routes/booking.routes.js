// /backend/src/routes/booking.routes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const verifyToken = require("../middlewares/verifyToken");
router.get("/", verifyToken, bookingController.getAllBookings);
router.post("/", verifyToken, bookingController.createBooking);
router.put("/:id", verifyToken, bookingController.payBooking);
router.get("/:id", verifyToken, bookingController.getBookingById);
router.put("/:id/cancel", verifyToken, bookingController.cancelBooking);
module.exports = router;
