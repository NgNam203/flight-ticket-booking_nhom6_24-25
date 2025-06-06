// /backend/src/app.js
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const dotenv = require("dotenv");
const routes = require("./routes/index"); // Import toàn bộ routes từ folder routes
const errorHandler = require("./middlewares/errorHandler");
const path = require("path");
const app = express();

const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 phút
	max: 100, // max 100 requests/user trong 15 phút
	message: "Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau.",
});
// Load biến môi trường từ .env
dotenv.config();

// Middleware
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded
app.use(cors()); // Cho phép CORS
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: [
					"'self'",
					"https://www.google.com",
					"https://www.gstatic.com",
				],
				imgSrc: [
					"'self'",
					"data:",
					"https:",
					"https://news.vemaybay.vn",
					"https://at-assests.flightticket.vn",
				],
				frameSrc: ["'self'", "https://www.google.com"],
				connectSrc: [
					"'self'",
					"https://www.google.com",
					"https://www.gstatic.com",
				],
			},
		},
	})
); // Bảo mật HTTP headers
app.use(morgan("dev")); // Log request
app.use(globalLimiter); // Giới hạn request chung
app.use(mongoSanitize()); // Chống NoSQL injection
app.use(xss()); // Chống XSS

// Routes
app.use("/api", routes); // Gắn tất cả route với tiền tố /api

// Serve frontend build
app.use(express.static(path.join(__dirname, "../public")));
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Error handler
app.use(errorHandler);

module.exports = app;
