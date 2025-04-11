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

// [GET] /api/user/all
const getAllUsers = async (req, res) => {
	try {
		const users = await User.find({}, "-password"); // ẩn password
		res.json(users);
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng." });
	}
};

// [GET] /api/user/:id
const getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id, "-password");
		if (!user)
			return res.status(404).json({ message: "Không tìm thấy người dùng." });
		res.json(user);
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi lấy người dùng." });
	}
};

// [PUT] /api/user/:id
const updateUser = async (req, res) => {
	try {
		const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		}).select("-password");
		res.json({ message: "Cập nhật thành công", user: updatedUser });
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi cập nhật người dùng." });
	}
};

// [DELETE] /api/user/:id
const deleteUser = async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id);
		res.json({ message: "Xoá người dùng thành công." });
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi xoá người dùng." });
	}
};

module.exports = {
	getProfile,
	updateProfile,
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
};
