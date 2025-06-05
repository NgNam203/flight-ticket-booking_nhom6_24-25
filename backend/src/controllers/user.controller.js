const userService = require("../services/user.service");

exports.getAllUsers = async (req, res) => {
	try {
		const users = await userService.getAllUsers();
		res.json(users);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.getUserById = async (req, res) => {
	try {
		const user = await userService.getUserById(req.params.id);
		if (!user) return res.status(404).json({ message: "User not found" });
		res.json(user);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.updateUser = async (req, res) => {
	try {
		const updatedUser = await userService.updateUser(req.params.id, req.body);
		if (!updatedUser)
			return res.status(404).json({ message: "User not found" });
		res.json(updatedUser);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const deletedUser = await userService.deleteUser(req.params.id);
		if (!deletedUser)
			return res.status(404).json({ message: "User not found" });
		res.json({ message: "User deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
