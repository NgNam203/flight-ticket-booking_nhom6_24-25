// /backend/src/middlewares/verifyToken.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Không có token." });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // decoded chứa { userId, email }
		next();
	} catch (err) {
		return res
			.status(403)
			.json({ message: "Token không hợp lệ hoặc đã hết hạn." });
	}
};

module.exports = verifyToken;
