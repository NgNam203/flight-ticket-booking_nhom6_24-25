// /backend/src/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const {
	registerValidation,
	loginValidation,
} = require("../middlewares/validators/authValidator");
const validate = require("../middlewares/validators/validate");
const verifyCaptcha = require("../middlewares/verifyCaptcha");
const loginLimiter = require("../middlewares/loginLimiter");
const registerLimiter = require("../middlewares/registerLimiter");
const {
	register,
	verifyEmail,
	login,
} = require("../controllers/auth.controller");
// Đăng ký người dùng (POST /api/auth/register)

router.post(
	"/register",
	registerLimiter,
	// verifyCaptcha,
	registerValidation,
	validate,
	register
);

router.get("/verify-email", verifyEmail);

router.post(
	"/login",
	loginLimiter,
	// verifyCaptcha,
	loginValidation,
	validate,
	login
);

module.exports = router;
