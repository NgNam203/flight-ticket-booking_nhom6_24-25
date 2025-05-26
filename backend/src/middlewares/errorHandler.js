const errorHandler = (err, req, res, next) => {
	console.error("❌", err.stack);
	res.status(err.statusCode || 500).json({
		success: false,
		message: err.message || "Đã xảy ra lỗi hệ thống.",
	});
};

module.exports = errorHandler;
