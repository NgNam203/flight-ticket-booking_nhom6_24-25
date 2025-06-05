import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/userService";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BookingHistory from "./BookingHistory";

const ProfileInfo = () => {
	const [profile, setProfile] = useState(null);
	const navigate = useNavigate();
	const isAdmin = profile?.role === "admin";
	const [editingField, setEditingField] = useState(null);
	const [editValue, setEditValue] = useState("");
	const [activeTab, setActiveTab] = useState("profile");
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
					navigate("/login");
					return;
				}
				const data = await getProfile(token);
				setProfile(data);
			} catch (error) {
				console.error("Lỗi khi tải thông tin cá nhân:", error);
				navigate("/login");
			}
		};
		fetchProfile();
	}, [navigate]);

	const formatDate = (dateStr) => {
		if (!dateStr) return "Chưa có thông tin";
		const date = new Date(dateStr);
		return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString();
	};

	const fields = [
		{ label: "Họ và Tên", value: profile?.fullName || "Chưa có thông tin" },
		{ label: "Địa chỉ Email", value: profile?.email },
		{
			label: "Số điện thoại",
			value: profile?.phone || "Chưa có thông tin",
			editable: true,
		},
		{
			label: "Ngày sinh",
			value: formatDate(profile?.birthdate),
			editable: true,
		},
		{
			label: "Giới tính",
			value: profile?.gender || "Chưa có thông tin",
			editable: true,
		},
		{
			label: "Quốc tịch",
			value: profile?.nationality || "Chưa có thông tin",
			editable: true,
		},
	];
	const keyMap = {
		"Số điện thoại": "phone",
		"Ngày sinh": "birthdate",
		"Giới tính": "gender",
		"Quốc tịch": "nationality",
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		navigate("/login");
	};
	const handleSave = async (fieldLabel) => {
		const fieldKey = keyMap[fieldLabel];
		if (!fieldKey) return;

		try {
			const token = localStorage.getItem("token");
			const updated = await updateProfile({ [fieldKey]: editValue }, token);
			setProfile((prev) => ({ ...prev, [fieldKey]: editValue }));
			setEditingField(null);
		} catch (error) {
			console.error("Lỗi khi cập nhật:", error);
		}
	};

	return (
		<>
			<Header />
			<div className="flex gap-5 p-5 font-sans">
				{/* Sidebar */}
				<div className="w-[250px] bg-white rounded-lg p-5 border border-gray-300">
					<div className="text-center">
						<img
							src="/assets/avatar-default.png"
							alt="Avatar"
							className="w-20 h-20 rounded-full mx-auto"
						/>
						<p className="font-bold mt-2">{profile?.fullName}</p>
						<p className="text-sm text-gray-600">{profile?.email}</p>
					</div>
					<div className="mt-6">
						<h4 className="text-red-600 font-semibold">Tài khoản</h4>
						<ul className="mt-2 space-y-2 text-sm text-gray-800">
							<li
								className={`cursor-pointer ${
									activeTab === "profile" ? "text-red-600 font-semibold" : ""
								}`}
								onClick={() => setActiveTab("profile")}>
								Thông tin cá nhân
							</li>
							<li
								className={`cursor-pointer ${
									activeTab === "bookings" ? "text-red-600 font-semibold" : ""
								}`}
								onClick={() => setActiveTab("bookings")}>
								Lịch sử đặt vé
							</li>
							{isAdmin && (
								<li
									className="cursor-pointer hover:text-red-600"
									onClick={() => navigate("/admin/flights")}>
									Admin
								</li>
							)}
							<li
								className="cursor-pointer hover:text-red-600"
								onClick={handleLogout}>
								Đăng xuất
							</li>
						</ul>
					</div>
				</div>

				{/* Main Content */}
				{activeTab === "profile" ? (
					<>
						<div className="flex-1 bg-white rounded-lg p-6 border border-gray-300">
							<h2 className="text-lg font-semibold mb-1">Thông tin cá nhân</h2>
							<p className="text-sm text-gray-600 mb-5">
								Cập nhật thông tin của Quý khách và tìm hiểu các thông tin này
								được sử dụng ra sao.
							</p>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{fields.map((field, index) => (
									<div
										className="flex justify-between items-center border-b border-gray-100 py-2"
										key={index}>
										<div className="flex flex-col">
											<span className="text-sm text-gray-600">
												{field.label}
											</span>
											{editingField === field.label ? (
												<>
													{field.label === "Ngày sinh" ? (
														<input
															type="date"
															value={editValue}
															onChange={(e) => setEditValue(e.target.value)}
															className="border rounded px-2 py-1 text-sm"
														/>
													) : (
														<input
															type="text"
															value={editValue}
															onChange={(e) => setEditValue(e.target.value)}
															className="border rounded px-2 py-1 text-sm"
														/>
													)}
												</>
											) : (
												<span className="font-medium">{field.value}</span>
											)}
										</div>
										{field.editable &&
											(editingField === field.label ? (
												<div className="space-x-2">
													<button
														onClick={() => handleSave(field.label)}
														className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
														Lưu
													</button>
													<button
														className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
														onClick={() => setEditingField(null)}>
														Hủy
													</button>
												</div>
											) : (
												<button
													className="bg-gray-100 text-sm text-gray-800 px-3 py-1 rounded hover:bg-gray-200"
													onClick={() => {
														setEditingField(field.label);
														if (
															field.label === "Ngày sinh" &&
															profile?.birthdate
														) {
															const date = new Date(profile.birthdate);
															const yyyyMMdd = date.toISOString().split("T")[0]; // 'YYYY-MM-DD'
															setEditValue(yyyyMMdd);
														} else {
															setEditValue(field.value);
														}
													}}>
													Chỉnh sửa
												</button>
											))}
									</div>
								))}
							</div>
						</div>
					</>
				) : (
					<BookingHistory />
				)}
			</div>
		</>
	);
};

export default ProfileInfo;
