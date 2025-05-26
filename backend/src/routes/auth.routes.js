// /backend/src/routes/auth.routes.js
const express = require("express");
const router = express.Router();

const {
	register,
	verifyEmail,
	login,
} = require("../controllers/auth.controller");
const verifyCaptcha = require("../middlewares/verifyCaptcha");
const loginLimiter = require("../middlewares/loginLimiter");
// Đăng ký người dùng (POST /api/auth/register)
router.post("/register", verifyCaptcha, register);

router.get("/verify-email", verifyEmail);

router.post("/login", loginLimiter, verifyCaptcha, login);

module.exports = router;
