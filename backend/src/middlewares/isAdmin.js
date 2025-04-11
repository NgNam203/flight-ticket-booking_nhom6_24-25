// /middlewares/isAdmin.js

const isAdmin = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next(); // ✅ Cho phép tiếp tục nếu là admin
	} else {
		return res.status(403).json({ message: "Bạn không có quyền truy cập." });
	}
};

module.exports = isAdmin;
