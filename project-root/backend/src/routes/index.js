// /backend/src/routes/index.js
const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const flightRoutes = require("./flight.routes");
const airportRoutes = require("./airport.routes");
const bookingRoutes = require("./booking.routes");
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/flights", flightRoutes);
router.use("/airports", airportRoutes);
router.use("/booking", bookingRoutes);
module.exports = router;
