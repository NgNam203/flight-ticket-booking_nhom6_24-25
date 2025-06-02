const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const isDev = process.env.NODE_ENV !== "production";

		return res.status(400).json({
			success: false,
			message: "Dữ liệu không hợp lệ",
			errors: isDev
				? errors.array().map((err) => ({
						field: err.param || "unknown",
						msg: err.msg,
				  }))
				: undefined,
		});
	}
	next();
};
