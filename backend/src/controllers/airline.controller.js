import Airline from "../models/Airline";

// [GET] /api/airlines
export const getAllAirlines = async (req, res) => {
	try {
		const airlines = await Airline.find();
		res.status(200).json(airlines);
	} catch (err) {
		res.status(500).json({ message: "Lỗi server", error: err.message });
	}
};

// [POST] /api/airlines
export const createAirline = async (req, res) => {
	try {
		const { name, code, logo } = req.body;
		const newAirline = new Airline({ name, code, logo });
		await newAirline.save();
		res.status(201).json(newAirline);
	} catch (err) {
		res.status(500).json({ message: "Lỗi tạo airline", error: err.message });
	}
};

// [PUT] /api/airlines/:id
export const updateAirline = async (req, res) => {
	try {
		const { id } = req.params;
		const updated = await Airline.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		if (!updated)
			return res.status(404).json({ message: "Không tìm thấy airline" });
		res.json(updated);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Lỗi cập nhật airline", error: err.message });
	}
};

// [DELETE] /api/airlines/:id
export const deleteAirline = async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await Airline.findByIdAndDelete(id);
		if (!deleted)
			return res.status(404).json({ message: "Không tìm thấy airline" });
		res.json({ message: "Đã xóa thành công" });
	} catch (err) {
		res.status(500).json({ message: "Lỗi xóa airline", error: err.message });
	}
};
