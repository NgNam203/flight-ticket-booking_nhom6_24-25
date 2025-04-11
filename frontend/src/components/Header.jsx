// src/components/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "../assets/css/header.css";

const Header = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	const handleProfileClick = () => {
		navigate("/profile");
	};

	const handleLoginClick = () => {
		navigate("/login");
	};

	const handleLogoClick = () => {
		navigate("/");
	};

	return (
		<header className="home-header">
			<div
				className="logo"
				onClick={handleLogoClick}
				style={{ cursor: "pointer" }}>
				VEMAYBAY
			</div>
			<div className="hotline">Hotline: 0932 126 988</div>
			<div className="user-icon">
				{token ? (
					<FaUserCircle
						size={28}
						style={{ cursor: "pointer" }}
						onClick={handleProfileClick}
					/>
				) : (
					<button onClick={handleLoginClick} className="login-button">
						Đăng nhập
					</button>
				)}
			</div>
		</header>
	);
};

export default Header;
