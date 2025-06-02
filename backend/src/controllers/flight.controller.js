const flightService = require("../services/flightService");
const { successResponse, errorResponse } = require("../utils/response");

const getAllFlights = async (req, res) => {
	try {
		const flights = await flightService.getAllFlights();
		return successResponse(res, "Lấy danh sách chuyến bay thành công", flights);
	} catch (err) {
		console.error("getAllFlights error:", err);
		return errorResponse(res, 500, "Lỗi khi lấy danh sách chuyến bay");
	}
};

const createFlight = async (req, res) => {
	try {
		const flight = await flightService.createFlight(req.body);
		return successResponse(res, "Thêm chuyến bay thành công", flight);
	} catch (err) {
		console.error("createFlight error:", err);
		return errorResponse(res, 500, "Lỗi khi tạo chuyến bay");
	}
};

const getFlightById = async (req, res) => {
	try {
		const flight = await flightService.getFlightById(req.params.id);
		if (!flight) {
			return errorResponse(res, 404, "Không tìm thấy chuyến bay");
		}
		return successResponse(res, "Lấy thông tin chuyến bay thành công", flight);
	} catch (err) {
		console.error("getFlightById error:", err);
		return errorResponse(res, 500, "Lỗi khi lấy thông tin chuyến bay");
	}
};

const updateFlight = async (req, res) => {
	try {
		const updated = await flightService.updateFlight(req.params.id, req.body);
		if (!updated) {
			return errorResponse(res, 404, "Chuyến bay không tồn tại");
		}
		return successResponse(res, "Cập nhật chuyến bay thành công", updated);
	} catch (err) {
		console.error("updateFlight error:", err);
		return errorResponse(res, 500, "Lỗi khi cập nhật chuyến bay");
	}
};

const deleteFlight = async (req, res) => {
	try {
		await flightService.deleteFlight(req.params.id);
		return successResponse(res, "Xoá chuyến bay thành công");
	} catch (err) {
		console.error("deleteFlight error:", err);
		return errorResponse(res, 500, "Lỗi khi xoá chuyến bay");
	}
};

const searchFlights = async (req, res) => {
	try {
		const flights = await flightService.searchFlights(req.query);
		return successResponse(res, "Tìm kiếm chuyến bay thành công", flights);
	} catch (err) {
		console.error("searchFlights error:", err);
		return errorResponse(
			res,
			400,
			err.message || "Lỗi khi tìm kiếm chuyến bay"
		);
	}
};

module.exports = {
	getAllFlights,
	createFlight,
	getFlightById,
	updateFlight,
	deleteFlight,
	searchFlights,
};
