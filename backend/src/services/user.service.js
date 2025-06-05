const User = require("../models/User");

exports.getAllUsers = async () => {
	return await User.find({}, "-password");
};

exports.getUserById = async (id) => {
	return await User.findById(id).select("-password");
};

exports.updateUser = async (id, data) => {
	return await User.findByIdAndUpdate(id, data, { new: true }).select(
		"-password"
	);
};

exports.deleteUser = async (id) => {
	return await User.findByIdAndDelete(id);
};
