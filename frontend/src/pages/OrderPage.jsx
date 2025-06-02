import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookingById } from "../services/bookingService";
import Header from "../components/Header";

const OrderPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [booking, setBooking] = useState(null);
	const [showDetails, setShowDetails] = useState(false);
	const utilityFee = 2200;

	useEffect(() => {
		const fetchBooking = async () => {
			try {
				const data = await getBookingById(id);
				console.log("📦 Booking data:", data);
				setBooking(data.data);
			} catch (err) {
				console.error("Lỗi khi tải thông tin đặt vé:", err);
			}
		};
		fetchBooking();
	}, [id]);

	if (!booking) return <div className="p-8">Loading...</div>;
	if (!booking.flights || booking.flights.length === 0)
		return <div className="p-8">Không có thông tin chuyến bay.</div>;
	if (!booking.passengers || booking.passengers.length === 0)
		return <div className="p-8">Không có thông tin hành khách.</div>;

	const flight = booking.flights[0]?.flight;
	const seatClass = booking.flights[0]?.seatClass;
	const passenger = booking.passengers[0];
	const contact = booking.contact;
	const isPaid = booking.status === "paid";
	const isExpired = !isPaid && new Date(booking.holdUntil) < new Date();
	const totalWithFee = booking.totalAmount + utilityFee;

	const handleReSearch = () => {
		if (!flight?.from || !flight?.to || !flight.departureTime) {
			return navigate("/search");
		}

		const from = flight.from._id;
		const to = flight.to._id;
		const passengersParam = booking.passengers.length || 1;
		const departureDate = new Date(flight.departureTime)
			.toISOString()
			.split("T")[0];

		navigate(
			`/search?from=${from}&to=${to}&passengers=${passengersParam}&departureDate=${departureDate}&passengers=1`
		);
	};

	return (
		<div className="bg-gray-100 min-h-screen px-4 py-6">
			<Header />
			<div
				className={`max-w-6xl mx-auto rounded-lg p-6 mb-6 text-sm ${
					isPaid
						? "bg-blue-100 text-blue-900"
						: isExpired
						? "bg-orange-100 text-orange-700"
						: "bg-orange-100 text-orange-700"
				} flex justify-between items-start`}>
				<div>
					<h3 className="text-lg font-semibold mb-1">
						{isPaid
							? "Xác nhận đặt vé"
							: isExpired
							? "Hết thời gian thanh toán"
							: "Chờ thanh toán"}
					</h3>
					<p className="mb-1">
						{isPaid
							? "Chúc mừng! Bạn đã thanh toán thành công."
							: isExpired
							? "Đặt chỗ của bạn đã huỷ do hết hạn thanh toán, bạn có thể đặt lại cho chuyến đi."
							: `Đặt chỗ của bạn đang được giữ. Bạn cần thanh toán trước ${new Date(
									booking.holdUntil
							  ).toLocaleTimeString()} - ${new Date(
									booking.holdUntil
							  ).toLocaleDateString()}`}
					</p>
					<p>
						Mã đơn hàng: <strong>{booking.bookingCode}</strong>
						<br />
						Ngày đặt:{" "}
						<strong>{new Date(booking.createdAt).toLocaleString()}</strong>
					</p>
					{isPaid && (
						<button
							onClick={() => navigate("/")}
							className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
							Mua thêm chuyến bay khác
						</button>
					)}
				</div>

				{!isPaid && !isExpired && (
					<button
						onClick={() =>
							navigate(`/payment/${booking._id}`, {
								state: {
									bookingId: booking._id,
									bookingCode: booking.bookingCode,
									holdUntil: booking.holdUntil,
									flightInfo: flight,
									seatClass,
									passengers: booking.passengers?.length || 1,
									totalAmount: booking.totalAmount,
								},
							})
						}
						className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600">
						Thanh toán ngay
					</button>
				)}

				{isExpired && (
					<button
						onClick={handleReSearch}
						className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600">
						Đặt lại
					</button>
				)}
			</div>

			<div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
				<div className="flex-1 space-y-6">
					<div className="bg-white rounded-lg shadow p-4">
						<h4 className="text-base font-semibold mb-3">
							Thông tin hành trình
						</h4>
						<div className="font-semibold mb-2">
							{flight.from.city} → {flight.to.city}
							<button
								onClick={() => setShowDetails(!showDetails)}
								className="ml-2 text-blue-600 hover:underline">
								Chi tiết {showDetails ? "▲" : "▼"}
							</button>
						</div>

						<div className="bg-gray-50 rounded-lg p-4 space-y-2">
							<div className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded">
								Chiều đi
							</div>
							<div className="flex items-center gap-4">
								<img src={flight.airline.logo} alt="logo" className="h-6" />
								<div>
									<div className="font-medium">{flight.airline.name}</div>
									<div className="text-sm text-gray-600">
										{flight.flightCode}
									</div>
								</div>
								<div className="ml-auto text-center font-semibold">
									<div>
										{new Date(flight.departureTime).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
											hour12: false,
										})}
									</div>
									<div>→</div>
									<div>
										{new Date(flight.arrivalTime).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
											hour12: false,
										})}
									</div>
								</div>
							</div>

							<div className="text-sm text-gray-700 flex justify-between">
								<div>
									Hành lý xách tay: {seatClass?.baggage?.hand || "1 kiện 07 kg"}
								</div>
								<div>
									Hành lý ký gửi:{" "}
									{seatClass?.baggage?.checked || "Không bao gồm"}
								</div>
							</div>
						</div>

						{showDetails && (
							<div className="mt-3 text-sm text-gray-600 space-y-1">
								<div>
									Ngày bay:{" "}
									{new Date(flight.departureTime).toLocaleDateString()}
								</div>
								<div>
									Sân bay: {flight.from?.name} → {flight.to?.name}
								</div>
								<div>Loại máy bay: {flight.aircraft}</div>
							</div>
						)}
					</div>

					<div className="bg-white rounded-lg shadow p-4 space-y-2">
						<h4 className="text-base font-semibold">Thông tin liên hệ</h4>
						<div>Họ tên: {contact.fullName}</div>
						<div>Số điện thoại: {contact.phone}</div>
						<div>Email: {contact.email}</div>
					</div>

					<div className="bg-white rounded-lg shadow p-4 space-y-2">
						<h4 className="text-base font-semibold">Hành khách</h4>
						<div>Họ tên: {passenger.fullName}</div>
						<div>
							Ngày sinh:{" "}
							{new Date(passenger.birthDate).toLocaleDateString("vi-VN")}
						</div>
						<div>Giới tính: {passenger.gender === "male" ? "Nam" : "Nữ"}</div>

						<div>Quốc tịch: {passenger.nationality}</div>
					</div>
				</div>

				<div className="w-full lg:w-1/3 bg-white rounded-lg shadow p-6 h-fit">
					<h4 className="text-base font-semibold mb-4">Chi tiết giá</h4>
					<div className="flex justify-between text-sm mb-2">
						<span>Vé máy bay (1 người lớn)</span>
						<span>{booking.totalAmount.toLocaleString()} ₫</span>
					</div>
					<div className="flex justify-between text-sm mb-2">
						<span>Phí tiện ích</span>
						<span>2,200 ₫</span>
					</div>
					<div className="flex justify-between text-sm border-t pt-3 font-bold">
						<span>Tổng</span>
						<span>{totalWithFee.toLocaleString()} ₫</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderPage;
