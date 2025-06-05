const User = require("../models/User");

exports.getProfile = async (userId) => {
	const user = await User.findById(userId).select("-password");
	if (!user) throw new Error("Không tìm thấy người dùng");
	return user;
};

exports.updateProfile = async (userId, updateData) => {
	const allowedFields = [
		"fullName",
		"phone",
		"email",
		"birthdate",
		"gender",
		"nationality",
	];

	const dataToUpdate = {};

	allowedFields.forEach((field) => {
		if (updateData[field]) dataToUpdate[field] = updateData[field];
	});

	const updatedUser = await User.findByIdAndUpdate(userId, dataToUpdate, {
		new: true,
		runValidators: true,
	}).select("-password");

	if (!updatedUser) throw new Error("Không thể cập nhật người dùng");

	return updatedUser;
};
