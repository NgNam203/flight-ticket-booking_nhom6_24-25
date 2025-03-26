import React, { useEffect, useState } from "react";
import {
	getAllFlights,
	createFlight,
	deleteFlight,
	updateFlight,
} from "../../services/flightService";
import { getAllAirports } from "../../services/airportService";

const FlightList = () => {
	const [flights, setFlights] = useState([]);
	const [airports, setAirports] = useState([]);
	const [loading, setLoading] = useState(true);
	const [form, setForm] = useState({
		flightCode: "",
		airline: "",
		from: "",
		to: "",
		departureTime: "",
		arrivalTime: "",
		status: "scheduled",
		seatClasses: [],
	});
	const [editId, setEditId] = useState(null);
	const [seatClass, setSeatClass] = useState({
		name: "",
		price: "",
		totalSeats: "",
		availableSeats: "",
		baggage: {
			checked: "",
			hand: "",
		},
	});

	const token = localStorage.getItem("token");

	const fetchFlights = async () => {
		try {
			const data = await getAllFlights(token);
			setFlights(data);
		} catch (error) {
			console.error("Lỗi khi tải chuyến bay:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchAirports = async () => {
		try {
			const data = await getAllAirports();
			setAirports(data);
		} catch (err) {
			console.error("Lỗi khi tải sân bay:", err);
		}
	};

	useEffect(() => {
		fetchFlights();
		fetchAirports();
	}, []);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSeatChange = (e) => {
		const { name, value } = e.target;
		if (name === "checked" || name === "hand") {
			setSeatClass({
				...seatClass,
				baggage: { ...seatClass.baggage, [name]: value },
			});
		} else {
			setSeatClass({ ...seatClass, [name]: value });
		}
	};

	const addSeatClass = () => {
		setForm({ ...form, seatClasses: [...form.seatClasses, seatClass] });
		setSeatClass({
			name: "",
			price: "",
			totalSeats: "",
			availableSeats: "",
			baggage: { checked: "", hand: "" },
		});
	};

	const handleDeleteSeat = (index) => {
		const updated = form.seatClasses.filter((_, i) => i !== index);
		setForm({ ...form, seatClasses: updated });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				await updateFlight(editId, form, token);
				setEditId(null);
			} else {
				await createFlight(form, token);
			}

			setForm({
				flightCode: "",
				airline: "",
				from: "",
				to: "",
				departureTime: "",
				arrivalTime: "",
				status: "scheduled",
				seatClasses: [],
			});
			setSeatClass({
				name: "",
				price: "",
				totalSeats: "",
				availableSeats: "",
				baggage: { checked: "", hand: "" },
			});
			fetchFlights();
		} catch (err) {
			console.error("Lỗi khi lưu chuyến bay:", err);
		}
	};

	const handleEdit = (flight) => {
		setEditId(flight._id);
		setForm({
			flightCode: flight.flightCode,
			airline: flight.airline,
			from: flight.from?._id || "",
			to: flight.to?._id || "",
			departureTime: flight.departureTime.slice(0, 16),
			arrivalTime: flight.arrivalTime.slice(0, 16),
			status: flight.status,
			seatClasses: flight.seatClasses || [],
		});
		setSeatClass({
			name: "",
			price: "",
			totalSeats: "",
			availableSeats: "",
			baggage: { checked: "", hand: "" },
		});
	};

	const handleDelete = async (id) => {
		if (window.confirm("Bạn có chắc muốn xoá chuyến bay này?")) {
			await deleteFlight(id, token);
			fetchFlights();
		}
	};

	return (
		<div className="container">
			<h2>Quản lý chuyến bay</h2>

			<form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
				<input
					type="text"
					name="flightCode"
					placeholder="Mã chuyến"
					value={form.flightCode}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="airline"
					placeholder="Hãng"
					value={form.airline}
					onChange={handleChange}
					required
				/>
				<select name="from" value={form.from} onChange={handleChange} required>
					<option value="">-- Chọn sân bay đi --</option>
					{airports.map((a) => (
						<option key={a._id} value={a._id}>
							{a.name} ({a.code})
						</option>
					))}
				</select>
				<select name="to" value={form.to} onChange={handleChange} required>
					<option value="">-- Chọn sân bay đến --</option>
					{airports.map((a) => (
						<option key={a._id} value={a._id}>
							{a.name} ({a.code})
						</option>
					))}
				</select>
				<input
					type="datetime-local"
					name="departureTime"
					value={form.departureTime}
					onChange={handleChange}
					required
				/>
				<input
					type="datetime-local"
					name="arrivalTime"
					value={form.arrivalTime}
					onChange={handleChange}
					required
				/>
				<select name="status" value={form.status} onChange={handleChange}>
					<option value="scheduled">Lên lịch</option>
					<option value="cancelled">Đã hủy</option>
					<option value="completed">Hoàn tất</option>
					<option value="delayed">Trễ</option>
				</select>

				<h4>Hạng ghế</h4>
				<input
					type="text"
					name="name"
					placeholder="Tên hạng"
					value={seatClass.name}
					onChange={handleSeatChange}
				/>
				<input
					type="number"
					name="price"
					placeholder="Giá"
					value={seatClass.price}
					onChange={handleSeatChange}
				/>
				<input
					type="number"
					name="totalSeats"
					placeholder="Tổng ghế"
					value={seatClass.totalSeats}
					onChange={handleSeatChange}
				/>
				<input
					type="number"
					name="availableSeats"
					placeholder="Còn lại"
					value={seatClass.availableSeats}
					onChange={handleSeatChange}
				/>
				<input
					type="text"
					name="checked"
					placeholder="Hành lý ký gửi"
					value={seatClass.baggage.checked}
					onChange={handleSeatChange}
				/>
				<input
					type="text"
					name="hand"
					placeholder="Hành lý xách tay"
					value={seatClass.baggage.hand}
					onChange={handleSeatChange}
				/>
				<button type="button" onClick={addSeatClass}>
					Thêm hạng ghế
				</button>
				<ul>
					{form.seatClasses.map((sc, index) => (
						<li key={index}>
							{sc.name} - {sc.price}đ ({sc.totalSeats} ghế)
							<button onClick={() => handleDeleteSeat(index)}>Xoá</button>
						</li>
					))}
				</ul>
				<button type="submit">{editId ? "Cập nhật" : "Thêm chuyến bay"}</button>
			</form>

			{loading ? (
				<p>Đang tải...</p>
			) : (
				<table border="1" cellPadding="6" width="100%">
					<thead>
						<tr>
							<th>Mã</th>
							<th>Hãng</th>
							<th>From</th>
							<th>To</th>
							<th>Khởi hành</th>
							<th>Hạ cánh</th>
							<th>Trạng thái</th>
							<th>Hành động</th>
						</tr>
					</thead>
					<tbody>
						{flights.map((f) => (
							<tr key={f._id}>
								<td>{f.flightCode}</td>
								<td>{f.airline}</td>
								<td>{f.from?.name}</td>
								<td>{f.to?.name}</td>
								<td>{new Date(f.departureTime).toLocaleString()}</td>
								<td>{new Date(f.arrivalTime).toLocaleString()}</td>
								<td>{f.status}</td>
								<td>
									<button onClick={() => handleEdit(f)}>Sửa</button>
									<button
										onClick={() => handleDelete(f._id)}
										style={{ marginLeft: 5 }}>
										Xóa
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default FlightList;
