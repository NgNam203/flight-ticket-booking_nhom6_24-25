const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.controller");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, profileController.getProfile);
router.put("/", verifyToken, profileController.updateProfile);

module.exports = router;
