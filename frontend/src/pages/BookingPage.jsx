import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { createBooking } from "../services/bookingService";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localeData from "dayjs/plugin/localeData";
import "dayjs/locale/vi";

dayjs.extend(duration);
dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localeData);
dayjs.locale("vi");

const BookingPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { flight, seatClass, totalAmount } = location.state || {};

	const [passengerInfo, setPassengerInfo] = useState({
		lastName: "",
		firstName: "",
		dob: "",
		gender: "",
		nationality: "",
	});

	const [contactInfo, setContactInfo] = useState({
		title: "",
		fullName: "",
		phone: "",
		email: "",
	});

	const [voucher, setVoucher] = useState("");
	const [errors, setErrors] = useState({});
	useEffect(() => {
		if (!flight || !seatClass || !totalAmount) navigate("/");
	}, [flight, seatClass, totalAmount, navigate]);

	const validate = () => {
		const newErrors = {};

		if (!passengerInfo.lastName) newErrors.lastName = "Chưa nhập họ";
		if (!passengerInfo.firstName)
			newErrors.firstName = "Chưa nhập tên đệm và tên";
		if (!passengerInfo.dob) newErrors.dob = "Nhập ngày sinh";
		if (!passengerInfo.gender) newErrors.gender = "Chọn giới tính";
		if (!passengerInfo.nationality)
			newErrors.nationality = "Chưa chọn quốc tịch";

		if (!contactInfo.title) newErrors.title = "Chọn danh xưng";
		if (!contactInfo.fullName)
			newErrors.fullName = "Vui lòng nhập đầy đủ họ và tên";
		if (!contactInfo.phone) newErrors.phone = "Nhập số điện thoại";
		if (!contactInfo.email) newErrors.email = "Nhập email";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	const handleBooking = async () => {
		try {
			const token = localStorage.getItem("token");
			const data = {
				flightId: flight._id,
				seatClass: seatClass.name,
				passengers: [
					{
						fullName: `${passengerInfo.lastName} ${passengerInfo.firstName}`,
						gender:
							passengerInfo.gender === "Nam"
								? "male"
								: passengerInfo.gender === "Nữ"
								? "female"
								: "other",
						birthDate: passengerInfo.dob,
						nationality: passengerInfo.nationality,
					},
				],
				contact: contactInfo,
				totalAmount,
				paymentMethod: "cod",
			};
			console.log("Sending booking:", data);
			const res = await createBooking(data, token);
			navigate(`/payment?bookingId=${res.data.bookingId}`, {
				state: {
					bookingId: res.data.bookingId,
					bookingCode: res.data.bookingCode,
					flightInfo: flight,
					seatClass,
					passengers: data.passengers,
					holdUntil: res.data.holdUntil,
				},
			});
		} catch (err) {
			console.error(err);
			alert("Đặt vé thất bại. Vui lòng thử lại.");
		}
	};

	const inputClass = (name) =>
		`border rounded px-3 py-2 w-full text-sm placeholder-gray-400 ${
			errors[name] ? "border-red-500" : "border-gray-300"
		}`;
	const renderLabeledInput = (label, inputElement, errorKey) => (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-1">
				{label}
			</label>
			{inputElement}
			{errors[errorKey] && (
				<p className="text-red-500 text-xs mt-1">{errors[errorKey]}</p>
			)}
		</div>
	);
	return (
		<div className="min-h-screen bg-gray-100">
			<Header />
			<div className="max-w-7xl mx-auto p-4 lg:flex gap-6 mt-4">
				{/* LEFT */}
				<div className="flex-1 space-y-6">
					{/* Flight Info */}

					<div className="bg-white rounded shadow p-4">
						<div className="flex justify-between items-center mb-2">
							<h2 className="font-semibold text-lg">
								{flight.from.city} → {flight.to.city}
							</h2>
							<button
								onClick={() => navigate("/search")}
								className="text-sm text-orange-600 hover:underline">
								Đổi chuyến bay
							</button>
						</div>

						<div className="flex justify-between items-center border-b pb-2 mb-2">
							<div className="text-sm bg-orange-200 text-orange-700 px-2 py-1 rounded">
								Chiều đi
							</div>
							<div className="text-gray-600 text-sm">Chi tiết</div>
						</div>
						<div className="flex justify-between items-center">
							<div>
								<p className="font-semibold text-lg">
									{flight.airline?.name} - {flight.flightCode}
								</p>
								<p className="text-sm text-gray-600">
									{flight.from.name} → {flight.to.name}
								</p>
								<p className="text-sm text-gray-500">{flight.departureDate}</p>
							</div>
							<div className="text-right">
								{(() => {
									const departure = dayjs(flight.departureTime);
									const arrival = dayjs(flight.arrivalTime);
									const diff = dayjs.duration(arrival.diff(departure));
									const durationText = `${diff.hours()}g ${diff.minutes()}p`;
									const dayFrom = departure.format("dd, DD/MM/YYYY HH:mm");
									const dayTo = arrival.format("dd, DD/MM/YYYY HH:mm");

									return (
										<>
											<p className="text-sm text-gray-700 font-medium">
												{dayFrom} → {dayTo}
											</p>
											<p className="text-xs text-gray-500">
												Bay thẳng • {durationText}
											</p>
											<p className="text-xs text-gray-500">
												Loại máy bay: {flight.aircraft || "Không rõ"}
											</p>
										</>
									);
								})()}

								<p className="text-xs text-gray-500">{seatClass.name}</p>
							</div>
						</div>
					</div>

					{/* Passenger Info */}
					<div className="bg-white rounded shadow p-4">
						<h3 className="font-bold mb-4">Hành khách 1 (Người lớn)</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{renderLabeledInput(
								"Họ (không dấu)",
								<input
									type="text"
									placeholder="Nhập họ"
									className={inputClass("lastName")}
									value={passengerInfo.lastName}
									onChange={(e) =>
										setPassengerInfo({
											...passengerInfo,
											lastName: e.target.value,
										})
									}
								/>,
								"lastName"
							)}
							{renderLabeledInput(
								"Tên đệm và tên (không dấu)",
								<input
									type="text"
									placeholder="Nhập tên đệm và tên"
									className={inputClass("firstName")}
									value={passengerInfo.firstName}
									onChange={(e) =>
										setPassengerInfo({
											...passengerInfo,
											firstName: e.target.value,
										})
									}
								/>,
								"firstName"
							)}

							{renderLabeledInput(
								"Ngày tháng năm sinh",
								<input
									type="date"
									className={inputClass("dob")}
									value={passengerInfo.dob}
									onChange={(e) =>
										setPassengerInfo({ ...passengerInfo, dob: e.target.value })
									}
								/>,
								"dob"
							)}
							{renderLabeledInput(
								"Giới tính",
								<select
									className={inputClass("gender")}
									value={passengerInfo.gender}
									onChange={(e) =>
										setPassengerInfo({
											...passengerInfo,
											gender: e.target.value,
										})
									}>
									<option value="">Chọn</option>
									<option value="Nam">Nam</option>
									<option value="Nữ">Nữ</option>
								</select>,
								"gender"
							)}
							{renderLabeledInput(
								"Quốc tịch",
								<select
									className={`${inputClass("nationality")} md:col-span-2`}
									value={passengerInfo.nationality}
									onChange={(e) =>
										setPassengerInfo({
											...passengerInfo,
											nationality: e.target.value,
										})
									}>
									<option value="">Chọn</option>
									<option value="Việt Nam">Việt Nam</option>
									<option value="Khác">Khác</option>
								</select>,
								"nationality"
							)}
						</div>
					</div>

					{/* Contact Info */}
					<div className="bg-white rounded shadow p-4">
						<h3 className="font-bold mb-4">Thông tin liên hệ</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{renderLabeledInput(
								"Danh xưng",
								<select
									className={inputClass("title")}
									value={contactInfo.title}
									onChange={(e) =>
										setContactInfo({ ...contactInfo, title: e.target.value })
									}>
									<option value="">Chọn</option>
									<option value="Ông">Ông</option>
									<option value="Bà">Bà</option>
								</select>,
								"title"
							)}
							{renderLabeledInput(
								"Họ và tên",
								<input
									type="text"
									placeholder="Nguyễn Văn A"
									className={inputClass("fullName")}
									value={contactInfo.fullName}
									onChange={(e) =>
										setContactInfo({ ...contactInfo, fullName: e.target.value })
									}
								/>,
								"fullName"
							)}
							{renderLabeledInput(
								"Số điện thoại",
								<input
									type="tel"
									placeholder="0123456789"
									className={inputClass("phone")}
									value={contactInfo.phone}
									onChange={(e) =>
										setContactInfo({ ...contactInfo, phone: e.target.value })
									}
								/>,
								"phone"
							)}
							{renderLabeledInput(
								"Email",
								<input
									type="email"
									placeholder="email@example.com"
									className={inputClass("email")}
									value={contactInfo.email}
									onChange={(e) =>
										setContactInfo({ ...contactInfo, email: e.target.value })
									}
								/>,
								"email"
							)}
						</div>
					</div>

					{/* Invoice Info (optional) */}
					<div className="bg-white rounded shadow p-4">
						<h3 className="font-bold mb-4">Thông tin xuất hóa đơn</h3>
						<p className="text-gray-500">Tạm thời chưa hỗ trợ xuất hóa đơn</p>
					</div>
				</div>

				{/* RIGHT */}
				<div className="w-full lg:w-1/3 mt-6 lg:mt-0">
					<div className="bg-white rounded shadow p-4">
						<h3 className="font-bold mb-4">Thông tin hành lý</h3>
						<ul className="text-sm space-y-1">
							<li>
								Hành lý ký gửi: {seatClass?.baggage?.checked || "Không bao gồm"}
							</li>
							<li>
								Hành lý xách tay: {seatClass?.baggage?.hand || "1 kiện 07 kg"}
							</li>
						</ul>
					</div>

					<div className="bg-white rounded shadow p-4 mt-4">
						<h3 className="font-bold mb-4">Chi tiết giá</h3>
						<div className="text-sm mb-2">Vé máy bay</div>
						<div className="flex justify-between text-sm">
							<span>Hành khách (1 người lớn)</span>
							<span>{totalAmount?.toLocaleString()} ₫</span>
						</div>
						<div className="flex justify-between text-sm text-gray-500">
							<span>Giá vé</span>
							<span>{(seatClass?.price || 0).toLocaleString()} ₫</span>
						</div>
						<div className="flex justify-between text-sm text-gray-500">
							<span>Thuế và phí</span>
							<span>{(totalAmount - seatClass?.price).toLocaleString()} ₫</span>
						</div>
						<div className="mt-3">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Mã giảm giá
							</label>
							<input
								type="text"
								placeholder="Nhập mã"
								className={inputClass("voucher")}
								value={voucher}
								onChange={(e) => setVoucher(e.target.value)}
							/>
							<button className="ml-2 px-3 py-1 bg-gray-300 rounded text-sm">
								Sử dụng
							</button>
						</div>
						<div className="mt-4 flex justify-between font-bold text-lg">
							<span>Tổng</span>
							<span>{totalAmount.toLocaleString()} ₫</span>
						</div>
						<button
							onClick={() => {
								if (validate()) {
									handleBooking();
								}
							}}
							className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded">
							Tiếp tục
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookingPage;
