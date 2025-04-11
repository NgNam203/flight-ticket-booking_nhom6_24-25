import React, { useEffect, useState } from "react";
import { getAllBookings } from "../../services/bookingService";
// import "../../assets/css/booking.css";

const BookingList = () => {
	const [bookings, setBookings] = useState([]);

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const token = localStorage.getItem("token");
				const data = await getAllBookings(token);
				setBookings(data);
			} catch (error) {
				console.error("Lỗi khi tải danh sách đặt vé:", error);
			}
		};
		fetchBookings();
	}, []);

	return (
		<div className="booking-list">
			<h2>Danh sách đặt vé</h2>
			{bookings.length === 0 ? (
				<p>Không có đơn đặt vé nào.</p>
			) : (
				<table border="1" cellPadding="6" width="100%">
					<thead>
						<tr>
							<th>Người đặt</th>
							<th>Email</th>
							<th>Ngày đặt</th>
							<th>Tổng tiền</th>
							<th>Trạng thái</th>
							<th>Chuyến bay</th>
							<th>Hành khách</th>
							<th>Thanh toán</th>
						</tr>
					</thead>
					<tbody>
						{bookings.map((b) => (
							<tr key={b._id}>
								<td>{b.user?.fullName || "(Không có tên)"}</td>
								<td>{b.contact?.email}</td>
								<td>{new Date(b.createdAt).toLocaleString()}</td>
								<td>{b.totalAmount.toLocaleString()} ₫</td>
								<td
									style={{
										color:
											b.status === "pending"
												? "orange"
												: b.status === "expired"
												? "red"
												: "green",
									}}>
									{b.status === "pending"
										? "Đang chờ"
										: b.status === "expired"
										? "Đã hết hạn"
										: "Đã thanh toán"}
								</td>
								<td>
									<ul>
										{b.flights.map((f, idx) => (
											<li key={idx}>
												<strong>{f.flight?.airline?.name}</strong> (
												{f.seatClass})<br />
												{f.flight?.flightCode} — {f.flight?.from?.name} →{" "}
												{f.flight?.to?.name}
												<br />
												{new Date(f.flight?.departureTime).toLocaleString(
													"vi-VN"
												)}
											</li>
										))}
									</ul>
								</td>
								<td>
									<ul>
										{b.passengers.map((p, idx) => (
											<li key={idx}>
												{p.fullName} ({p.gender}) - {p.nationality}
											</li>
										))}
									</ul>
								</td>
								<td>{b.paymentMethod || "N/A"}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default BookingList;
