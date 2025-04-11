import React, { useEffect, useState } from "react";
import {
	getAllAirports,
	createAirport,
	updateAirport,
	deleteAirport,
} from "../../services/airportService";

const AirportList = () => {
	const [airports, setAirports] = useState([]);
	const [editingId, setEditingId] = useState(null);
	const [formData, setFormData] = useState({ name: "", code: "", city: "" });
	const [newAirport, setNewAirport] = useState({
		name: "",
		code: "",
		city: "",
	});
	const token = localStorage.getItem("token");

	const fetchAirports = async () => {
		try {
			const data = await getAllAirports();
			setAirports(data);
		} catch (err) {
			console.error("Lỗi tải danh sách sân bay:", err);
		}
	};

	useEffect(() => {
		fetchAirports();
	}, []);

	const handleEdit = (airport) => {
		setEditingId(airport._id);
		setFormData({ name: airport.name, code: airport.code, city: airport.city });
	};

	const handleUpdate = async (id) => {
		try {
			await updateAirport(id, formData, token);
			setEditingId(null);
			fetchAirports();
		} catch (err) {
			console.error("Lỗi cập nhật:", err);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Bạn có chắc muốn xoá sân bay này?")) return;
		try {
			await deleteAirport(id, token);
			setAirports(airports.filter((a) => a._id !== id));
		} catch (err) {
			console.error("Lỗi xoá:", err);
		}
	};

	const handleCreate = async () => {
		try {
			await createAirport(newAirport, token);
			setNewAirport({ name: "", code: "", city: "" });
			fetchAirports();
		} catch (err) {
			console.error("Lỗi tạo mới:", err);
		}
	};

	return (
		<div className="airport-list">
			<h2>Quản lý sân bay</h2>

			<div style={{ marginBottom: "1rem" }}>
				<h4>Thêm sân bay mới:</h4>
				<input
					placeholder="Tên sân bay"
					value={newAirport.name}
					onChange={(e) =>
						setNewAirport({ ...newAirport, name: e.target.value })
					}
				/>
				<input
					placeholder="Mã"
					value={newAirport.code}
					onChange={(e) =>
						setNewAirport({ ...newAirport, code: e.target.value })
					}
				/>
				<input
					placeholder="Thành phố"
					value={newAirport.city}
					onChange={(e) =>
						setNewAirport({ ...newAirport, city: e.target.value })
					}
				/>
				<button onClick={handleCreate}>Thêm</button>
			</div>

			<table border="1" cellPadding="6" width="100%">
				<thead>
					<tr>
						<th>Tên sân bay</th>
						<th>Mã</th>
						<th>Thành phố</th>
						<th>Hành động</th>
					</tr>
				</thead>
				<tbody>
					{airports.map((airport) => (
						<tr key={airport._id}>
							<td>
								{editingId === airport._id ? (
									<input
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
									/>
								) : (
									airport.name
								)}
							</td>
							<td>
								{editingId === airport._id ? (
									<input
										value={formData.code}
										onChange={(e) =>
											setFormData({ ...formData, code: e.target.value })
										}
									/>
								) : (
									airport.code
								)}
							</td>
							<td>
								{editingId === airport._id ? (
									<input
										value={formData.city}
										onChange={(e) =>
											setFormData({ ...formData, city: e.target.value })
										}
									/>
								) : (
									airport.city
								)}
							</td>
							<td>
								{editingId === airport._id ? (
									<>
										<button onClick={() => handleUpdate(airport._id)}>
											Lưu
										</button>
										<button onClick={() => setEditingId(null)}>Huỷ</button>
									</>
								) : (
									<>
										<button onClick={() => handleEdit(airport)}>Sửa</button>
										<button onClick={() => handleDelete(airport._id)}>
											Xoá
										</button>
									</>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default AirportList;
