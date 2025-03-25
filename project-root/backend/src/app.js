// /backend/src/app.js
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const routes = require("./routes"); // Import toàn bộ routes từ folder routes

const app = express();

// Load biến môi trường từ .env
dotenv.config();

// Middleware
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded
app.use(cors()); // Cho phép CORS
app.use(helmet()); // Bảo mật HTTP headers
app.use(morgan("dev")); // Log request

// Routes
app.use("/api", routes); // Gắn tất cả route với tiền tố /api

// 404 handler
app.use((req, res, next) => {
	res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
