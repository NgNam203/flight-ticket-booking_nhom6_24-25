import React, { useEffect, useState } from "react";
import { getUserBookings } from "../services/bookingService";

const BookingHistory = () => {
	const [bookings, setBookings] = useState([]);

	useEffect(() => {
		const fetchBookings = async () => {
			const token = localStorage.getItem("token");
			const data = await getUserBookings(token);
			setBookings(data);
		};
		fetchBookings();
	}, []);

	return (
		<div>
			<h2 className="text-lg font-semibold mb-4">Lịch sử đặt vé</h2>
			{bookings.length === 0 ? (
				<p>Không có đơn đặt vé nào.</p>
			) : (
				<table className="min-w-full text-sm">
					<thead>
						<tr className="border-b">
							<th className="text-left p-2">Mã đặt vé</th>
							<th className="text-left p-2">Tuyến</th>
							<th className="text-left p-2">Ngày đi</th>
							<th className="text-left p-2">Trạng thái</th>
						</tr>
					</thead>
					<tbody>
						{bookings.map((booking) => (
							<tr key={booking._id} className="border-b">
								<td className="p-2">{booking.bookingCode}</td>
								<td className="p-2">
									{booking.flights[0]?.flight?.from?.city} →{" "}
									{booking.flights[0]?.flight?.to?.city}
								</td>
								<td className="p-2">
									{new Date(
										booking.flights[0]?.flight?.departureTime
									).toLocaleDateString()}
								</td>
								<td className="p-2 capitalize">{booking.status}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default BookingHistory;
