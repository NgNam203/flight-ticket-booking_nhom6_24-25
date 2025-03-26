// /backend/src/routes/booking.routes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const verifyToken = require("../middlewares/verifyToken");
router.get("/", verifyToken, bookingController.getAllBookings);

module.exports = router;
