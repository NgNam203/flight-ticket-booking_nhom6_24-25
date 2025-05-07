// /backend/src/middlewares/loginRateLimiter.js

const rateLimit = require("express-rate-limit");

// Middleware giới hạn số lần login sai
const loginRateLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // ⏳ 5 phút
	max: 5, // ❌ Cho phép tối đa 5 lần login trong 5 phút
	message: {
		message: "Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 5 phút.",
	},
	standardHeaders: true,
	legacyHeaders: false,
});

module.exports = loginRateLimiter;
