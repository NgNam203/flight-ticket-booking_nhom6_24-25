import React, { useEffect, useState } from "react";
import {
	getAllUsers,
	updateUser,
	deleteUser,
} from "../../services/userAdminService";
// import "../../assets/css/user.css";

const UserList = () => {
	const [users, setUsers] = useState([]);
	const [editingUserId, setEditingUserId] = useState(null);
	const [formData, setFormData] = useState({
		fullName: "",
		phone: "",
		role: "user",
	});

	const token = localStorage.getItem("token");

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const data = await getAllUsers(token);
				setUsers(data);
			} catch (error) {
				console.error("Lỗi khi tải người dùng:", error);
			}
		};
		fetchUsers();
	}, [token]);

	const handleEdit = (user) => {
		setEditingUserId(user._id);
		setFormData({
			fullName: user.fullName,
			phone: user.phone,
			role: user.role,
		});
	};

	const handleUpdate = async (id) => {
		try {
			await updateUser(id, formData, token);
			setEditingUserId(null);
			const updated = await getAllUsers(token);
			setUsers(updated);
		} catch (err) {
			console.error("Lỗi cập nhật:", err);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Bạn có chắc muốn xoá người dùng này?")) return;
		try {
			await deleteUser(id, token);
			setUsers(users.filter((u) => u._id !== id));
		} catch (err) {
			console.error("Lỗi xoá:", err);
		}
	};

	return (
		<div className="user-list">
			<h2>Quản lý người dùng</h2>
			<table>
				<thead>
					<tr>
						<th>Họ tên</th>
						<th>Email</th>
						<th>SĐT</th>
						<th>Vai trò</th>
						<th>Hành động</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user._id}>
							<td>
								{editingUserId === user._id ? (
									<input
										value={formData.fullName}
										onChange={(e) =>
											setFormData({ ...formData, fullName: e.target.value })
										}
									/>
								) : (
									user.fullName
								)}
							</td>
							<td>{user.email}</td>
							<td>
								{editingUserId === user._id ? (
									<input
										value={formData.phone}
										onChange={(e) =>
											setFormData({ ...formData, phone: e.target.value })
										}
									/>
								) : (
									user.phone
								)}
							</td>
							<td>
								{editingUserId === user._id ? (
									<select
										value={formData.role}
										onChange={(e) =>
											setFormData({ ...formData, role: e.target.value })
										}>
										<option value="user">User</option>
										<option value="admin">Admin</option>
									</select>
								) : (
									user.role
								)}
							</td>
							<td>
								{editingUserId === user._id ? (
									<>
										<button onClick={() => handleUpdate(user._id)}>Lưu</button>
										<button onClick={() => setEditingUserId(null)}>Huỷ</button>
									</>
								) : (
									<>
										<button onClick={() => handleEdit(user)}>Sửa</button>
										<button onClick={() => handleDelete(user._id)}>Xoá</button>
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

export default UserList;
