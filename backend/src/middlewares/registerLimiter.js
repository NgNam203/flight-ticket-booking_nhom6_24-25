const rateLimit = require("express-rate-limit");

const registerLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 phút
	max: 15,
	message: "Quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau.",
});

module.exports = registerLimiter;
