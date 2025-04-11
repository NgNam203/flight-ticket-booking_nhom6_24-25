import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getBookingById, payBooking } from "../services/bookingService";
import "./PaymentPage.css";

const PaymentPage = () => {
	const location = useLocation();
	const state = location.state;
	const navigate = useNavigate();

	// bookingId lấy từ state hoặc từ query
	const bookingId =
		state?.bookingId || new URLSearchParams(location.search).get("bookingId");

	const [booking, setBooking] = useState(null);
	const [expired, setExpired] = useState(false);
	const [selectedMethod, setSelectedMethod] = useState(
		"Chuyển khoản Ngân hàng / QR Code"
	);
	const [agreed, setAgreed] = useState(false);
	const [countdown, setCountdown] = useState(0);
	const [isPaid, setIsPaid] = useState(false);

	// Fallback nếu state không có
	const flightInfo = state?.flightInfo || booking?.flights[0]?.flight;
	const seatClass = state?.seatClass || booking?.flights[0]?.seatClass;
	const passengers = state?.passengers || booking?.passengers || [];
	// const totalAmount = state?.totalAmount || booking?.totalPrice || 0;
	const bookingCode = state?.bookingCode || booking?.bookingCode;
	const holdUntil = state?.holdUntil || booking?.holdUntil;

	const passengerCount = passengers?.length || 1;
	const seatPrice = seatClass?.price || booking?.flights?.[0]?.seatPrice || 0;
	const utilityFee = 2200;
	const totalPrice = seatPrice * passengerCount + utilityFee;
	useEffect(() => {
		if (!bookingId) return;

		const fetchBooking = async () => {
			try {
				const data = await getBookingById(bookingId);
				setBooking(data);
			} catch (err) {
				console.error("Lỗi khi tải thông tin booking:", err);
			}
		};

		fetchBooking();
	}, [bookingId]);

	// Tính thời gian giữ chỗ còn lại
	useEffect(() => {
		if (!holdUntil) return;
		const endTime = new Date(holdUntil).getTime();

		const interval = setInterval(() => {
			const now = new Date().getTime();
			const diff = Math.max(0, Math.floor((endTime - now) / 1000));
			setCountdown(diff);
			if (diff <= 0) {
				clearInterval(interval);
				setExpired(true);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [holdUntil]);

	useEffect(() => {
		if (!bookingId) return;
		const fetchStatus = async () => {
			try {
				const data = await getBookingById(bookingId);
				if (data.status === "paid") {
					setIsPaid(true);
				}
			} catch (err) {
				console.error("Lỗi kiểm tra trạng thái đơn:", err);
			}
		};
		fetchStatus();
	}, [bookingId]);

	const formatTime = (seconds) => {
		const m = String(Math.floor(seconds / 60)).padStart(2, "0");
		const s = String(seconds % 60).padStart(2, "0");
		return `${m}:${s}`;
	};

	const handlePayment = async () => {
		if (!agreed) return alert("Vui lòng đồng ý với điều khoản để tiếp tục.");

		try {
			await payBooking(bookingId, selectedMethod);
			navigate(`/order/${bookingId}`, {
				state: {
					bookingId,
					bookingCode,
					flightInfo,
					seatClass,
					passengers,
					totalAmount: totalPrice,
					paymentMethod: selectedMethod,
				},
			});
		} catch (error) {
			alert("Thanh toán thất bại. Vui lòng thử lại.");
		}
	};

	const handleReSearch = () => {
		if (!flightInfo?.from || !flightInfo?.to || !flightInfo.departureTime) {
			return navigate("/search");
		}

		const from = flightInfo.from._id;
		const to = flightInfo.to._id;
		const passengersParam = passengers || 1;
		const departureDate = new Date(flightInfo.departureTime)
			.toISOString()
			.split("T")[0]; // YYYY-MM-DD

		navigate(
			`/search?from=${from}&to=${to}&passengers=${passengersParam}&departureDate=${departureDate}&passengers=1`
		);
	};

	if (!booking) {
		return (
			<div className="payment-page">
				<Header />
				<p className="loading">Đang tải thông tin đặt vé...</p>
			</div>
		);
	}

	if (isPaid) {
		return (
			<div className="payment-page">
				<Header />
				<div className="payment-success-box">
					<h2>🎉 Thanh toán thành công</h2>
					<p>
						Cảm ơn bạn đã hoàn tất đơn hàng <strong>{bookingCode}</strong>.
						<br />
						Chúc bạn có một chuyến đi an toàn và vui vẻ!
					</p>
					<button
						className="btn-primary"
						onClick={() => navigate(`/order/${bookingId}`)}>
						Xem chi tiết đơn hàng
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="payment-page">
			<Header />
			<div className="payment-container">
				<div className="payment-left">
					<h3>Chọn hình thức thanh toán</h3>
					<p className="expire-time">
						Giá vé đang được giữ, bạn cần thanh toán trong{" "}
						<strong>{formatTime(countdown)}</strong>
					</p>
					<div className="payment-options">
						{[
							"Chuyển khoản Ngân hàng / QR Code",
							"Thẻ ATM Nội Địa",
							"Thẻ Quốc Tế",
							"Thanh toán sau",
						].map((option) => (
							<label key={option} className="payment-option">
								<input
									type="radio"
									name="paymentMethod"
									value={option}
									checked={selectedMethod === option}
									onChange={(e) => setSelectedMethod(e.target.value)}
								/>
								{option}
							</label>
						))}
					</div>
					<div className="agree-section">
						<label>
							<input
								checked={agreed}
								onChange={(e) => setAgreed(e.target.checked)}
								type="checkbox"
							/>
							Tôi đã đọc và đồng ý với các{" "}
							<span className="fake-link">Điều khoản và điều kiện</span> &{" "}
							<span className="fake-link">Chính sách quyền riêng tư</span>
						</label>
					</div>
					<button
						className="pay-btn"
						disabled={!agreed}
						onClick={handlePayment}>
						Thanh toán {totalPrice.toLocaleString("vi-VN")} đ
					</button>
				</div>
				<div className="payment-right">
					<h3>Thông tin đặt chỗ</h3>
					<div className="booking-info">
						<div className="route">
							<strong>
								{flightInfo.from?.city} → {flightInfo.to?.city}
							</strong>
							<span>
								{new Date(flightInfo.departureTime).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
									hour12: false,
								})}
								{" - "}
								{new Date(flightInfo.arrivalTime).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
									hour12: false,
								})}
							</span>
						</div>
						<div className="date-airport">
							<span>
								{new Date(flightInfo.departureTime).toLocaleDateString()}
							</span>
							<span>{flightInfo.from?.name}</span>
							<span>{flightInfo.to?.name}</span>
						</div>
						<div className="price-section">
							<h4>Chi tiết giá</h4>
							<div className="row">
								<span>Vé máy bay</span>
								<span>
									{(seatPrice * passengerCount).toLocaleString("vi-VN")} đ
								</span>
							</div>
							<div className="row">
								<span>Phí tiện ích</span>
								<span>{utilityFee.toLocaleString("vi-VN")} đ</span>
							</div>
							<div className="row total">
								<span>Tổng</span>
								<span>{totalPrice.toLocaleString("vi-VN")} đ</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			{expired && (
				<div className="overlay">
					<div className="timeout-modal">
						<div className="icon">❗</div>
						<h2>Hết thời gian thanh toán</h2>
						<p>
							Đơn hàng đã quá thời gian thanh toán. Hãy chọn lại chuyến bay khác
							cho chuyến đi.
						</p>
						<div className="actions">
							<button className="btn-outline" onClick={() => navigate("/")}>
								Về trang chủ
							</button>
							<button className="btn-primary" onClick={handleReSearch}>
								Chọn lại chuyến bay
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PaymentPage;
