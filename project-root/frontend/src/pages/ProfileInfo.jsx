// /src/pages/ProfileInfo.jsx
import React, { useEffect, useState } from "react";
import { getProfile } from "../services/userService";
import { useNavigate } from "react-router-dom";
import "./ProfileInfo.css";
import Header from "../components/Header";

const ProfileInfo = () => {
	const [profile, setProfile] = useState(null);
	const navigate = useNavigate();
	const isAdmin = profile?.role === "admin";
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
		{ label: "Điểm vàng", value: profile?.goldPoints || "Đang cập nhật" },
		{ label: "Điểm thưởng", value: profile?.bonusPoints || "Đang cập nhật" },
		{ label: "Loại thẻ", value: profile?.cardType || "Đang cập nhật" },
		{
			label: "Điểm cần đạt để giữ hạng",
			value: profile?.keepRankPoints || "Đang cập nhật",
		},
		{
			label: "Điểm cần đạt để nâng hạng",
			value: profile?.upgradePoints || "Đang cập nhật",
		},
		{
			label: "Ngày xét nâng hạng",
			value: profile?.rankReviewDate || "Đang cập nhật",
		},
		{
			label: "Tổng số tour đã đi",
			value: profile?.totalTours || "Đang cập nhật",
		},
		{ label: "Địa chỉ Email", value: profile?.email },
		{
			label: "Số điện thoại",
			value: profile?.phone || "Chưa có thông tin",
			editable: true,
		},
		{
			label: "Ngày sinh",
			value: formatDate(profile?.birthDate),
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
		{
			label: "Địa chỉ",
			value: profile?.address || "Chưa có thông tin",
			editable: true,
		},
		{
			label: "CMND",
			value: profile?.cmnd || "Chưa có thông tin",
			editable: true,
		},
		{
			label: "Passport",
			value: profile?.passport || "Chưa có thông tin",
			editable: true,
		},
	];

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user"); // nếu bạn lưu user nữa
		navigate("/login");
	};

	return (
		<>
			<Header />
			<div className="profile-container">
				{/* Sidebar */}
				<div className="profile-sidebar">
					<div className="profile-avatar">
						<img src="/assets/avatar-default.png" alt="Avatar" />
						<p className="name">{profile?.fullName}</p>
						<p className="email">{profile?.email}</p>
					</div>
					<div className="profile-menu">
						<h4>Tài khoản</h4>
						<ul>
							<li className="active">Thông tin cá nhân</li>
							{isAdmin && (
								<li onClick={() => navigate("/admin/flights")}>Admin</li>
							)}
							<li onClick={handleLogout}>Đăng xuất</li>
						</ul>
					</div>
				</div>

				{/* Main Content */}
				<div className="profile-main">
					<h2>Thông tin cá nhân</h2>
					<p className="desc">
						Cập nhật thông tin của Quý khách và tìm hiểu các thông tin này được
						sử dụng ra sao.
					</p>

					<div className="profile-info-grid">
						{fields.map((field, index) => (
							<div className="profile-info-row" key={index}>
								<div className="info-left">
									<span className="label">{field.label}</span>
									<span className="value">{field.value}</span>
								</div>
								{field.editable && (
									<button className="edit-btn">Chỉnh sửa</button>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default ProfileInfo;
