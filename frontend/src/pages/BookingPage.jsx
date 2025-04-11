import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./BookingPage.css"; // Giả sử bạn có file CSS cho trang này
import { createBooking } from "../services/bookingService";
const BookingPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { flightInfo, seatClass, passengers } = location.state || {}; // Giả sử đã truyền state từ trang tìm kiếm
	const [showDetails, setShowDetails] = useState(false);
	const [showSoldOut, setShowSoldOut] = useState(false);

	// Form state
	const [passengerInfo, setPassengerInfo] = useState({
		firstName: "",
		lastName: "",
		birthDate: "",
		gender: "",
		nationality: "",
	});
	const [contactInfo, setContactInfo] = useState({
		title: "",
		firstName: "",
		lastName: "",
		phone: "",
		email: "",
	});

	const handlePassengerChange = (e) => {
		setPassengerInfo({ ...passengerInfo, [e.target.name]: e.target.value });
	};

	const handleContactChange = (e) => {
		setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const bookingData = {
			flightId: flightInfo._id,
			seatClass: seatClass.name,
			passengers: [
				{
					fullName:
						`${passengerInfo.lastName} ${passengerInfo.firstName}`.trim(),
					gender: passengerInfo.gender,
					nationality: passengerInfo.nationality,
					birthDate: passengerInfo.birthDate,
				},
			],
			contact: {
				fullName:
					`${contactInfo.title} ${contactInfo.lastName} ${contactInfo.firstName}`.trim(),
				phone: contactInfo.phone,
				email: contactInfo.email,
			},
			totalAmount: seatClass.price * passengers,
		};

		try {
			const token = localStorage.getItem("token");
			const res = await createBooking(bookingData, token);
			navigate("/payment", {
				state: {
					bookingId: res.bookingId,
					bookingCode: res.bookingCode,
					holdUntil: res.holdUntil,
					flightInfo,
					seatClass,
					passengers,
					totalAmount: bookingData.totalAmount,
				},
			});
		} catch (err) {
			console.error("Lỗi tạo booking:", err);

			// Kiểm tra lỗi từ backend
			if (err?.response?.data?.message === "Vé đã bán hết.") {
				setShowSoldOut(true); // Kích hoạt popup
			} else {
				alert("Đặt vé thất bại. Vui lòng thử lại.");
			}
		}
	};
	const handleReSearch = () => {
		if (!flightInfo?.from || !flightInfo?.to || !flightInfo?.departureTime) {
			return navigate("/search");
		}

		const from = flightInfo.from._id;
		const to = flightInfo.to._id;
		const passengersParam = passengers || 1;
		const departureDate = new Date(flightInfo.departureTime)
			.toISOString()
			.split("T")[0];

		navigate(
			`/search?from=${from}&to=${to}&passengers=${passengersParam}&departureDate=${departureDate}`
		);
	};

	return (
		<div className="booking-page">
			<Header />

			<div className="booking-container">
				{/* LEFT SIDE */}
				<div className="booking-left">
					{/* FLIGHT INFO */}
					<div className="flight-summary">
						<div className="route">
							<h3>
								{flightInfo.from?.city} → {flightInfo.to?.city}
							</h3>
							<button className="change-flight-btn" onClick={handleReSearch}>
								Đổi chuyến bay
							</button>
							<button onClick={() => setShowDetails(!showDetails)}>
								Chi tiết {showDetails ? "▲" : "▼"}
							</button>
						</div>
						<div className="flight-main">
							<img src={flightInfo.airline?.logo} alt="airline" />
							<div>
								<strong>{flightInfo.airline?.name}</strong>
								<div>{flightInfo.flightCode}</div>
							</div>
							<div className="time">
								{new Date(flightInfo.departureTime).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
									hour12: false,
								})}
								 - 
								{new Date(flightInfo.arrivalTime).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
									hour12: false,
								})}
							</div>
						</div>

						{showDetails && (
							<div className="flight-details">
								<div>
									Ngày bay:{" "}
									{new Date(flightInfo.departureTime).toLocaleDateString()}
								</div>
								<div>
									{flightInfo.from?.name} → {flightInfo.to?.name}
								</div>
								<div>Loại máy bay: {flightInfo.aircraft}</div>
							</div>
						)}
					</div>

					{/* CUSTOMER FORM */}
					<form className="customer-form" onSubmit={handleSubmit}>
						<h3>Hành khách 1 (Người lớn)</h3>
						<div className="form-group">
							<div style={{ flex: "1 1 45%" }}>
								<label>Họ (không dấu)</label>
								<input
									name="lastName"
									placeholder="Nhập họ"
									value={passengerInfo.lastName}
									onChange={handlePassengerChange}
									required
								/>
							</div>

							<div style={{ flex: "1 1 45%" }}>
								<label>Tên đệm và tên (không dấu)</label>
								<input
									name="firstName"
									placeholder="Nhập tên đệm và tên"
									value={passengerInfo.firstName}
									onChange={handlePassengerChange}
									required
								/>
							</div>

							<div style={{ flex: "1 1 45%" }}>
								<label>Ngày tháng năm sinh</label>
								<input
									name="birthDate"
									type="date"
									value={passengerInfo.birthDate}
									onChange={handlePassengerChange}
									required
								/>
							</div>

							<div style={{ flex: "1 1 45%" }}>
								<label>Giới tính</label>
								<select
									name="gender"
									value={passengerInfo.gender}
									onChange={handlePassengerChange}
									required>
									<option value="">Chọn giới tính</option>
									<option value="Nam">Nam</option>
									<option value="Nữ">Nữ</option>
								</select>
							</div>

							<div style={{ flex: "1 1 45%" }}>
								<label>Quốc tịch</label>
								<input
									name="nationality"
									placeholder="Nhập quốc tịch"
									value={passengerInfo.nationality}
									onChange={handlePassengerChange}
									required
								/>
							</div>
						</div>

						<h3>Thông tin liên hệ</h3>
						<div className="form-group">
							<div style={{ flex: "1 1 45%" }}>
								<label>Danh xưng *</label>
								<select
									name="title"
									value={contactInfo.title}
									placeholder="Chọn danh xưng"
									onChange={handleContactChange}
									required>
									<option value="">Chọn danh xưng</option>
									<option value="Anh">Ông</option>
									<option value="Chị">Bà</option>
								</select>
							</div>

							<div style={{ flex: "1 1 45%" }}>
								<label>Họ (không dấu) *</label>
								<input
									name="lastName"
									placeholder="Nhập họ"
									value={contactInfo.lastName}
									onChange={handleContactChange}
									required
								/>
							</div>

							<div style={{ flex: "1 1 45%" }}>
								<label>Tên đệm và tên (không dấu) *</label>
								<input
									name="firstName"
									placeholder="Nhập tên đệm và tên"
									value={contactInfo.firstName}
									onChange={handleContactChange}
									required
								/>
							</div>

							<div style={{ flex: "1 1 45%" }}>
								<label>Số điện thoại *</label>
								<div style={{ display: "flex", gap: "8px" }}>
									<select disabled style={{ width: "70px" }}>
										<option value="+84">+84</option>
									</select>
									<input
										name="phone"
										placeholder="Nhập số điện thoại"
										value={contactInfo.phone}
										onChange={handleContactChange}
										required
										style={{ flex: 1 }}
									/>
								</div>
							</div>

							<div style={{ flex: "1 1 45%" }}>
								<label>Email *</label>
								<input
									name="email"
									placeholder="Nhập email"
									value={contactInfo.email}
									onChange={handleContactChange}
									required
								/>
							</div>
						</div>

						<div className="submit-section">
							<p>
								<strong>Tổng</strong>{" "}
								<span style={{ color: "orange", fontWeight: 600 }}>
									{(seatClass.price * passengers).toLocaleString("vi-VN")} đ
								</span>
							</p>
							<button type="submit" className="submit-btn">
								Tiếp tục
							</button>
						</div>
					</form>
				</div>

				{/* RIGHT SIDE */}
				<div className="booking-right">
					<div className="baggage-info">
						<h4>Thông tin hành lý</h4>
						<p>Hành khách ({passengers} người lớn)</p>
						<ul>
							<li>Hành lý ký gửi: {seatClass.baggage.checked}</li>
							<li>Hành lý xách tay: {seatClass.baggage.hand}</li>
						</ul>

						<h4>Tổng</h4>
						<p>{(seatClass.price * passengers).toLocaleString("vi-VN")} đ</p>
					</div>
				</div>
			</div>
			{showSoldOut && (
				<div className="overlay">
					<div className="timeout-modal">
						<div className="icon">❗</div>
						<h2>Đã bán hết vé</h2>
						<p>
							Rất tiếc, vé của chuyến bay bạn chọn đã bán hết. Vui lòng chọn
							chuyến khác.
						</p>
						<div className="actions">
							<button className="btn-primary" onClick={handleReSearch}>
								Chọn chuyến bay khác
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default BookingPage;
