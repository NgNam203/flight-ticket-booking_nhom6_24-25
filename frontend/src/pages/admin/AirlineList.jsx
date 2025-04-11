import React, { useEffect, useState } from "react";
import {
	getAllAirlines,
	updateAirline,
	deleteAirline,
	createAirline,
} from "../../services/airlineService";

const AirlineList = () => {
	const [airlines, setAirlines] = useState([]);
	const [editingId, setEditingId] = useState(null);
	const [formData, setFormData] = useState({ name: "", code: "", logo: "" });
	const [newAirline, setNewAirline] = useState({
		name: "",
		code: "",
		logo: "",
	});
	const token = localStorage.getItem("token");

	const fetchAirlines = async () => {
		try {
			const data = await getAllAirlines();
			setAirlines(data);
		} catch (err) {
			console.error("Lỗi tải danh sách hãng bay:", err);
		}
	};

	useEffect(() => {
		fetchAirlines();
	}, []);

	const handleEdit = (airline) => {
		setEditingId(airline._id);
		setFormData({ name: airline.name, code: airline.code, logo: airline.logo });
	};

	const handleUpdate = async (id) => {
		try {
			await updateAirline(id, formData, token);
			setEditingId(null);
			fetchAirlines();
		} catch (err) {
			console.error("Lỗi cập nhật:", err);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Bạn có chắc muốn xoá hãng bay này?")) return;
		try {
			await deleteAirline(id, token);
			setAirlines(airlines.filter((a) => a._id !== id));
		} catch (err) {
			console.error("Lỗi xoá:", err);
		}
	};

	const handleCreate = async () => {
		try {
			await createAirline(newAirline, token);
			setNewAirline({ name: "", code: "", logo: "" });
			fetchAirlines();
		} catch (err) {
			console.error("Lỗi tạo mới:", err);
		}
	};

	return (
		<div className="airline-list">
			<h2>Quản lý hãng bay</h2>

			<div style={{ marginBottom: "1rem" }}>
				<h4>Thêm hãng bay mới:</h4>
				<input
					placeholder="Tên hãng"
					value={newAirline.name}
					onChange={(e) =>
						setNewAirline({ ...newAirline, name: e.target.value })
					}
				/>
				<input
					placeholder="Mã"
					value={newAirline.code}
					onChange={(e) =>
						setNewAirline({ ...newAirline, code: e.target.value })
					}
				/>
				<input
					placeholder="Logo URL"
					value={newAirline.logo}
					onChange={(e) =>
						setNewAirline({ ...newAirline, logo: e.target.value })
					}
				/>
				<button onClick={handleCreate}>Thêm</button>
			</div>

			<table border="1" cellPadding="6" width="100%">
				<thead>
					<tr>
						<th>Tên hãng</th>
						<th>Mã</th>
						<th>Logo</th>
						<th>Hành động</th>
					</tr>
				</thead>
				<tbody>
					{airlines.map((airline) => (
						<tr key={airline._id}>
							<td>
								{editingId === airline._id ? (
									<input
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
									/>
								) : (
									airline.name
								)}
							</td>
							<td>
								{editingId === airline._id ? (
									<input
										value={formData.code}
										onChange={(e) =>
											setFormData({ ...formData, code: e.target.value })
										}
									/>
								) : (
									airline.code
								)}
							</td>
							<td>
								{editingId === airline._id ? (
									<input
										value={formData.logo}
										onChange={(e) =>
											setFormData({ ...formData, logo: e.target.value })
										}
									/>
								) : airline.logo ? (
									<img src={airline.logo} alt={airline.name} width="60" />
								) : (
									"(Không có logo)"
								)}
							</td>
							<td>
								{editingId === airline._id ? (
									<>
										<button onClick={() => handleUpdate(airline._id)}>
											Lưu
										</button>
										<button onClick={() => setEditingId(null)}>Huỷ</button>
									</>
								) : (
									<>
										<button onClick={() => handleEdit(airline)}>Sửa</button>
										<button onClick={() => handleDelete(airline._id)}>
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

export default AirlineList;
