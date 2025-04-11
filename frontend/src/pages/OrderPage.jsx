import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookingById } from "../services/bookingService";
import "./OrderPage.css";
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
				setBooking(data);
			} catch (err) {
				console.error("Lỗi khi tải thông tin đặt vé:", err);
			}
		};
		fetchBooking();
	}, [id]);

	if (!booking) return <div>Loading...</div>;

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
			.split("T")[0]; // YYYY-MM-DD

		navigate(
			`/search?from=${from}&to=${to}&passengers=${passengersParam}&departureDate=${departureDate}&passengers=1`
		);
	};
	return (
		<div className="confirmation-page">
			<Header />
			<div
				className={`confirmation-header ${
					isPaid ? "blue-box" : isExpired ? "expired-box" : "orange-box"
				}`}>
				<div>
					<h3>
						{isPaid
							? "Xác nhận đặt vé"
							: isExpired
							? "Hết thời gian thanh toán"
							: "Chờ thanh toán"}
					</h3>
					<p>
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
				</div>

				{/* Nút hành động */}
				{!isPaid && !isExpired && (
					<button
						className="pay-now-button"
						onClick={() =>
							navigate("/payment", {
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
						}>
						Thanh toán ngay
					</button>
				)}
				{isExpired && (
					<button className="pay-now-button" onClick={handleReSearch}>
						Đặt lại
					</button>
				)}
			</div>

			{!isPaid && (
				<div className="note-orange">
					<p>
						Vui lòng khai báo thông tin để xuất hóa đơn VAT điện tử trong vòng
						72h sau khi hoàn thành mua vé và dịch vụ bổ trợ.
					</p>
				</div>
			)}

			<div className="confirmation-container">
				<div className="left">
					<div className="section">
						<h4>Thông tin hành trình</h4>
						<div className="flight-summary">
							<div className="route">
								{flight.from.city} → {flight.to.city}
								<button onClick={() => setShowDetails(!showDetails)}>
									Chi tiết {showDetails ? "▲" : "▼"}
								</button>
							</div>

							<div className="flight-box">
								<div className="badge">Chiều đi</div>
								<div className="flight-main">
									<img src={flight.airline.logo} alt="logo" height={24} />
									<div>
										<div>{flight.airline.name}</div>
										<div>{flight.flightCode}</div>
									</div>
									<div className="flight-times">
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
								<div className="baggage">
									<div>
										Hành lý xách tay:{" "}
										{seatClass?.baggage?.hand || "1 kiện 07 kg"}
									</div>
									<div>
										Hành lý ký gửi:{" "}
										{seatClass?.baggage?.checked || "Không bao gồm"}
									</div>
									<div>Số ghế: N/A</div>
								</div>
							</div>
							{showDetails && (
								<div className="flight-details">
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
					</div>

					<div className="section">
						<h4>Thông tin liên hệ</h4>
						<div>Họ tên: {contact.fullName}</div>
						<div>Số điện thoại: {contact.phone}</div>
						<div>Email: {contact.email}</div>
					</div>

					<div className="section">
						<h4>Hành khách</h4>
						<div>Họ tên: {passenger.fullName}</div>
						<div>
							Ngày sinh: {new Date(passenger.birthDate).toLocaleDateString()}
						</div>
						<div>Giới tính: {passenger.gender}</div>
						<div>Quốc tịch: {passenger.nationality}</div>
					</div>
				</div>

				<div className="right">
					<h4>Chi tiết giá</h4>
					<div className="price-row">
						<span>Vé máy bay (1 người lớn)</span>
						<span>{booking.totalAmount.toLocaleString()} ₫</span>
					</div>
					<div className="price-row">
						<span>Phí tiện ích</span>
						<span>2,200 ₫</span>
					</div>
					<div className="price-row total">
						<strong>Tổng</strong>
						<strong>{totalWithFee.toLocaleString()} ₫</strong>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderPage;
