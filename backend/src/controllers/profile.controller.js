const profileService = require("../services/profile.service");

exports.getProfile = async (req, res) => {
	try {
		const user = await profileService.getProfile(req.user.id);
		res.status(200).json(user);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Lỗi khi lấy thông tin cá nhân", error: err.message });
	}
};

exports.updateProfile = async (req, res) => {
	try {
		const updatedUser = await profileService.updateProfile(
			req.user.id,
			req.body
		);
		res.status(200).json(updatedUser);
	} catch (err) {
		res
			.status(400)
			.json({ message: "Cập nhật thông tin thất bại", error: err.message });
	}
};
