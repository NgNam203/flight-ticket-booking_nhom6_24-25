// src/components/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "../assets/css/header.css"; // sẽ tạo file này bên dưới

const Header = () => {
	const navigate = useNavigate();

	const handleProfileClick = () => {
		navigate("/profile");
	};

	return (
		<header className="home-header">
			<div className="logo">VEMAYBAY</div>
			<div className="hotline">Hotline: 0932 126 988</div>
			<div className="user-icon" onClick={handleProfileClick}>
				<FaUserCircle size={28} style={{ cursor: "pointer" }} />
			</div>
		</header>
	);
};

export default Header;
