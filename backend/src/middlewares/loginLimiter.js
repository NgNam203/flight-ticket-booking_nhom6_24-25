const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 15,
	message: "Bạn đã đăng nhập sai quá nhiều lần. Thử lại sau 15 phút.",
	standardHeaders: true,
	legacyHeaders: false,
});

module.exports = loginLimiter;
