// backend/src/controllers/user.controller.js

const userService = require("../services/user.service");

// [GET] /api/user/profile
exports.getProfile = async (req, res) => {
	try {
		const user = await userService.getUserProfile(req.user.userId);
		if (!user)
			return res.status(404).json({ message: "Người dùng không tồn tại." });
		res.json(user);
	} catch (err) {
		console.error("Get profile error:", err);
		res.status(500).json({ message: "Lỗi server." });
	}
};

// [PUT] /api/user/profile
exports.updateProfile = async (req, res) => {
	try {
		const updatedUser = await userService.updateUserProfile(
			req.user.userId,
			req.body
		);
		if (!updatedUser)
			return res.status(404).json({ message: "Người dùng không tồn tại." });
		res.json(updatedUser);
	} catch (err) {
		console.error("Update profile error:", err);
		res.status(500).json({ message: "Lỗi khi cập nhật thông tin." });
	}
};

// [GET] /api/user/all
exports.getAllUsers = async (req, res) => {
	try {
		const users = await userService.getAllUsers();
		res.json(users);
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng." });
	}
};

// [GET] /api/user/:id
exports.getUserById = async (req, res) => {
	try {
		const user = await userService.getUserById(req.params.id);
		if (!user)
			return res.status(404).json({ message: "Không tìm thấy người dùng." });
		res.json(user);
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi lấy người dùng." });
	}
};

// [PUT] /api/user/:id
exports.updateUser = async (req, res) => {
	try {
		const updatedUser = await userService.updateUser(req.params.id, req.body);
		if (!updatedUser)
			return res.status(404).json({ message: "Không tìm thấy người dùng." });
		res.json({ message: "Cập nhật thành công", user: updatedUser });
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi cập nhật người dùng." });
	}
};

// [DELETE] /api/user/:id
exports.deleteUser = async (req, res) => {
	try {
		await userService.deleteUser(req.params.id);
		res.json({ message: "Xoá người dùng thành công." });
	} catch (err) {
		res.status(500).json({ message: "Lỗi khi xoá người dùng." });
	}
};
