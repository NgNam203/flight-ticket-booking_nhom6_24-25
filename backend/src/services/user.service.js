// backend/src/services/user.service.js

const User = require("../models/User");

// Lấy thông tin cá nhân user
exports.getUserProfile = async (userId) => {
	return await User.findById(userId).select(
		"-password -verificationToken -verificationTokenExpiry"
	);
};

// Cập nhật profile user
exports.updateUserProfile = async (userId, updateFields) => {
	return await User.findByIdAndUpdate(userId, updateFields, {
		new: true,
		runValidators: true,
	}).select("-password -verificationToken -verificationTokenExpiry");
};

// Lấy tất cả người dùng
exports.getAllUsers = async () => {
	return await User.find({}, "-password");
};

// Lấy user theo ID
exports.getUserById = async (id) => {
	return await User.findById(id).select("-password");
};

// Cập nhật user theo ID
exports.updateUser = async (id, data) => {
	return await User.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	}).select("-password");
};

// Xoá user theo ID
exports.deleteUser = async (id) => {
	return await User.findByIdAndDelete(id);
};
