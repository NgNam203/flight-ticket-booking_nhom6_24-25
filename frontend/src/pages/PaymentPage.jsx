import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { getBookingById, payBooking } from "../services/bookingService";

const PaymentPage = () => {
	const location = useLocation();
	const state = location.state;
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const { id: bookingIdFromUrl } = useParams();
	const bookingId =
		state?.bookingId ||
		bookingIdFromUrl ||
		new URLSearchParams(location.search).get("bookingId");
	console.log("Booking ID:", bookingId);
	const [booking, setBooking] = useState(null);
	const [expired, setExpired] = useState(false);
	const [selectedMethod, setSelectedMethod] = useState(
		"Chuyển khoản Ngân hàng / QR Code"
	);
	const [agreed, setAgreed] = useState(false);
	const [countdown, setCountdown] = useState(0);
	const [isPaid, setIsPaid] = useState(false);

	const flightInfo = state?.flightInfo || booking?.flights[0]?.flight;
	const seatClass = state?.seatClass || booking?.flights[0]?.seatClass;
	const passengers = state?.passengers || booking?.passengers || [];
	const bookingCode = state?.bookingCode || booking?.bookingCode;
	const holdUntil = state?.holdUntil || booking?.holdUntil;

	const getConvenienceFee = (method) => {
		switch (method) {
			case "Chuyển khoản Ngân hàng / QR Code":
				return 2200;
			case "Thẻ ATM Nội Địa":
				return 13677;
			case "Thẻ Quốc Tế":
				return 50399;
			case "Thanh toán sau":
			default:
				return 0;
		}
	};

	const passengerCount = passengers?.length || 1;
	const seatPrice = seatClass?.price || booking?.flights?.[0]?.seatPrice || 0;
	const convenienceFee = getConvenienceFee(selectedMethod);
	const totalPrice = seatPrice * passengerCount + convenienceFee;
	const methodMap = {
		"Chuyển khoản Ngân hàng / QR Code": "bank",
		"Thẻ ATM Nội Địa": "atm",
		"Thẻ Quốc Tế": "international",
		"Thanh toán sau": "cod",
	};
	const backendMethod = methodMap[selectedMethod];

	useEffect(() => {
		if (!bookingId) return;
		const fetchBooking = async () => {
			try {
				const res = await getBookingById(bookingId);
				const bookingData = res.data;
				setBooking(bookingData);
				if (bookingData.status === "paid") setIsPaid(true);
			} catch (err) {
				console.error("Lỗi khi tải thông tin booking:", err);
			}
		};
		fetchBooking();
	}, [bookingId]);

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

	const formatTime = (seconds) => {
		const m = String(Math.floor(seconds / 60)).padStart(2, "0");
		const s = String(seconds % 60).padStart(2, "0");
		return `${m}:${s}`;
	};

	const handlePayment = async () => {
		if (!agreed) return alert("Vui lòng đồng ý với điều khoản để tiếp tục.");
		try {
			await payBooking(bookingId, backendMethod, token);
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
		if (!flightInfo?.from || !flightInfo?.to || !flightInfo.departureTime)
			return navigate("/search");
		navigate(
			`/search?from=${flightInfo.from._id}&to=${
				flightInfo.to._id
			}&departureDate=${
				new Date(flightInfo.departureTime).toISOString().split("T")[0]
			}&passengers=1`
		);
	};

	if (!booking)
		return (
			<div className="min-h-screen bg-gray-100">
				<Header />
				<p className="text-center pt-20 text-lg font-semibold">
					Đang tải thông tin đặt vé...
				</p>
			</div>
		);

	if (isPaid)
		return (
			<div className="min-h-screen bg-gray-100">
				<Header />
				<div className="max-w-xl mx-auto mt-20 p-10 bg-green-50 border border-green-400 rounded-lg text-center shadow">
					<h2 className="text-green-800 text-xl font-bold mb-4">
						🎉 Thanh toán thành công
					</h2>
					<p className="text-gray-700 text-base mb-6">
						Cảm ơn bạn đã hoàn tất đơn hàng <strong>{bookingCode}</strong>. Chúc
						bạn có một chuyến đi an toàn và vui vẻ!
					</p>
					<div className="flex justify-center gap-4">
						<button
							onClick={() => navigate(`/order/${bookingId}`)}
							className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded">
							Xem chi tiết đơn hàng
						</button>
						<button
							onClick={() => navigate("/")}
							className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded">
							Về trang chủ
						</button>
					</div>
				</div>
			</div>
		);

	return (
		<div className="bg-gray-100 min-h-screen">
			<Header />
			<div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto mt-8 px-4">
				<div className="flex-1 bg-white p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">
						Chọn hình thức thanh toán
					</h3>
					<p className="text-red-600 font-semibold mb-4">
						Giá vé đang được giữ, bạn cần thanh toán trong{" "}
						<strong>{formatTime(countdown)}</strong>
					</p>
					<div className="flex flex-col gap-3 mb-4">
						{[
							"Chuyển khoản Ngân hàng / QR Code",
							"Thẻ ATM Nội Địa",
							"Thẻ Quốc Tế",
							"Thanh toán sau",
						].map((option) => (
							<label key={option} className="flex items-center gap-2 text-sm">
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
					<div className="text-sm">
						<label className="flex items-start gap-2">
							<input
								type="checkbox"
								checked={agreed}
								onChange={(e) => setAgreed(e.target.checked)}
							/>
							<span>
								Tôi đã đọc và đồng ý với các{" "}
								<span className="text-blue-600 underline cursor-pointer">
									Điều khoản và điều kiện
								</span>{" "}
								&{" "}
								<span className="text-blue-600 underline cursor-pointer">
									Chính sách quyền riêng tư
								</span>
							</span>
						</label>
					</div>
					<button
						onClick={handlePayment}
						disabled={!agreed}
						className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded disabled:bg-gray-300">
						Thanh toán {totalPrice.toLocaleString("vi-VN")} đ
					</button>
				</div>
				<div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow h-fit">
					<h3 className="text-lg font-semibold mb-4">Thông tin đặt chỗ</h3>
					<div className="text-sm space-y-2">
						<div className="flex justify-between font-medium">
							<span>
								{flightInfo.from?.city} → {flightInfo.to?.city}
							</span>
							<span>
								{new Date(flightInfo.departureTime).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
									hour12: false,
								})}{" "}
								-{" "}
								{new Date(flightInfo.arrivalTime).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
									hour12: false,
								})}
							</span>
						</div>
						<div className="flex flex-col text-gray-600">
							<span>
								{new Date(flightInfo.departureTime).toLocaleDateString()}
							</span>
							<span>{flightInfo.from?.name}</span>
							<span>{flightInfo.to?.name}</span>
						</div>
						<div className="border-t pt-3 mt-3">
							<h4 className="font-semibold">Chi tiết giá</h4>
							<div className="flex justify-between py-1">
								<span>Vé máy bay</span>
								<span>
									{(seatPrice * passengerCount).toLocaleString("vi-VN")} đ
								</span>
							</div>
							<div className="flex justify-between py-1">
								<span>Phí tiện ích</span>
								<span>{convenienceFee.toLocaleString("vi-VN")} đ</span>
							</div>
							<div className="flex justify-between py-1 font-bold">
								<span>Tổng</span>
								<span>{totalPrice.toLocaleString("vi-VN")} đ</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			{expired && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
						<div className="text-4xl mb-3 text-yellow-500">❗</div>
						<h2 className="text-xl font-semibold text-yellow-700 mb-2">
							Hết thời gian thanh toán
						</h2>
						<p className="text-gray-700 mb-6">
							Đơn hàng đã quá thời gian thanh toán. Hãy chọn lại chuyến bay khác
							cho chuyến đi.
						</p>
						<div className="flex justify-center gap-4">
							<button
								onClick={() => navigate("/")}
								className="border border-yellow-500 text-yellow-500 px-4 py-2 rounded font-semibold">
								Về trang chủ
							</button>
							<button
								onClick={handleReSearch}
								className="bg-yellow-500 text-white px-4 py-2 rounded font-semibold">
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
