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
			<table>
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
							<td>{b.status}</td>
							<td>
								<ul>
									{b.flights.map((f, idx) => (
										<li key={idx}>
											{f.flight?.flightCode || "(Mã?)"} - {f.flight?.airline} (
											{f.seatClass})
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
		</div>
	);
};

export default BookingList;
