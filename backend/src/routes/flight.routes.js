const express = require("express");
const router = express.Router();
const flightController = require("../controllers/flight.controller");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");
const {
	searchFlightValidation,
} = require("../middlewares/validators/flight.validator");
const validate = require("../middlewares/validators/validate");

router.get(
	"/search",
	searchFlightValidation,
	validate,
	flightController.searchFlights
);

router.get("/", verifyToken, isAdmin, flightController.getAllFlights);
router.post("/", verifyToken, isAdmin, flightController.createFlight);
router.get("/:id", verifyToken, isAdmin, flightController.getFlightById);
router.put("/:id", verifyToken, isAdmin, flightController.updateFlight);
router.delete("/:id", verifyToken, isAdmin, flightController.deleteFlight);

module.exports = router;
