// /backend/src/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const loginRateLimiter = require("../middlewares/loginRateLimiter");
const verifyCaptcha = require("../middlewares/verifyCaptcha");

// Đăng ký
router.post("/register", verifyCaptcha, authController.register);

// Xác thực email
router.get("/verify", authController.verifyEmail);

// Đăng nhập
router.post("/login", verifyCaptcha, loginRateLimiter, authController.login);

module.exports = router;
