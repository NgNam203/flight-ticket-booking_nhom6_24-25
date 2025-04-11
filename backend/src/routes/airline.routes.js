const express = require("express");
const router = express.Router();
const airlineController = require("../controllers/airline.controller");

router.get("/", airlineController.getAllAirlines); // GET /api/airlines
router.post("/", airlineController.createAirline); // Thêm mới
router.put("/:id", airlineController.updateAirline); // Cập nhật
router.delete("/:id", airlineController.deleteAirline); // Xóa
module.exports = router;
