// /backend/src/controllers/user.controller.js
const User = require("../models/User");

// [GET] /api/user/profile
const getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.userId).select(
			"-password -verificationToken -verificationTokenExpiry"
		);

		if (!user) {
			return res.status(404).json({ message: "Người dùng không tồn tại." });
		}

		res.json(user);
	} catch (err) {
		console.error("Get profile error:", err);
		res.status(500).json({ message: "Lỗi server." });
	}
};

// [PUT] /api/user/profile
const updateProfile = async (req, res) => {
	try {
		const updateFields = req.body;

		const updatedUser = await User.findByIdAndUpdate(
			req.user.userId,
			updateFields,
			{ new: true, runValidators: true }
		).select("-password -verificationToken -verificationTokenExpiry");

		if (!updatedUser) {
			return res.status(404).json({ message: "Người dùng không tồn tại." });
		}

		res.json(updatedUser);
	} catch (err) {
		console.error("Update profile error:", err);
		res.status(500).json({ message: "Lỗi khi cập nhật thông tin." });
	}
};

module.exports = {
	getProfile,
	updateProfile,
};
