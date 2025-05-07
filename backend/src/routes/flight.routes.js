const express = require("express");
const router = express.Router();
const flightController = require("../controllers/flight.controller");

router.get("/search", flightController.searchFlights);

module.exports = router;
