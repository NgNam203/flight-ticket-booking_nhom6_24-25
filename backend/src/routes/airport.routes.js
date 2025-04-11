const express = require("express");
const router = express.Router();
const airportController = require("../controllers/airport.controller");
// const verifyToken = require("../middlewares/verifyToken");
// Có thể thêm middleware isAdmin ở đây

router.get("/", airportController.getAllAirports);
router.post("/", airportController.createAirport);
router.put("/:id", airportController.updateAirport);
router.delete("/:id", airportController.deleteAirport);

module.exports = router;
